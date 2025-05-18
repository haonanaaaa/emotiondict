const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function checkDatabase() {
  try {
    // 打开数据库连接
    const db = await open({
      filename: path.join(__dirname, 'emotion_dict.db'),
      driver: sqlite3.Database
    });
    
    // 检查表是否存在
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('数据库中的表:', tables.map(t => t.name));
    
    // 检查情绪词汇表中的数据
    if (tables.some(t => t.name === 'emotion_entries')) {
      const count = await db.get('SELECT COUNT(*) as count FROM emotion_entries');
      console.log(`情绪词汇表中有 ${count.count} 条记录`);
      
      if (count.count > 0) {
        const records = await db.all('SELECT * FROM emotion_entries LIMIT 3');
        console.log('前3条记录:', JSON.stringify(records, null, 2));
      }
    }
    
    await db.close();
  } catch (error) {
    console.error('检查数据库时出错:', error);
  }
}

checkDatabase();