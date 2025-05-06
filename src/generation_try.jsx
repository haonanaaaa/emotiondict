import React, { useState } from 'react';
import { OpenAI } from 'openai';

const GenerationTry = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      alert('请输入文本');
      return;
    }
    
    setLoading(true);
    // 记录开始时间
    const startTime = new Date();
    console.log(`分析开始时间: ${startTime.toLocaleString()}`);
    
    try {
      // 创建 OpenAI 客户端实例
      const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: 'sk-9d5f26704fad4853ae7013aebc2a8ac9', // 您的 DeepSeek API 密钥
        dangerouslyAllowBrowser: true
      });

      // 调用 DeepSeek API
      const completion = await openai.chat.completions.create({
        model: "deepseek-reasoner",
        messages: [
            {
                role: "system",
                content: "你是一个创造中文词汇的助手，请先分析用户输入场景中情绪的强度：强、中、弱，再创造一个新的中文词汇，用于描述场景中特定的情绪、感受和体验。并按照以下格式输出：\n\n强度：\n词汇：\n解释：\n"
              },
          {
            role: "user",
            content: inputText
          }
        ]
      });
      console.log(completion.choices[0].message.content);
      // 包含以下哪一种或多种情感：快乐、惊讶、厌恶、悲伤、愤怒、恐惧，不要在这6种以外情感选择，以及
      // 从响应中提取结果
      const responseContent = completion.choices[0].message.content;
      setResult(responseContent);
    } catch (error) {
      console.error('处理文本时出错:', error);
      setResult('处理请求时出错，请稍后再试');
    } finally {
      setLoading(false);
      // 记录结束时间并计算总用时
      const endTime = new Date();
      const totalTime = (endTime - startTime) / 1000; // 转换为秒
      console.log(`分析结束时间: ${endTime.toLocaleString()}`);
      console.log(`分析总用时: ${totalTime.toFixed(2)}秒`);
    }
  };

  return (
    <div>
      <h2>生词</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder="请输入要分析的文本..."
            rows={5}
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '分析中...' : '提交分析'}
        </button>
      </form>
      
      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>分析结果:</h3>
          <div style={{ whiteSpace: 'pre-wrap' }}>{result}</div>
        </div>
      )}
    </div>
  );
};

export { GenerationTry }; 
export default GenerationTry;