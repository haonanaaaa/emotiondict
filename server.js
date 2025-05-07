const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件配置
app.use(cors());
app.use(express.json());

// 系统提示词模板
const prompt = `
文本分析方法：1.分析该段文本中用户的情绪，返回该段文本三个维度值：
1.1情绪倾向
返回值范围1-5：1=非常消极，2=消极，3=中性，4=积极，5=非常积极
分级示例：痛苦/愤怒（1）、难受/尴尬/冷漠（2）、疑惑（3）、轻松（4）、快乐/兴奋（5）
1.2情绪强度
返回值范围1-5：1=无波动，2=轻微波动，3=一般波动，4=较强波动，5=强烈波动
寻找描述感官或情绪的词汇，以最强感官词汇作为返回值依据。示例：麻木（1）、难过（2）、悲伤（3）、痛苦（4）、撕心裂肺（5）
1.3情绪复杂度
返回一个整数
统计积极、消极词汇出现频率，每次出现一对矛盾情感，返回数值+1
2.概括用户情绪（排除具体场景，仅关注用户情感），找出所有贴切的中文情绪描述词汇或诗句，返回这些词汇和诗句并用顿号隔开，不要加引号；
3.分析该词汇对用户情绪描述的不足之处，以此为依据，结合中文造词法，生成1个新的情绪词汇。生成词汇时注意：
词汇应该读起来顺口
避免生僻字
---
按照以下格式输出,除要求输出的内容以外不要输出其他内容:
情绪倾向: {情绪倾向result}，{情绪强度result}，{情绪复杂度result}
现有词汇和诗句: {result、result、result...}
生成词汇：{result}
`;

// API路由（必须放在静态文件中间件之前）
app.post('/api/generate-emotion', async (req, res) => {
  try {
    const { provider, text } = req.body;
    console.log(`收到请求，提供商：${provider}，文本：${text}`);

    let result = '';
    switch (provider) {
      case 'deepseek':
        result = await callDeepSeekAPI(text);
        break;
      case 'doubao':
        result = await callDouBaoAPI(text);
        break;
      case 'zhipu':
        result = await callZhipuAPI(text);
        break;
      default:
        return res.status(400).json({ error: '无效的API提供商' });
    }

    res.json({ result });
  } catch (error) {
    console.error('处理请求时出错:', error);
    res.status(500).json({ 
      error: '服务器错误',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// API调用函数
async function callDeepSeekAPI(text) {
  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: "deepseek-reasoner",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: text }
    ],
  });
  
  return completion.choices[0].message.content;
}

async function callDouBaoAPI(text) {
  const openai = new OpenAI({
    apiKey: process.env.DOUBO_API_KEY,
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
  });

  const completion = await openai.chat.completions.create({
    model: 'doubao-1-5-thinking-pro-250415',
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: text }
    ],
  });
  
  return completion.choices[0]?.message?.content || '无响应';
}

// 修复API调用函数中的URL问题
async function callZhipuAPI(text) {
  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`
      },
      body: JSON.stringify({
        model: 'glm-4-plus',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: text }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`智谱API错误: ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('智谱API调用出错:', error);
    return '智谱API调用失败';
  }
}

// 修复豆包API调用函数中的URL和环境变量名称
async function callDouBaoAPI(text) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.DOUBAO_API_KEY, // 修正环境变量名称，从DOUBO_API_KEY改为DOUBAO_API_KEY
      baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
    });

    const completion = await openai.chat.completions.create({
      model: 'doubao-1-5-thinking-pro-250415',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: text }
      ],
    });
    
    return completion.choices[0]?.message?.content || '无响应';
  } catch (error) {
    console.error('豆包API调用出错:', error);
    return '豆包API调用失败';
  }
}

// 静态文件服务（必须放在API路由之后）
app.use(express.static(path.join(__dirname, 'build')));

// 通配路由处理（必须最后定义）
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`✅ 服务器已启动，运行在 http://localhost:${PORT}`);
  console.log('📁 静态文件服务目录:', path.join(__dirname, 'build'));
});