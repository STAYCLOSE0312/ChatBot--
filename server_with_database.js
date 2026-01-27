// ==========================================
// データベース対応版 server.js
// MongoDB Atlas + Mongoose を使用
// ==========================================

// 環境変数の読み込み
require('dotenv').config();

// MongoDB接続
const mongoose = require('mongoose');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDBに接続
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB接続成功'))
.catch(err => console.error('❌ MongoDB接続エラー:', err));

// FAQスキーマの定義
const faqSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  keywords: { type: [String], default: [] }
});

const FAQ = mongoose.model('FAQ', faqSchema);

// 代表的なFAQのIDを保存するスキーマ
const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed }
});

const Settings = mongoose.model('Settings', settingsSchema);

// ==========================================
// ヘルパー関数
// ==========================================

// 次に使えるFAQ IDを取得
async function getNextFAQId() {
  const lastFAQ = await FAQ.findOne().sort({ id: -1 });
  return lastFAQ ? lastFAQ.id + 1 : 1;
}

// 人気FAQのIDを取得
async function getPopularFAQIds() {
  const settings = await Settings.findOne({ key: 'popularIds' });
  if (settings && Array.isArray(settings.value)) {
    return settings.value;
  }
  // デフォルト: 最初の4件
  const faqs = await FAQ.find().limit(4);
  return faqs.map(f => f.id);
}

// 人気FAQのIDを保存
async function setPopularFAQIds(ids) {
  await Settings.findOneAndUpdate(
    { key: 'popularIds' },
    { value: ids },
    { upsert: true, new: true }
  );
}

// テキストの類似度計算（シンプルなキーワードマッチング）
function calculateSimilarity(text, keywords) {
  const textLower = text.toLowerCase();
  let score = 0;
  
  keywords.forEach(keyword => {
    if (textLower.includes(keyword.toLowerCase())) {
      score += 10; // キーワード完全一致
    }
  });
  
  return score;
}

// ==========================================
// ルート
// ==========================================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chatbot.html'));
});

// ==========================================
// チャットボット用API
// ==========================================

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'メッセージが必要です' });
    }
    
    // 全FAQを取得
    const allFAQs = await FAQ.find();
    
    // スコア計算
    const results = [];
    for (const faq of allFAQs) {
      const questionScore = calculateSimilarity(message, [faq.question]);
      const keywordScore = calculateSimilarity(message, faq.keywords);
      const totalScore = questionScore + keywordScore;
      
      if (totalScore > 0) {
        results.push({
          ...faq.toObject(),
          score: totalScore
        });
      }
    }
    
    // スコア順にソート
    results.sort((a, b) => b.score - a.score);
    
    if (results.length > 0) {
      const bestMatch = results[0];
      res.json({
        answer: bestMatch.answer,
        relatedQuestions: results.slice(1, 4).map(r => r.question)
      });
    } else {
      res.json({
        answer: 'お問い合わせありがとうございます。申し訳ございませんが、該当する情報が見つかりませんでした。お手数ですが、別の言い方でお試しいただくか、カスタマーサポートまでお問い合わせください。',
        relatedQuestions: []
      });
    }
  } catch (error) {
    console.error('チャットエラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ==========================================
// FAQ管理API
// ==========================================

// FAQ一覧取得API
app.get('/api/faqs', async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ id: 1 });
    res.json(faqs);
  } catch (error) {
    console.error('FAQ取得エラー:', error);
    res.status(500).json({ error: 'FAQの取得に失敗しました' });
  }
});

// 代表的なFAQ取得API（初回表示用）
app.get('/api/faqs/popular', async (req, res) => {
  try {
    const popularIds = await getPopularFAQIds();
    const popularFaqs = [];
    
    for (const id of popularIds.slice(0, 4)) {
      const faq = await FAQ.findOne({ id });
      if (faq) {
        popularFaqs.push(faq);
      }
    }
    
    res.json(popularFaqs);
  } catch (error) {
    console.error('人気FAQ取得エラー:', error);
    res.status(500).json({ error: '人気FAQの取得に失敗しました' });
  }
});

// 代表的なFAQ設定取得API（管理画面用）
app.get('/api/faqs/popular-settings', async (req, res) => {
  try {
    const popularIds = await getPopularFAQIds();
    res.json({ popularIds });
  } catch (error) {
    console.error('人気FAQ設定取得エラー:', error);
    res.status(500).json({ error: '設定の取得に失敗しました' });
  }
});

// 代表的なFAQ設定更新API（管理画面用）
app.post('/api/faqs/popular-settings', async (req, res) => {
  try {
    const { popularIds } = req.body;

    if (!Array.isArray(popularIds)) {
      return res.status(400).json({ error: 'popularIds は配列で指定してください' });
    }

    // 有効なIDのみを抽出
    const validIds = [];
    for (const id of popularIds) {
      const numId = parseInt(id);
      if (!isNaN(numId)) {
        const exists = await FAQ.findOne({ id: numId });
        if (exists) {
          validIds.push(numId);
        }
      }
    }

    const uniqueIds = Array.from(new Set(validIds)).slice(0, 4);

    if (uniqueIds.length === 0) {
      return res.status(400).json({ error: '有効なFAQが選択されていません' });
    }

    await setPopularFAQIds(uniqueIds);

    res.json({ success: true, popularIds: uniqueIds });
  } catch (error) {
    console.error('人気FAQ設定更新エラー:', error);
    res.status(500).json({ error: 'データの保存に失敗しました' });
  }
});

// FAQ追加API
app.post('/api/faqs', async (req, res) => {
  try {
    const { question, answer, keywords } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({ error: '質問と回答は必須です' });
    }
    
    const newId = await getNextFAQId();
    
    const newFAQ = new FAQ({
      id: newId,
      question,
      answer,
      keywords: keywords || []
    });
    
    await newFAQ.save();
    
    res.json({ success: true, faq: newFAQ });
  } catch (error) {
    console.error('FAQ追加エラー:', error);
    res.status(500).json({ error: 'データの保存に失敗しました' });
  }
});

// FAQ更新API
app.put('/api/faqs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { question, answer, keywords } = req.body;
    
    const faq = await FAQ.findOne({ id });
    
    if (!faq) {
      return res.status(404).json({ error: 'FAQが見つかりません' });
    }
    
    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (keywords) faq.keywords = keywords;
    
    await faq.save();
    
    res.json({ success: true, faq });
  } catch (error) {
    console.error('FAQ更新エラー:', error);
    res.status(500).json({ error: 'データの保存に失敗しました' });
  }
});

// FAQ削除API
app.delete('/api/faqs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const faq = await FAQ.findOne({ id });
    
    if (!faq) {
      return res.status(404).json({ error: 'FAQが見つかりません' });
    }
    
    await FAQ.deleteOne({ id });

    // popularIds から削除
    let popularIds = await getPopularFAQIds();
    popularIds = popularIds.filter(pid => pid !== id);
    
    if (popularIds.length === 0) {
      const remainingFAQs = await FAQ.find().limit(4);
      popularIds = remainingFAQs.map(f => f.id);
    }
    
    await setPopularFAQIds(popularIds);
    
    res.json({ success: true });
  } catch (error) {
    console.error('FAQ削除エラー:', error);
    res.status(500).json({ error: 'データの保存に失敗しました' });
  }
});

// FAQ一括インポートAPI（CSV取り込み用）
app.post('/api/faqs/import', async (req, res) => {
  try {
    const { rows } = req.body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: 'インポートするデータがありません' });
    }

    // 既存のFAQを全削除
    await FAQ.deleteMany({});

    // 新しいFAQを追加
    const faqs = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const question = (row.question || '').trim();
      const answer = (row.answer || '').trim();
      
      if (question && answer) {
        const newFAQ = new FAQ({
          id: i + 1,
          question,
          answer,
          keywords: Array.isArray(row.keywords) ? row.keywords : []
        });
        await newFAQ.save();
        faqs.push(newFAQ);
      }
    }

    // 人気FAQを設定
    const popularIds = faqs.slice(0, 4).map(f => f.id);
    await setPopularFAQIds(popularIds);

    res.json({ success: true, count: faqs.length });
  } catch (error) {
    console.error('インポートエラー:', error);
    res.status(500).json({ error: 'データの保存に失敗しました' });
  }
});

// ==========================================
// サーバー起動
// ==========================================

app.listen(PORT, () => {
  console.log(`✅ サーバーが起動しました: http://localhost:${PORT}`);
  console.log(`📱 チャットボット: http://localhost:${PORT}/chatbot.html`);
  console.log(`⚙️  FAQ管理画面: http://localhost:${PORT}/admin.html`);
});

