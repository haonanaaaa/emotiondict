import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './style/Gallery.css';

import Wordcloud from './components/Wordcloud';

// 情感粒度的核心是主观情绪体验的细致性，可以根据用户输入的文本长度来判断
import { Navbar } from './NavBar';

export const Gallery = () => {
    // 将静态数组替换为状态
    const [emotions, setEmotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
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
                
                // 处理API返回的数据，确保格式与组件期望的一致
                const formattedData = data.map(item => ({
                    id: item.id,
                    name: item.selectedWord || '未命名',
                    pinyin: item.selectedPinyin || '',
                    granularity: parseInt(item.granularity?.split(',')[0] || 0),
                    potency: parseInt(item.valence?.split(',')[0] || 0),
                    intensity: parseInt(item.intensity?.split(',')[0] || 0),
                    complexity: parseInt(item.complexity?.split(',')[0] || 0),
                    wordcloud: Object.keys(JSON.parse(item.wordFrequency || '{}')),
                    context: item.scene || '无描述'
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
        switch(complexity) {
            case 2:
                return isFirstChar ? 'scaleX(-1)' : 'none';
            case 3:
                return 'scaleX(-1)';
            case 4:
                return isFirstChar ? 'scaleY(-1)' : 'none';
            case 5:
                return 'scaleY(-1)';
            default:
                return 'none';
        }
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
            
            <div className="characters-grid">
                {emotions.map((emotion) => {
                    const charCount = emotion.name.length;
                    
                    return (
                        <div 
                            key={emotion.id} 
                            className="word-container"
                            onClick={() => handleCardClick(emotion.id)}
                            style={{ 
                                height: `${charCount * 120}px`,
                                borderColor: emotion.potency > 3 ? 'var(--primary-color)' : '#0000ff'
                            }}
                        >
                            {[...emotion.name].map((char, charIndex) => (
                                <div key={charIndex} className="character-cell">
                                    <div 
                                        className="character-text"
                                        style={{ 
                                            color: getTextColor(emotion.intensity),
                                            transform: getFlipTransform(emotion.complexity, charIndex === 0),
                                            filter: getBlurEffect(emotion.granularity),
                                            transition: 'all 0.3s ease'
                                        }}
                                    >{char}</div>
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
                            ))}
                        </div>
                    );
                })}
            </div>
            
            <AnimatePresence>
                {selectedEmotion && (
                    <motion.div 
                        className="emotion-popup-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closePopup}
                    >
                        <motion.div 
                            className="emotion-popup-content"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ borderColor: selectedEmotion.potency > 3 ? 'var(--primary-color)' : '#0000ff' }}
                        >
                            <div className="popup-close-button" onClick={closePopup}>
                                <FontAwesomeIcon icon={faTimes} />
                            </div>
                            
                            <div className="popup-container">
                                <div className="popup-left">
                                    <div className="emotion-header">
                                        <div className="emotion-pinyin">{selectedEmotion.pinyin}</div>
                                        <div className="emotion-name">{selectedEmotion.name}</div>
                                    </div>
                                    
                                    <div className="emotion-story">
                                        <p>{selectedEmotion.context}</p>

                                        <h4>情绪维度</h4>
                                        <div className="emotion-analysis">
                                            <div className="analysis-item">
                                                <span className="analysis-label">粒度 Granularity</span>
                                                <span className="analysis-value">{selectedEmotion.granularity}</span>
                                            </div>
                                            <div className="analysis-item">
                                                <span className="analysis-label">效价 Potency</span>
                                                <span className="analysis-value">{selectedEmotion.potency>3?'积极':'消极'}</span>
                                            </div>
                                            <div className="analysis-item">
                                                <span className="analysis-label">强度 Intensity</span>
                                                <span className="analysis-value">{selectedEmotion.intensity}</span>
                                            </div>
                                            <div className="analysis-item">
                                                <span className="analysis-label">复杂度 Complexity</span>
                                                <span className="analysis-value">{selectedEmotion.complexity}</span>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                
                                <div className="popup-right">
                                    <Wordcloud words={selectedEmotion.wordcloud} potency={selectedEmotion.potency} />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <footer className="footer-section">
                <p>2025 Unnamed Emotion Dictionary.</p>
            </footer>
        </>
    );
};

export default Gallery;