import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OpenAI } from 'openai';
import './style/Generation.css';

export const Generation = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [inputText, setInputText] = useState('');
    const [aiResponses, setAiResponses] = useState({
        deepseek: '',
        douBao: '',
        zhipu: ''
    });
    const [loading, setLoading] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);
    const maxCharacters = 200;

    const handleInputChange = (e) => {
        const text = e.target.value;
        if (text.length <= maxCharacters) {
            setInputText(text);
            setCharacterCount(text.length);
        }
    };

    const handleNextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    // DeepSeek API调用
    // API密钥安全处理方法
    
    // 修改API调用方法，通过后端代理
    const callDeepSeekAPI = async (text) => {
        try {
            const response = await fetch('http://localhost:5000/api/generate-emotion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    provider: 'deepseek',
                    text: text
                })
            });
            
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('DeepSeek API调用出错:', error);
            return '处理请求时出错，请稍后再试';
        }
    };
    
    // 同样修改其他API调用方法
    const callDouBaoAPI = async (text) => {
        try {
            const response = await fetch('http://localhost:5000/api/generate-emotion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    provider: 'doubao',
                    text: text
                })
            });
            
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('豆包API调用出错:', error);
            return '处理请求时出错，请稍后再试';
        }
    };
    
    const callZhipuAPI = async (text) => {
        try {
            const response = await fetch('http://localhost:5000/api/generate-emotion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    provider: 'zhipu',
                    text: text
                })
            });
            
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('智谱API调用出错:', error);
            return '处理请求时出错，请稍后再试';
        }
    };

    const generateEmotionWord = async () => {
        if (!inputText.trim()) {
            alert('请输入文本');
            return;
        }
        
        setLoading(true);
        
        try {
            // 记录开始时间
            const startTime = new Date();
            console.log(`分析开始时间: ${startTime.toLocaleString()}`);
            
            // 并行调用三个API
            const [deepseekResponse, douBaoResponse, zhipuResponse] = await Promise.all([
                callDeepSeekAPI(inputText),
                callDouBaoAPI(inputText),
                callZhipuAPI(inputText)
            ]);
            
            // 更新响应结果
            setAiResponses({
                deepseek: deepseekResponse,
                douBao: douBaoResponse,
                zhipu: zhipuResponse
            });
            
            // 记录结束时间并计算总用时
            const endTime = new Date();
            const totalTime = (endTime - startTime) / 1000; // 转换为秒
            console.log(`分析结束时间: ${endTime.toLocaleString()}`);
            console.log(`分析总用时: ${totalTime.toFixed(2)}秒`);
            
            // 前进到下一步
            handleNextStep();
        } catch (error) {
            console.error('生成情感词汇时出错:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="generation-container">
            <header className="generation-header">
                <div className="title">
                    <h1>未命名情感计划 <span className="subtitle">Uncharted Emotional Territories</span></h1>
                </div>
                <div className="nav-links">
                    <a href="#" className="nav-link">浏览</a>
                    <a href="#" className="nav-link">生成新词</a>
                </div>
            </header>

            <div className="generation-content">
                <div className="steps-container">
                    {/* 步骤指示器保持不变 */}
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                        <div className="step-number">STEP 1</div>
                        <div className="step-title">请详尽地描述您的情绪或感受</div>
                        <div className="step-hints">
                            <p>可参考以下事项：</p>
                            <p>· · · · · · · ·</p>
                            <p>· · · · · · · ·</p>
                            <p>· · · · · · · ·</p>
                            <p>· · · · · · · ·</p>
                            <p>· · · · · · · ·</p>
                        </div>
                    </div>

                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                        <div className="step-number">STEP 2</div>
                        <div className="step-title">请等待AI为您生成新的情绪词汇</div>
                    </div>

                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                        <div className="step-number">STEP 3</div>
                        <div className="step-title">请选择最满意的情绪词汇</div>
                        <div className="step-hints">
                            <p>· 情绪词汇选择区</p>
                            <p>· 您可以选择喜欢</p>
                            <p>· 您可以选择您喜欢的</p>
                        </div>
                    </div>

                    <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
                        <div className="step-number">STEP 4</div>
                        <div className="step-title">请留名分享新的情绪词汇</div>
                    </div>
                </div>

                <div className="input-container">
                    {currentStep === 1 && (
                        <>
                            <div className="input-box">
                                <textarea 
                                    placeholder="输入你的心情，生成你的情绪词汇。
你可以描述发生了什么事情，你有什么样的感受......" 
                                    value={inputText}
                                    onChange={handleInputChange}
                                    className="emotion-input"
                                />
                                <div className="character-count">{characterCount}/{maxCharacters}字</div>
                            </div>
                            <button 
                                className="next-button" 
                                onClick={generateEmotionWord}
                                disabled={loading}
                            >
                                {loading ? '生成中...' : '→ 生成我的情绪词汇'}
                            </button>
                        </>
                    )}

                    {currentStep === 2 && (
                        <div className="result-container">
                            <h3>AI生成的情感词汇：</h3>
                            <div className="api-responses">
                                <div className="api-response">
                                    <h4>DeepSeek:</h4>
                                    <div className="response-content">{aiResponses.deepseek}</div>
                                </div>
                                <div className="api-response">
                                    <h4>豆包:</h4>
                                    <div className="response-content">{aiResponses.douBao}</div>
                                </div>
                                <div className="api-response">
                                    <h4>智谱:</h4>
                                    <div className="response-content">{aiResponses.zhipu}</div>
                                </div>
                            </div>
                            <button className="next-button" onClick={handleNextStep}>
                                → 下一步
                            </button>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="result-container">
                            <h3>请选择您最满意的情感词汇：</h3>
                            <div className="word-selection">
                                {/* 这里可以添加选择词汇的UI */}
                                <button className="next-button" onClick={handleNextStep}>
                                    → 下一步
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="result-container">
                            <h3>请留下您的名字：</h3>
                            <input 
                                type="text" 
                                placeholder="您的名字（可选）" 
                                className="name-input"
                            />
                            <button className="submit-button">
                                提交
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Generation;