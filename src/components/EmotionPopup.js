import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Wordcloud from './Wordcloud';
import './EmotionPopup.css';

const EmotionPopup = ({ emotion, onClose }) => {
    if (!emotion) return null;
    
    return (
        <AnimatePresence>
            <motion.div 
                className="emotion-popup-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div 
                    className="emotion-popup-content"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ borderColor: emotion.potency > 3 ? 'var(--primary-color)' : '#0000ff' }}
                >
                    <div className="popup-close-button" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                    
                    <div className="popup-container">
                        <div className="popup-left">
                            <div className="emotion-header">
                                <div className="emotion-pinyin">{emotion.pinyin}</div>
                                <div className="emotion-name">{emotion.name}</div>
                            </div>
                            
                            <div className="emotion-story">
                                <p>{emotion.context}</p>

                                {/* 这个地方的context要换成具体的数据，我不清楚field在哪里 */}
                                <h4>创作释义</h4>
                                <p>{emotion.context}</p> 

                                <h4>情绪维度</h4>
                                <div className="emotion-analysis">
                                    <div className="analysis-item">
                                        <img className="analysis-icon" src={require('../assets/icons/granularity.svg').default} alt="granularity" />
                                        <span className="analysis-label">粒度</span>
                                        <span className="analysis-value">{emotion.granularity}</span>
                                    </div>
                                    <div className="analysis-item">
                                        <img className="analysis-icon" src={require('../assets/icons/potency.svg').default} alt="potency" />
                                        <span className="analysis-label">效价 </span>
                                        <span className="analysis-value">{emotion.potency>3?'积极':'消极'}</span>
                                    </div>
                                    <div className="analysis-item">
                                        <img className="analysis-icon" src={require('../assets/icons/intensity.svg').default} alt="intensity" />
                                        <span className="analysis-label">强度</span>
                                        <span className="analysis-value">{emotion.intensity}</span>
                                    </div>
                                    <div className="analysis-item">
                                        <img className="analysis-icon" src={require('../assets/icons/complexity.svg').default} alt="complexity" />
                                        <span className="analysis-label">复杂度</span>
                                        <span className="analysis-value">{emotion.complexity}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="popup-right">
                            <Wordcloud words={emotion.wordcloud} potency={emotion.potency} />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EmotionPopup; 