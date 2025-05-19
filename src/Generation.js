import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OpenAI } from 'openai';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate }  from 'react-router-dom'
import { Navbar } from './NavBar';
import { pinyin } from 'pinyin-pro'; // 导入拼音库
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import './style/Generation.css';
import LoadingAnimation from './components/LoadingAnimation';

export const Generation = () => {
    // const [currentStep, setCurrentStep] = useState(1);
    // const [inputText, setInputText] = useState('');
    // const [aiResponses, setAiResponses] = useState({
    //     deepseek: '',
    //     douBao: '',
    //     zhipu: ''
    // });
    const savedState = JSON.parse(localStorage.getItem('generationState')) || {};
    const [currentStep, setCurrentStep] = useState(savedState.currentStep || 1);
    const [inputText, setInputText] = useState(savedState.inputText || '');
    const [aiResponses, setAiResponses] = useState(savedState.aiResponses || {
        deepseek: '',
        douBao: '',
        zhipu: ''
    });
    const [loading, setLoading] = useState(savedState.loading || false);
    const [characterCount, setCharacterCount] = useState(savedState.inputText?.length || 0);
    const maxCharacters = 200;
    // 新增状态用于测试加载动画
    const [testLoading, setTestLoading] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState(savedState.selectedResponse || null);

    // 当关键状态变化时保存到本地存储
    useEffect(() => {
        const stateToSave = {
            currentStep,
            inputText,
            aiResponses,
            selectedResponse,
            loading
        };
        localStorage.setItem('generationState', JSON.stringify(stateToSave));
    }, [currentStep, inputText, aiResponses, selectedResponse, loading]);

    // 添加一个useEffect来处理从其他页面返回时的UI状态
    useEffect(() => {
        // 如果是从其他页面返回，且当前是Step 2，但API响应不完整
        if (currentStep === 2) {
            console.log("检测到从其他页面返回，检查API响应状态");
        
            // 设置加载状态
            setLoading(true);
            
            // 创建一个轮询函数来检查API是否完成
            const checkApiStatus = () => {
                // 从localStorage获取最新状态
                const currentState = JSON.parse(localStorage.getItem('generationState')) || {};
                const currentResponses = currentState.aiResponses || {};
                
                console.log("轮询检查API状态:", currentResponses);
                
                // 检查是否所有API都有响应
                if (currentResponses.deepseek && currentResponses.douBao && currentResponses.zhipu) {
                    console.log("检测到API响应已完成");
                    // 更新状态
                    setAiResponses(currentResponses);
                    setLoading(false);
                    // API调用完成后前进到第3步
                    setCurrentStep(3);
                    return; // 停止轮询
                }
                
                // 继续轮询
                setTimeout(checkApiStatus, 1000); // 每秒检查一次
            };
            
            // 开始轮询
            checkApiStatus();
        }
    }, []);  // 仅在组件挂载时执行一次

    const handleInputChange = (e) => {
        const text = e.target.value;
        console.log('1');
        if (text.length <= maxCharacters) {
            setInputText(text);
            console.log(text);
            setCharacterCount(text.length);
        }
    };


    const handleNextStep = () => {
        if (currentStep < 4) {
            // 添加空值检查
            if (!aiResponses.deepseek || !aiResponses.douBao || !aiResponses.zhipu) {
                alert('请等待API响应完成');
                return;
            }
            
            if (!selectedResponse) {
                alert('请选择一个情绪词汇');
                return;
            }
            
            // 调用保存函数
            saveToDatabase();
        }
    };

     // 当关键状态变化时保存到本地存储
     useEffect(() => {
        const stateToSave = {
            currentStep,
            inputText,
            aiResponses,
            selectedResponse,
            loading
        };
        localStorage.setItem('generationState', JSON.stringify(stateToSave));
    }, [currentStep, inputText, aiResponses, selectedResponse, loading]);

    useEffect(() => {
        // 定义页面刷新/关闭时的处理函数
        const handleBeforeUnload = () => {
            // 清除 localStorage 中的状态
            localStorage.removeItem('generationState');
        };
        
        // 添加事件监听器
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // 组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);


    // 添加保存到数据库的函数
    const saveToDatabase = async () => {
        try {
            // 获取预处理结果
            const { positionModes, wordFrequency } = PreDB();
            
            // 获取用户选择的情绪词汇
            const selectedWord = extractEmotionWord(aiResponses[selectedResponse]);
            
            // 获取选中词汇的拼音
            const selectedPinyin = selectedWord.split('').map(char => getPinyin(char));
            
            // 准备要发送的数据
            const dataToSave = {
                scene: inputText,
                selectedProvider: selectedResponse,
                selectedWord: selectedWord,
                selectedPinyin: selectedPinyin.join(','),
                valence: positionModes[0].join(','),
                intensity: positionModes[1].join(','),
                complexity: positionModes[2].join(','),
                granularity: positionModes[3].join(','),
                wordFrequency: JSON.stringify(wordFrequency),
                createdAt: new Date().toISOString(),
                explain: extractExplain(aiResponses[selectedResponse])
            };
            
            console.log('准备保存的数据:', dataToSave);
            
            // 发送数据到后端API
            const apiUrl = process.env.NODE_ENV === 'production' 
                    ? '/api/save-emotion'  // 生产环境使用相对路径
                    : 'http://localhost:5000/api/save-emotion';  // 开发环境使用完整URL
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSave)
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('数据保存成功:', result);
                alert('情绪词汇已成功保存到词典！');
                
                // 重置所有状态，准备新的输入
                setInputText('');
                setCharacterCount(0);
                setAiResponses({
                    deepseek: '',
                    douBao: '',
                    zhipu: ''
                });
                setSelectedResponse(null);
                localStorage.removeItem('generationState');
                
                // 跳转回Step 1
                setCurrentStep(1);
            } else {
                console.error('数据保存失败:', result.error);
                alert('保存失败: ' + result.error);
            }
        } catch (error) {
            console.error('保存数据时出错:', error);
            alert('保存过程中出错，请稍后再试');
        }
    };

    // DeepSeek API调用
    // API密钥安全处理方法
    
    // 修改API调用方法，通过后端代理
    const callDeepSeekAPI = async (text) => {
        try {
            const apiUrl = process.env.NODE_ENV === 'production' 
                    ? '/api/generate-emotion'  // 生产环境使用相对路径
                    : 'http://localhost:5000/api/generate-emotion';  // 开发环境使用正确的API端点
            const response = await fetch(apiUrl, {
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
            console.log('DeepSeek API 返回结果:', data.result);
            
            // 获取当前localStorage中的状态
            const currentState = JSON.parse(localStorage.getItem('generationState')) || {};
            const currentResponses = currentState.aiResponses || {};
            
            // 清理API响应中的特殊字符
            const cleanedResult = data.result ? data.result.replace(/[*#]/g, '') : '';
            
            // 更新localStorage中的aiResponses
            localStorage.setItem('generationState', JSON.stringify({
                ...currentState,
                aiResponses: {
                    ...currentResponses,
                    deepseek: cleanedResult
                }
            }));
            
            return data.result;
        } catch (error) {
            console.error('DeepSeek API调用出错:', error);
            return '处理请求时出错，请稍后再试';
        }
    };
    
    // 同样修改其他API调用方法
    const callDouBaoAPI = async (text) => {
        try {
            const apiUrl = process.env.NODE_ENV === 'production' 
                    ? '/api/generate-emotion'  // 生产环境使用相对路径
                    : 'http://localhost:5000/api/generate-emotion';  // 开发环境使用正确的API端点
            const response = await fetch(apiUrl, {
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
            console.log('豆包 API 返回结果:', data.result);
            
            // 获取当前localStorage中的状态
            const currentState = JSON.parse(localStorage.getItem('generationState')) || {};
            const currentResponses = currentState.aiResponses || {};
            
            // 清理API响应中的特殊字符
            const cleanedResult = data.result ? data.result.replace(/[*#]/g, '') : '';
            
            // 更新localStorage中的aiResponses
            localStorage.setItem('generationState', JSON.stringify({
                ...currentState,
                aiResponses: {
                    ...currentResponses,
                    douBao: cleanedResult
                }
            }));
            
            return data.result;
        } catch (error) {
            console.error('豆包API调用出错:', error);
            return '处理请求时出错，请稍后再试';
        }
    };
    
    const callZhipuAPI = async (text) => {
        try {
            const apiUrl = process.env.NODE_ENV === 'production' 
                    ? '/api/generate-emotion'  // 生产环境使用相对路径
                    : 'http://localhost:5000/api/generate-emotion';  // 开发环境使用正确的API端点
            const response = await fetch(apiUrl, {
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
            console.log('智谱 API 返回结果:', data.result);
            
            // 获取当前localStorage中的状态
            const currentState = JSON.parse(localStorage.getItem('generationState')) || {};
            const currentResponses = currentState.aiResponses || {};
            
            // 清理API响应中的特殊字符
            const cleanedResult = data.result ? data.result.replace(/[*#]/g, '') : '';
            
            // 更新localStorage中的aiResponses
            localStorage.setItem('generationState', JSON.stringify({
                ...currentState,
                aiResponses: {
                    ...currentResponses,
                    zhipu: cleanedResult
                }
            }));
            
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
        // 立即将步骤更新为第2步
        setCurrentStep(2);
        
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
            
            // 清理API响应中的特殊字符
            const cleanResponse = (text) => {
                if (!text) return '';
                // 去除Markdown标记字符 * # 等
                return text.replace(/[*#]/g, '');
            };
            
            // 更新响应结果，并清理特殊字符
            const finalResponses = {
                deepseek: cleanResponse(deepseekResponse),
                douBao: cleanResponse(douBaoResponse),
                zhipu: cleanResponse(zhipuResponse)
            };
            
            setAiResponses(finalResponses);
            
            // 记录结束时间并计算总用时
            const endTime = new Date();
            const totalTime = (endTime - startTime) / 1000; // 转换为秒
            console.log(`分析结束时间: ${endTime.toLocaleString()}`);
            console.log(`分析总用时: ${totalTime.toFixed(2)}秒`);
            
            // API调用完成后直接前进到第3步
            setCurrentStep(3);
        } catch (error) {
            console.error('生成情感词汇时出错:', error);
        } finally {
            setLoading(false);
        }
    };

    const extractEmotionWord = (response) => {
        // 假设返回的结果中包含"情绪词汇："或类似的标记
        if (!response) return '';
        
        // 尝试匹配"情绪词汇："后面的内容
        const match = response.match(/生成词汇[：:]\s*([^、，,\n]+)/);
        if (match && match[1]) {
            return match[1].trim();
        }
        
        const subStr = response.substring(18);
        const dunhaoIndex = subStr.indexOf('、');
        return response.substring(18, 18 + dunhaoIndex);
    };

    // 提取解释内容的函数
    const extractExplain = (response) => {
        if (!response) return '';
        
        // 尝试匹配"解释："后面的所有内容
        const match = response.match(/解释[：:]\s*([\s\S]+)/);
        if (match && match[1]) {
            return match[1].trim();
        }
        
        return ''; // 如果没有找到解释，返回空字符串
    };

    const PreDB_single = (response) => {
        console.log(response);
        if (!response) return '';
        const match1 = response.match(/情绪倾向[：:]\s*([^\n]+)/);
        const match2 = response.match(/现有词汇和诗句[：:]\s*([^\n]+)/);
        if ((match1 && match1[1]) && (match2 && match2[1])) {
            const emotionTendencies = match1[1].split(/[,，]/).map(item => item.trim());
            const existingWords = match2[1].split('、').map(item => item.trim());
            return {
                emotionTendencies,
                existingWords
            };
        }
        return null;
    };

    const PreDB = (response) => {
        const result_deepseek = PreDB_single(aiResponses.deepseek);
        const result_doubao = PreDB_single(aiResponses.douBao);
        const result_zhipu = PreDB_single(aiResponses.zhipu);

        // 解构赋值
        const { emotionTendencies: arr1 } = result_deepseek;
        const { emotionTendencies: arr2 } = result_doubao;
        const { emotionTendencies: arr3 } = result_zhipu;
        const { existingWords: arr4 } = result_deepseek;
        const { existingWords: arr5 } = result_doubao;
        const { existingWords: arr6 } = result_zhipu;

        // 将三个数组组合成一个二维数组
        const allArrays = [arr1, arr2, arr3];
        console.log("所有数组:", allArrays);

        // 分别求第1、2、3个元素的众数
        const positionModes = [1, 2, 3, 4].map(position => {
            const posIndex = position - 1; // 转为0-based索引
            
            // 收集每个数组在该位置的元素
            const elements = allArrays.map(arr => arr[posIndex]);
            
            // 统计频率
            const freq = elements.reduce((acc, val) => {
                acc[val] = (acc[val] || 0) + 1;
                return acc;
            }, {});
            
            // 找出众数
            const maxFreq = Math.max(...Object.values(freq));
            const modes = Object.keys(freq).filter(k => freq[k] === maxFreq);
            
            // 如果所有出现次数都是1，返回arr1该位置的值
            return maxFreq > 1 ? modes : [arr1[posIndex]];
        });
        
        // 合并所有数组
        const allWords = [...arr4, ...arr5, ...arr6];

        // 统计词频 - 修改为处理包含关系
        const wordFrequency = {};
        
        // 首先清理所有词汇（去除引号）
        const cleanedWords = allWords.map(word => word.replace(/['"]/g, '').trim());
        
        // 对每个词汇进行处理
        cleanedWords.forEach(word => {
            // 检查是否已经有包含当前词的键
            let foundMatch = false;
            
            // 检查当前词是否是其他词的子串
            for (const existingWord in wordFrequency) {
                // 如果当前词包含在已有词中，或已有词包含在当前词中
                if (existingWord.includes(word) || word.includes(existingWord)) {
                    // 选择较短的词作为键
                    const shorterWord = existingWord.length <= word.length ? existingWord : word;
                    const longerWord = existingWord.length > word.length ? existingWord : word;
                    
                    // 如果较短的词已经是键，增加其计数
                    if (shorterWord === existingWord) {
                        wordFrequency[existingWord]++;
                    } else {
                        // 否则，创建新键并转移计数
                        wordFrequency[shorterWord] = (wordFrequency[existingWord] || 0) + 1;
                        delete wordFrequency[existingWord];
                    }
                    
                    foundMatch = true;
                    break;
                }
            }
            
            // 如果没有找到匹配项，创建新键
            if (!foundMatch) {
                wordFrequency[word] = 1;
            }
        });

        console.log("改进后的词频统计结果:", wordFrequency);

        console.log("四个位置的众数结果:", positionModes);
        return {
            positionModes,
            wordFrequency
        };


    }

    // 添加一个函数来获取汉字的拼音
    const getPinyin = (char) => {
        if (!char) return '';
        return pinyin(char, { toneType: 'symbol', type: 'array' })[0];
    };

    // const [selectedResponse, setSelectedResponse] = useState(null); // 添加选中状态

    // 添加选择响应的处理函数
    const handleSelectResponse = (provider) => {
        setSelectedResponse(provider);
    };

    return (
        <div className="generation-container">
            <div className="generation-content">
                <div className="steps">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                        <div className="step-number english">Step 1</div>
                        <div className="step-title">描述你的情绪场景</div>
                    </div>
                    
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                        <div className="step-number english">Step 2</div>
                        <div className="step-title">生成情绪词汇</div>
                    </div>
                    
                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                        <div className="step-number english">Step 3</div>
                        <div className="step-title">选择情绪词汇</div>
                    </div>
                </div>

                <div className="input-container">
                    {(currentStep === 1 || currentStep ===2) && (
                        <>
                            <div className="input-box" style={{ position: 'relative' }}>
                                {/* 在输入框内显示加载动画 */}
                                {(loading) && 
                                    <div style={{ 
                                        position: 'absolute', 
                                        top: 0, 
                                        left: 0, 
                                        width: '100%', 
                                        height: '100%',
                                        zIndex: 100
                                    }}>
                                        <LoadingAnimation isVisible={true} />
                                    </div>
                                }
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
                                className="next-button btn-primary"
                                onClick={generateEmotionWord}
                                disabled={loading}
                            >
                                {loading ? '生成中...' : '→ 生成我的情绪词汇'}
                            </button>
                        </>
                    )}

                {currentStep === 3 && (
                    <div className="result-container">
                        <div className='scene'>"{inputText}"</div>
                        <div className="api-responses">
                            <div 
                                className={`api-response ${selectedResponse === 'deepseek' ? 'selected' : ''}`}
                                onClick={() => handleSelectResponse('deepseek')}
                            >
                                <div className="response-content">
                                    {extractEmotionWord(aiResponses.deepseek).split('').map((char, index) => (
                                        <div key={index} className="character-grid">
                                            <div className="pinyin">{getPinyin(char)}</div>
                                            <span>{char}</span>
                                            <div className="diagonal-1"></div>
                                            <div className="diagonal-2"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="explanation-text">
                                    {extractExplain(aiResponses.deepseek)}
                                </div>
                                <div className="circle-selector">
                                    {selectedResponse === 'deepseek' ? 
                                        <FontAwesomeIcon icon={faCheck} style={{color: "#e84e50"}} /> : 
                                        '○'}
                                </div>
                            </div>
                            <div 
                                className={`api-response ${selectedResponse === 'douBao' ? 'selected' : ''}`}
                                onClick={() => handleSelectResponse('douBao')}
                            >
                                <div className="response-content">
                                    {extractEmotionWord(aiResponses.douBao).split('').map((char, index) => (
                                        <div key={index} className="character-grid">
                                            <div className="pinyin">{getPinyin(char)}</div>
                                            <span>{char}</span>
                                            <div className="diagonal-1"></div>
                                            <div className="diagonal-2"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="explanation-text">
                                    {extractExplain(aiResponses.douBao)}
                                </div>
                                <div className="circle-selector">
                                    {selectedResponse === 'douBao' ? 
                                        <FontAwesomeIcon icon={faCheck} style={{color: "#e84e50"}} /> : 
                                        '○'}
                                </div>
                            </div>
                            <div 
                                className={`api-response ${selectedResponse === 'zhipu' ? 'selected' : ''}`}
                                onClick={() => handleSelectResponse('zhipu')}
                            >
                                <div className="response-content">
                                    {extractEmotionWord(aiResponses.zhipu).split('').map((char, index) => (
                                        <div key={index} className="character-grid">
                                            <div className="pinyin">{getPinyin(char)}</div>
                                            <span>{char}</span>
                                            <div className="diagonal-1"></div>
                                            <div className="diagonal-2"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="explanation-text">
                                    {extractExplain(aiResponses.zhipu)}
                                </div>
                                <div className="circle-selector">
                                    {selectedResponse === 'zhipu' ? 
                                        <FontAwesomeIcon icon={faCheck} style={{color: "#e84e50"}} /> : 
                                        '○'}
                                </div>
                            </div>
                        </div>
                        <div className="button-group">
                            <button 
                                className="next-button btn-secondary" 
                                onClick={() => setCurrentStep(1)}
                            >
                                ← 修改输入
                            </button>
                            <button 
                                className="next-button btn-secondary" 
                                onClick={generateEmotionWord}
                                disabled={loading}
                            >
                                {loading ? '生成中...' : '↻ 重新生成'}
                            </button>
                            <button 
                                className="next-button btn-primary" 
                                onClick={handleNextStep}
                                disabled={!selectedResponse || loading} 
                            >
                                → 保存进情绪词典
                            </button>
                        </div>
                    </div>
                )}

                </div>
            </div>
        </div>
    );
};
