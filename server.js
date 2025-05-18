const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件配置
app.use(cors());
app.use(express.json());

// 数据库连接
let db;

// 初始化数据库
async function initializeDatabase() {
  try {
    // 打开数据库连接
    db = await open({
      filename: path.join(__dirname, 'emotion_dict.db'),
      driver: sqlite3.Database
    });
    
    // 创建情绪词典表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS emotion_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scene TEXT NOT NULL,
        selectedProvider TEXT NOT NULL,
        selectedWord TEXT NOT NULL,
        selectedPinyin TEXT NOT NULL,
        valence TEXT,
        intensity TEXT,
        complexity TEXT,
        granularity TEXT,
        wordFrequency TEXT,
        createdAt TEXT NOT NULL,
        explain TEXT
      )
    `);
    
    console.log('✅ 数据库初始化成功');
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
  }
}

// 系统提示词模板
const prompt = `
1.情绪分析量化（1-5级）
倾向：整体极性（1=极消极，5=极积极）
强度：最强情绪词等级,示例：麻木（1）、难过（2）、悲伤（3）、痛苦（4）、撕心裂肺（5）
复杂度：统计积极、消极词汇出现频率，矛盾情感词对数（每对+1，max5）
粒度：情绪描述的精细程度，细粒度词数（每个+1，max5），示例：不开心（细粒度词数=1）、悲怆（细粒度词数=5）
2.概括用户情绪，找出所有贴切的中文情绪描述词汇或诗句，要求：
含诗句、用'、'连接
3.创造1个能描述该情绪的新词：
声韵和谐、常用字组合、2到3个字
4.解释为什么选用这几个字组成创造的新词，要求：
30字以内
按照以下格式输出，不要输出其他内容：
情绪倾向: {倾向}，{强度}，{复杂度}，{粒度}
现有词汇和诗句: {词1、词2、诗句...}
生成词汇：{新词}
解释：{解释}
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

// 保存情绪词汇到数据库的API
app.post('/api/save-emotion', async (req, res) => {
  try {
    const {
      scene,
      selectedProvider,
      selectedWord,
      selectedPinyin,
      valence,
      intensity,
      complexity,
      granularity,
      wordFrequency,
      createdAt,
      explain
    } = req.body;
    
    // 插入数据
    const result = await db.run(
      `INSERT INTO emotion_entries (
        scene, selectedProvider, selectedWord, selectedPinyin,
        valence, intensity, complexity, granularity,
        wordFrequency, createdAt, explain
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        scene, selectedProvider, selectedWord, selectedPinyin,
        valence, intensity, complexity, granularity,
        wordFrequency, createdAt, explain
      ]
    );
    
    res.json({
      success: true,
      id: result.lastID,
      message: '情绪词汇保存成功'
    });
  } catch (error) {
    console.error('保存情绪词汇失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取所有情绪词汇的API
app.get('/api/emotions', async (req, res) => {
  try {
    console.log('收到获取情绪词汇请求');
    const emotions = await db.all('SELECT * FROM emotion_entries ORDER BY createdAt DESC');
    console.log(`查询到 ${emotions.length} 条情绪词汇记录`);
    
    // 记录第一条数据的结构（如果有）
    if (emotions.length > 0) {
      console.log('第一条数据示例:', JSON.stringify(emotions[0], null, 2));
    }
    
    res.json(emotions);
  } catch (error) {
    console.error('获取情绪词汇失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
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
  
  // 清理响应中的特殊字符
  const cleanedContent = completion.choices[0].message.content.replace(/[*#]/g, '');
  return cleanedContent;
}

// 修复豆包API调用函数中的URL和环境变量名称
async function callDouBaoAPI(text) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.DOUBAO_API_KEY,
      baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
    });

    const completion = await openai.chat.completions.create({
      model: 'doubao-1-5-thinking-pro-250415',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: text }
      ],
    });
    
    // 清理响应中的特殊字符
    const content = completion.choices[0]?.message?.content || '无响应';
    return content.replace(/[*#]/g, '');
  } catch (error) {
    console.error('豆包API调用出错:', error);
    return '豆包API调用失败';
  }
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
    // 清理响应中的特殊字符
    const content = data.choices[0].message.content;
    return content.replace(/[*#]/g, '');
  } catch (error) {
    console.error('智谱API调用出错:', error);
    return '智谱API调用失败';
  }
}

// 静态文件服务（必须放在API路由之后）
app.use(express.static(path.join(__dirname, 'build')));

// 通配路由处理（必须最后定义）
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 初始化数据库并启动服务器
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ 服务器已启动，运行在 http://localhost:${PORT}`);
    console.log('📁 静态文件服务目录:', path.join(__dirname, 'build'));
    console.log('💾 数据库文件路径:', path.join(__dirname, 'emotion_dict.db'));
  });
});