import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './style/Gallery.css';
import { Navbar } from './NavBar';

export const Gallery = () => {
    const emotions = [
        { id: 1, name: "寂众", pinyin: "jì zhòng", tag: ["悲伤"], context: "王成之秋，七月既望，苏子与客泛舟游于赤壁之下。清风徐来，水波不兴。举酒属客，请明月之诗，歌窈窕之章。少焉，月出于东山之上，徘徊于斗牛之间。" },
        { id: 2, name: "空愉", pinyin: "kong yu", tag: ["快乐"], context: "无所事事的快乐。" },
        { id: 3, name: "替窘", pinyin: "ti jiong", tag: ["恐惧", "厌恶"], context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 4, name: "寂寂", pinyin: "jì jì", tag: ["悲伤"], context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 5, name: "寂寂", pinyin: "jì jì", tag: ["悲伤"], context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 6, name: "寂寂", pinyin: "jì jì", tag: ["悲伤"], context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 7, name: "寂寂", pinyin: "jì jì", tag: ["悲伤"], context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 8, name: "寂寂", pinyin: "jì jì", tag: ["悲伤"], context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 9, name: "寂众", pinyin: "jì zhòng", tag: ["悲伤"], context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
        { id: 10, name: "寂寂", pinyin: "jì jì", tag: ["悲伤"], context: "当你在地铁中凝视陌生人时，突然惊觉对方也有完整的悲欢离合。这种'存在主义式的共情'，让日常的孤独感升华为对人类共同命运的悲悯。" },
    ];
    
    const [selectedCard, setSelectedCard] = useState(null);
    const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
    const [isFlipped, setIsFlipped] = useState(true);
    
    const handleCardClick = (id, e) => {
        if (!selectedCard) {
            const card = e.currentTarget.getBoundingClientRect();
            setCardPosition({
                top: card.top,
                left: card.left,
                width: card.width,
                height: card.height
            });
            setIsFlipped(true);
        }
        setSelectedCard(id === selectedCard ? null : id);
    };
    
    const handleModalCardClick = (e) => {
        e.stopPropagation();
        setIsFlipped(!isFlipped);
    };
    
    return (
        <>
            <div className="intro-section">
                <div className="intro-text">
                    <p>如果把人类的情感世界比喻成一幅画，这幅画本身包含的内容和色彩可能有几百个图层这么丰富，但每个人能感受到的层次是不一样的。提高情绪的感知能力能够帮助我们逐步展开面布的图层。</p>
                    <p>「未命名情绪词典」是一个能够探索和创造情绪词汇的动态词典，通过本计划用户可以学习新的情感词汇以及创造自己的情绪词汇，扩充情绪词汇库并且与他人进行分享，从而在日常生活中更准确地识别自己与他人的情绪，更好地体验自己在特定场景下的复杂情感。</p>
                    <div className="create-button">
                        <button>生成我的情绪词汇 →</button>
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
            
            <div className="cards-container">
                <div className="cards">
                    {emotions.map((emotion) => (
                        <div 
                            key={emotion.id} 
                            className="card-wrapper"
                        >
                            <div className="card-inner" onClick={(e) => handleCardClick(emotion.id, e)}>
                                <div className="card-front">
                                    <div className="card-color">
                                        <div className="card-color-inner">
                                            <div className="pinyin">{emotion.pinyin}</div>
                                            <div className="name">{emotion.name}</div>
                                        </div>
                                    </div>
                                    <div className="tag">{emotion.tag.join(', ')}</div>
                                    <div className="heart-icon">
                                        <FontAwesomeIcon icon={faHeart} style={{color: "#000000"}}/>
                                    </div>
                                </div>
                                <div className="card-back">
                                    <div className="card-back-inner">
                                        <div className="card-back-header">
                                            <div className="pinyin">{emotion.pinyin}</div>
                                            <div className="name">{emotion.name}</div>
                                        </div>
                                        <div className="context">
                                            {emotion.context}
                                        </div>
                                    </div>
                                    <div className="heart-icon">
                                        <FontAwesomeIcon icon={faHeart} style={{color: "#000000"}}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <AnimatePresence>
                {selectedCard && (
                    <motion.div 
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedCard(null)}
                    >
                        <motion.div 
                            className="modal-card-wrapper"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ 
                                x: cardPosition.left - window.innerWidth / 2 + cardPosition.width / 2,
                                y: cardPosition.top - window.innerHeight / 2 + cardPosition.height / 2,
                                scale: 0.7,
                                opacity: 0.5
                            }}
                            animate={{ 
                                x: 0, 
                                y: 0, 
                                scale: 1,
                                opacity: 1
                            }}
                            transition={{ 
                                duration: 0.5,
                                ease: "easeInOut"
                            }}
                            exit={{
                                x: cardPosition.left - window.innerWidth / 2 + cardPosition.width / 2,
                                y: cardPosition.top - window.innerHeight / 2 + cardPosition.height / 2,
                                scale: 0.7,
                                opacity: 0,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <motion.div 
                                className="card-inner"
                                initial={{ rotateY: 0 }}
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                exit={{ rotateY: 0 }}
                                transition={{ 
                                    duration: 0.5,
                                    ease: "easeInOut"
                                }}
                                style={{ transformStyle: "preserve-3d" }}
                                onClick={handleModalCardClick}
                            >
                                {selectedCard && (
                                    <>
                                        <div className="card-front">
                                            <div className="card-color">
                                                <div className="card-color-inner">
                                                    <div className="pinyin">{emotions.find(e => e.id === selectedCard).pinyin}</div>
                                                    <div className="name">{emotions.find(e => e.id === selectedCard).name}</div>
                                                </div>
                                            </div>
                                            <div className="tag">{emotions.find(e => e.id === selectedCard).tag.join(', ')}</div>
                                            <div className="heart-icon">
                                                <FontAwesomeIcon icon={faHeart} style={{color: "#000000"}}/>
                                            </div>
                                        </div>
                                        <div className="card-back">
                                            <div className="card-back-inner">
                                                <div className="card-back-header">
                                                    <div className="pinyin">{emotions.find(e => e.id === selectedCard).pinyin}</div>
                                                    <div className="name">{emotions.find(e => e.id === selectedCard).name}</div>
                                                </div>
                                                <div className="context">
                                                    {emotions.find(e => e.id === selectedCard).context}
                                                </div>
                                            </div>
                                            <div className="heart-icon">
                                                <FontAwesomeIcon icon={faHeart} style={{color: "#000000"}}/>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <footer className="footer-section">
                <p>2025 Uncharted Emotional Dictionaries. All rights reserved.</p>
            </footer>
        </>
    );
};

export default Gallery;