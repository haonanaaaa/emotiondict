import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './style/Gallery.css';

export const Gallery = () => {
    const emotions = [
        { id: 1, name: "寂众", pinyin: "jì zhòng", tag: ["悲伤"], context: "王成之秋，七月既望，苏子与客泛舟游于赤壁之下。清风徐来，水波不兴。举酒属客，请明月之诗，歌窈窕之章。少焉，月出于东山之上，徘徊于斗牛之间。王成之秋，七月既望，苏子与客泛舟游于赤壁之下。清风徐来，水波不兴。举酒属客，请明月之诗，歌窈窕之章。少焉，月出于东山之上，徘徊于斗牛之间。" },
        { id: 2, name: "空愉", pinyin: "kong yu", tag: ["快乐"], context: "无所事事的快乐。" },
        { id: 3, name: "替窘", pinyin: "ti jiong", tag: ["恐惧", "厌恶"], context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 4, name: "一二三", pinyin: "jì jì", tag: ["悲伤"], context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 5, name: "寂寂", pinyin: "jì jì", tag: ["悲伤"], context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 6, name: "寂寂", pinyin: "jì jì", tag: ["悲伤"], context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 7, name: "寂寂", pinyin: "jì jì", tag: ["悲伤"], context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 8, name: "寂寂", pinyin: "jì jì", tag: ["悲伤"], context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 9, name: "寂众", pinyin: "jì zhòng", tag: ["悲伤"], context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 10, name: "寂寂", pinyin: "jì jì", tag: ["悲伤"], context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 11, name: "孤寂", pinyin: "gū jì", tag: ["悲伤"], context: "内心深处的孤独感。" },
        { id: 12, name: "静怡", pinyin: "jìng yí", tag: ["平静"], context: "安静而愉悦的心情。" },
    ];
    
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    
    const handleCardClick = (id) => {
        setSelectedEmotion(emotions.find(e => e.id === id));
    };
    
    const closePopup = () => {
        setSelectedEmotion(null);
    };
    
    return (
        <>
            <div className="intro-section">
                <div className="intro-text">
                    <p>如果把人类的情感世界比喻成一幅画，这幅画本身包含的内容和色彩可能有几百个图层这么丰富，但每个人能感受到的层次是不一样的。提高情绪的感知能力能够帮助我们逐步展开面布的图层。</p>
                    <p>「未命名情绪词典」是一个能够探索和创造情绪词汇的动态词典，通过本计划用户可以学习新的情感词汇以及创造自己的情绪词汇，扩充情绪词汇库并且与他人进行分享，从而在日常生活中更准确地识别自己与他人的情绪，更好地体验自己在特定场景下的复杂情感。</p>
                    <div className="create-button">
                        <Link to="/generation" className="btn-primary">生成我的情绪词汇 →</Link>
                    </div>
                </div>
                <div className="quote-box">
                    <div className="quote-content">
                        <p>人类从未不会精简表达情感所需要的词，我们只会需要更多。</p>
                        <p>Human beings have never sought to reduce the number of words needed to express our emotions. We have always needed more.</p>
                        <p className="quote-author">—— Tiffany Watt Smith</p>
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
                            style={{ height: `${charCount * 120}px` }}
                        >
                            {[...emotion.name].map((char, charIndex) => (
                                <div key={charIndex} className="character-cell">
                                    <div className="character-text">{char}</div>
                                    <div className="character-background">
                                        <div className="background-line horizontal-line"></div>
                                        <div className="background-line vertical-line"></div>
                                        <div className="background-line diagonal-line diagonal-line-1"></div>
                                        <div className="background-line diagonal-line diagonal-line-2"></div>
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
                                    {/* 暂时用空div填充蓝色代替词云 */}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <footer className="footer-section">
                <p>2025 Unnamed Emotional Dictionary.</p>
            </footer>
        </>
    );
};

export default Gallery;