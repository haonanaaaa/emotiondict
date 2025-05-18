import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Link } from 'react-router-dom';
import './style/Gallery.css';

import Wordcloud from './components/Wordcloud';
import SortControls from './components/SortControls';
import EmotionPopup from './components/EmotionPopup';

// 情感粒度的核心是主观情绪体验的细致性，可以根据用户输入的文本长度来判断
import { Navbar } from './NavBar';

export const Gallery = () => {
    const [emotions, setEmotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [animating, setAnimating] = useState(false);
    
    // 在组件挂载时从数据库获取情绪词汇
    useEffect(() => {
        const fetchEmotions = async () => {
            try {
                setLoading(true);
                // 根据环境选择API地址
                const apiUrl = process.env.NODE_ENV === 'production' 
                    ? '/api/emotions'  // 生产环境使用相对路径
                    : 'http://localhost:5000/api/emotions';  // 开发环境使用完整URL
                    
                const response = await fetch(apiUrl);
                
                if (!response.ok) {
                    throw new Error(`获取数据失败: ${response.status}`);
                }
                
                const data = await response.json();
                
                const formattedData = data.map(item => ({
                    id: item.id,
                    name: item.selectedWord || '未命名',
                    pinyin: item.selectedPinyin || '',
                    granularity: parseInt(item.granularity?.split(',')[0] || 0),
                    potency: parseInt(item.valence?.split(',')[0] || 0),
                    intensity: parseInt(item.intensity?.split(',')[0] || 0),
                    complexity: parseInt(item.complexity?.split(',')[0] || 0),
                    wordcloud: Object.keys(JSON.parse(item.wordFrequency || '{}')),
                    context: item.scene || '无描述',
                    createdAt: item.createdAt || new Date().toISOString()
                }));
                
                setEmotions(formattedData);
                setLoading(false);
            } catch (err) {
                console.error('获取情绪词汇失败:', err);
                setError(err.message);
                setLoading(false);
            }
        };
        
        fetchEmotions();
    }, []);
    
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    
    // 修改排序函数，添加动画控制
    const handleSort = (field) => {
        if (animating) return; // 如果动画正在进行中，忽略点击
        
        setAnimating(true); // 开始动画
        
        // 设置排序字段和顺序
        setSortBy(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        
        // 给动画足够的时间完成
        setTimeout(() => {
            setAnimating(false);
        }, 600); // 比过渡时间稍长一点
    };

    // 新增：获取排序后的情绪数据
    const getSortedEmotions = () => {
        return [...emotions].sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'granularity':
                    comparison = a.granularity - b.granularity;
                    break;
                case 'potency':
                    comparison = a.potency - b.potency;
                    break;
                case 'intensity':
                    comparison = a.intensity - b.intensity;
                    break;
                case 'complexity':
                    comparison = a.complexity - b.complexity;
                    break;
                case 'createdAt':
                    comparison = new Date(a.createdAt) - new Date(b.createdAt);
                    break;
                default:
                    return 0;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    };

    // 其余代码保持不变
    const handleCardClick = (id) => {
        setSelectedEmotion(emotions.find(e => e.id === id));
    };
    
    const closePopup = () => {
        setSelectedEmotion(null);
    };

    // 根据intensity计算文字颜色
    const getTextColor = (intensity) => {
        // 将intensity从0-5映射到0-204（因为204 = cc in hex）
        const colorValue = Math.floor((1 - intensity / 5) * 204);
        // 转换为十六进制并确保是两位数
        const hexValue = colorValue.toString(16).padStart(2, '0');
        return `#${hexValue}${hexValue}${hexValue}`;
    };

    // 根据complexity计算翻转效果
    const getFlipTransform = (complexity, isFirstChar) => {
        // 返回具体的 transform 值而不是空字符串
        let transform = 'scale(1, 1)';
        
        if (complexity === 2 && isFirstChar) {
            transform = 'scaleX(-1)';
        } else if (complexity === 3) {
            transform = 'scaleX(-1)';
        } else if (complexity === 4 && isFirstChar) {
            transform = 'scaleY(-1)';
        } else if (complexity === 5) {
            transform = 'scaleY(-1)';
        }
        
        return {
            initial: transform,
            hover: 'scale(1, 1)'  // 明确指定正常状态的 transform
        };
    };

    // 根据granularity计算模糊效果
    const getBlurEffect = (granularity) => {
        // 将granularity从0-5映射到0-1em
        return `blur(${(5 - granularity)}px)`;
    };

    return (
        <>
            <div className="intro-section">
                <div className="intro-text">
                    <p>如果把人类的情感世界比喻成一幅画，这幅画本身包含的内容和色彩可能有几百个图层这么丰富，但每个人能感受到的层次是不一样的。提高情绪的感知能力能够帮助我们逐步展开面布的图层。</p>
                    <p>「未命名情绪词典」是一个能够探索和创造情绪词汇的动态词典，通过这个词典，你可以学习新的情绪词汇、创造自己的情绪词汇，扩充情绪词汇库，从而在日常生活中更准确地识别自己与他人的情绪，更好地体验自己在不同场景下的复杂情感。</p>
                    <div className="create-button">
                        <Link to="/generation" className="btn-primary">生成我的情绪词汇 →</Link>
                    </div>
                </div>
                <div className="quote-box">
                    <div className="quote-content">
                        <p>人类从未不会精简表达情感所需要的词，我们只会需要更多。</p>
                        <p className='english'>Human beings have never sought to reduce the number of words needed to express our emotions. We have always needed more.</p>
                        <p className="english quote-author">—— Tiffany Watt Smith</p>
                    </div>
                </div>
            </div>
            
            <SortControls 
                sortBy={sortBy} 
                sortOrder={sortOrder} 
                onSort={handleSort} 
            />
            
            <LayoutGroup>
                <div className="characters-grid">
                    <AnimatePresence>
                        {getSortedEmotions().map((emotion) => {
                            const charCount = emotion.name.length;
                            
                            return (
                                <motion.div 
                                    key={emotion.id} 
                                    className="word-container"
                                    onClick={() => handleCardClick(emotion.id)}
                                    style={{ 
                                        height: `${charCount * 120}px`,
                                        borderColor: emotion.potency > 3 ? 'var(--primary-color)' : '#0000ff'
                                    }}
                                    layout
                                    layoutId={`emotion-${emotion.id}`}
                                    transition={{ 
                                        type: "spring", 
                                        stiffness: 150, 
                                        damping: 20,
                                        duration: 0.5 
                                    }}
                                    animate={{ 
                                        opacity: 1, 
                                        scale: 1,
                                        transition: { delay: 0.1 * Math.random() }
                                    }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    variants={{
                                        hover: {
                                            y: -5,
                                            backgroundColor: 'var(--background-light)',
                                            transition: { duration: 10 } // 增加过渡时间
                                        }
                                    }}
                                    whileHover="hover"
                                >
                                    {[...emotion.name].map((char, charIndex) => {
                                        const charId = `emotion-${emotion.id}-char-${charIndex}`;
                                        const flipTransform = getFlipTransform(emotion.complexity, charIndex === 0);
                                        
                                        return (
                                            <div key={charIndex} className="character-cell">
                                                <motion.div 
                                                    className="character-text"
                                                    style={{ 
                                                        color: getTextColor(emotion.intensity),
                                                        filter: getBlurEffect(emotion.granularity),
                                                        transformOrigin: 'center'
                                                    }}
                                                    initial={{ 
                                                        opacity: 0, 
                                                        y: 10,
                                                        transform: flipTransform.initial
                                                    }}
                                                    animate={{ 
                                                        opacity: 1, 
                                                        y: 0,
                                                        transform: flipTransform.initial
                                                    }}
                                                    transition={{ 
                                                        opacity: { delay: 0.05 * charIndex, duration: 0.3 },
                                                        y: { delay: 0.05 * charIndex, duration: 0.3 },
                                                        transform: { duration: 0.5 }
                                                    }}
                                                    variants={{
                                                        hover: { 
                                                            transform: flipTransform.hover,
                                                            color: 'var(--text-color)',
                                                            filter: 'none',
                                                            transition: { 
                                                                transform: {
                                                                    duration: 0.6,
                                                                    ease: [0.43, 0.13, 0.23, 0.96]
                                                                },
                                                                color: {
                                                                    duration: 0.4,
                                                                    ease: "easeOut"
                                                                },
                                                                filter: {
                                                                    duration: 0.5,
                                                                    ease: "easeOut"
                                                                }
                                                            }
                                                        }
                                                    }}
                                                >{char}</motion.div>
                                                <div className="character-background">
                                                    <div 
                                                        className="background-line horizontal-line"
                                                        style={{ borderColor: emotion.potency > 3 ? 'var(--primary-color)' : '#0000ff' }}
                                                    ></div>
                                                    <div 
                                                        className="background-line vertical-line"
                                                        style={{ borderColor: emotion.potency > 3 ? 'var(--primary-color)' : '#0000ff' }}
                                                    ></div>
                                                    <div 
                                                        className="background-line diagonal-line diagonal-line-1"
                                                        style={{ borderColor: emotion.potency > 3 ? 'var(--primary-color)' : '#0000ff' }}
                                                    ></div>
                                                    <div 
                                                        className="background-line diagonal-line diagonal-line-2"
                                                        style={{ borderColor: emotion.potency > 3 ? 'var(--primary-color)' : '#0000ff' }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </LayoutGroup>
            
            <EmotionPopup emotion={selectedEmotion} onClose={closePopup} />
            
            <footer className="footer-section">
                <p>2025 Unnamed Emotion Dictionary.</p>
            </footer>
        </>
    );
};

export default Gallery;