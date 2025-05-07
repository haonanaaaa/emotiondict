import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './style/Gallery.css';
import Wordcloud from './components/Wordcloud';

// 情感粒度的核心是主观情绪体验的细致性，可以根据用户输入的文本长度来判断

export const Gallery = () => {
    const emotions = [
        { id: 1, name: "寂众", pinyin: "jì zhòng", granularity: 0, potency: 0, intensity: 3, complexity: 5, wordcloud: ["情绪雪崩​", "​泪崩", "心神不定", "潸然泪下", "能量透支性哭泣", "​崩溃", "精神恍惚​", "失魂落魄", "悲从中来​", "​泪崩1", "心神不定1", "潸然泪下1", "能量透支性哭泣1", "​崩溃1", "精神恍惚1​", "失魂落魄1", "悲从中来1​"], context: "王成之秋，七月既望，苏子与客泛舟游于赤壁之下。清风徐来，水波不兴。举酒属客，请明月之诗，歌窈窕之章。少焉，月出于东山之上，徘徊于斗牛之间。王成之秋，七月既望，苏子与客泛舟游于赤壁之下。清风徐来，水波不兴。举酒属客，请明月之诗，歌窈窕之章。少焉，月出于东山之上，徘徊于斗牛之间。" },
        { id: 2, name: "空愉", pinyin: "kong yu", granularity: 5, potency: 1, intensity: 4, complexity: 1, context: "无所事事的快乐。" },
        { id: 3, name: "替窘", pinyin: "ti jiong", granularity: 2, potency: 0, intensity: 2, complexity: 3, context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 4, name: "一二三", pinyin: "jì jì", granularity: 3, potency: 0, intensity: 0, complexity: 2, context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 5, name: "寂寂", pinyin: "jì jì", granularity: 4, potency: 0, intensity: 2, complexity: 0, context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 6, name: "寂寂", pinyin: "jì jì", granularity: 5, potency: 1, intensity: 1, complexity: 3, context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 7, name: "寂寂", pinyin: "jì jì", granularity: 3, potency: 1, intensity: 0, complexity: 2, context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 8, name: "寂寂", pinyin: "jì jì", granularity: 1, potency: 1, intensity: 5, complexity: 2, context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 9, name: "寂众", pinyin: "jì zhòng", granularity: 0, potency: 0, intensity: 5, complexity: 5, context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 10, name: "寂寂", pinyin: "jì jì", granularity: 3, potency: 1, intensity: 2, complexity: 1, context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 11, name: "孤寂", pinyin: "gū jì", granularity: 5, potency: 0, intensity: 2, complexity: 4, context: "内心深处的孤独感。" },
        { id: 12, name: "静怡", pinyin: "jìng yí", granularity: 0, potency: 0, intensity: 1, complexity: 3, context: "安静而愉悦的心情。" },
    ];
    
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    
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
                                borderColor: emotion.potency === 1 ? 'var(--primary-color)' : '#0000ff'
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
                                            style={{ borderColor: emotion.potency === 1 ? 'var(--primary-color)' : '#0000ff' }}
                                        ></div>
                                        <div 
                                            className="background-line vertical-line"
                                            style={{ borderColor: emotion.potency === 1 ? 'var(--primary-color)' : '#0000ff' }}
                                        ></div>
                                        <div 
                                            className="background-line diagonal-line diagonal-line-1"
                                            style={{ borderColor: emotion.potency === 1 ? 'var(--primary-color)' : '#0000ff' }}
                                        ></div>
                                        <div 
                                            className="background-line diagonal-line diagonal-line-2"
                                            style={{ borderColor: emotion.potency === 1 ? 'var(--primary-color)' : '#0000ff' }}
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
                            style={{ borderColor: selectedEmotion.potency === 1 ? 'var(--primary-color)' : '#0000ff' }}
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
                                                <span className="analysis-value">0~20</span>
                                            </div>
                                            <div className="analysis-item">
                                                <span className="analysis-label">效价 Potency</span>
                                                <span className="analysis-value">消极</span>
                                            </div>
                                            <div className="analysis-item">
                                                <span className="analysis-label">强度 Intensity</span>
                                                <span className="analysis-value">50</span>
                                            </div>
                                            <div className="analysis-item">
                                                <span className="analysis-label">复杂度 Complexity</span>
                                                <span className="analysis-value">高</span>
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