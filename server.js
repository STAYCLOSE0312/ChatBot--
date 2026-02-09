require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
// Google Sheets API連携
const googleSheets = require('./lib/googleSheets');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// FAQデータの読み込み（Google Sheetsから）
async function loadFAQData() {
  try {
    const faqs = await googleSheets.getFAQs();
    console.log(`📚 メモリに読み込んだFAQ数: ${faqs.length}件`);
    return { faqs };
  } catch (error) {
    console.error('❌ FAQデータの読み込みエラー:', error);
    console.error('   エラー詳細:', error.message);
    console.error('   スタックトレース:', error.stack);
    // エラーを再スローして、呼び出し元で適切に処理できるようにする
    throw error;
  }
}

// よくある質問（人気FAQ）のID一覧を取得
async function getPopularIds() {
  try {
    return await googleSheets.getPopularIds(4);
  } catch (error) {
    console.error('❌ 人気FAQ取得エラー:', error);
    return [];
  }
}

// テキストの類似度計算（シンプルなキーワードマッチング）
function calculateSimilarity(text, keywords) {
  const textLower = text.toLowerCase();
  let score = 0;
  
  if (Array.isArray(keywords)) {
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase().trim();
      if (keywordLower && textLower.includes(keywordLower)) {
        score += 10; // キーワード完全一致
      }
    });
  }
  
  // 質問文全体との部分一致もチェック
  if (typeof keywords === 'string') {
    const keywordLower = keywords.toLowerCase();
    if (textLower.includes(keywordLower) || keywordLower.includes(textLower)) {
      score += 20; // 質問文との一致は高スコア
    }
  }
  
  return score;
}

// FAQ検索（セマンティック検索風）
async function searchFAQ(query) {
  let data;
  try {
    data = await loadFAQData();
  } catch (error) {
    console.error('❌ searchFAQ: FAQデータの読み込みに失敗:', error.message);
    throw new Error(`FAQデータの読み込みに失敗しました: ${error.message}`);
  }
  
  const results = [];
  
  console.log(`🔍 検索クエリ: "${query}"`);
  console.log(`📋 検索対象のFAQ数: ${data.faqs.length}件`);
  
  const queryLower = query.toLowerCase().trim();
  
  data.faqs.forEach(faq => {
    let totalScore = 0;
    
    // 1. 質問文との完全一致（最高スコア）
    if (faq.question && faq.question.toLowerCase().trim() === queryLower) {
      totalScore += 100;
    }
    
    // 2. 質問文との部分一致
    if (faq.question && faq.question.toLowerCase().includes(queryLower)) {
      totalScore += 50;
    }
    if (queryLower.includes(faq.question.toLowerCase().trim())) {
      totalScore += 50;
    }
    
    // 3. キーワードとの一致
    if (Array.isArray(faq.keywords) && faq.keywords.length > 0) {
      faq.keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase().trim();
        if (keywordLower && queryLower.includes(keywordLower)) {
          totalScore += 20; // キーワード一致
        }
        if (keywordLower && faq.question && faq.question.toLowerCase().includes(keywordLower)) {
          totalScore += 10; // 質問文にキーワードが含まれている
        }
      });
    }
    
    // 4. 回答文にもキーワードが含まれている場合（低スコア）
    if (faq.answer && queryLower.split('').some(char => faq.answer.toLowerCase().includes(char))) {
      // 単純な文字一致は低スコア
      const commonWords = queryLower.split(/\s+/).filter(word => word.length > 1);
      commonWords.forEach(word => {
        if (faq.answer.toLowerCase().includes(word)) {
          totalScore += 5;
        }
      });
    }
    
    if (totalScore > 0) {
      results.push({
        ...faq,
        score: totalScore
      });
    }
  });
  
  // スコアの高い順にソート
  results.sort((a, b) => b.score - a.score);
  
  console.log(`✅ 検索結果: ${results.length}件見つかりました`);
  if (results.length > 0) {
    console.log(`   最上位: "${results[0].question}" (スコア: ${results[0].score})`);
    if (results.length > 1) {
      console.log(`   2位: "${results[1].question}" (スコア: ${results[1].score})`);
    }
  }
  
  return results;
}

// ルート
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chatbot.html'));
});

// セッションID生成関数
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// チャットボット用API
app.post('/api/chat', async (req, res) => {
  const { message, userId, sessionId } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'メッセージが必要です' });
  }
  
  try {
    // FAQ検索
    const results = await searchFAQ(message);
    
    let answer, faqId;
    if (results.length > 0) {
      // 最もスコアの高いFAQを返す
      const bestMatch = results[0];
      answer = bestMatch.answer;
      faqId = bestMatch.id;
      
      // 使用回数をインクリメント（エラーが発生しても続行）
      try {
        await googleSheets.incrementFAQUsage(faqId);
      } catch (usageError) {
        console.warn('⚠️ 使用回数のインクリメントに失敗（続行）:', usageError.message);
      }
    } else {
      // マッチしない場合のデフォルト応答
      answer = 'お問い合わせありがとうございます。申し訳ございませんが、該当する情報が見つかりませんでした。お手数ですが、別の言い方でお試しいただくか、カスタマーサポートまでお問い合わせください。';
      faqId = null;
    }
    
    // 履歴を保存（エラーが発生しても続行）
    try {
      await googleSheets.addHistory({
        question: message,
        answer: answer,
        faqId: faqId,
        userId: userId || 'anonymous',
        sessionId: sessionId || generateSessionId(),
      });
    } catch (historyError) {
      console.warn('⚠️ 履歴の保存に失敗（続行）:', historyError.message);
    }
    
    res.json({
      answer: answer,
      relatedQuestions: results.slice(1, 4).map(r => r.question)
    });
  } catch (error) {
    console.error('❌ チャットAPIエラー:', error);
    console.error('   エラー詳細:', error.message);
    console.error('   スタックトレース:', error.stack);
    
    // エラーの種類に応じて適切なメッセージを返す
    let errorMessage = 'サーバーエラーが発生しました';
    if (error.message.includes('初期化')) {
      errorMessage = 'Google Sheets APIの初期化に失敗しました。環境変数の設定を確認してください。';
    } else if (error.message.includes('認証')) {
      errorMessage = '認証エラーが発生しました。認証情報を確認してください。';
    } else if (error.message.includes('スプレッドシート')) {
      errorMessage = 'スプレッドシートへのアクセスに失敗しました。';
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

// FAQ一覧取得API
app.get('/api/faqs', async (req, res) => {
  try {
    const data = await loadFAQData();
    res.json(data.faqs);
  } catch (error) {
    console.error('❌ FAQ一覧取得エラー:', error);
    res.status(500).json({ error: 'FAQの取得に失敗しました' });
  }
});

// 代表的なFAQ取得API（初回表示用）
app.get('/api/faqs/popular', async (req, res) => {
  try {
    const data = await loadFAQData();
    const popularIds = await getPopularIds();
    const popularFaqs = popularIds
      .map(id => data.faqs.find(f => f.id === id))
      .filter(Boolean)
      .slice(0, 4);
    res.json(popularFaqs);
  } catch (error) {
    console.error('❌ 代表的なFAQ取得エラー:', error);
    res.status(500).json({ error: 'FAQの取得に失敗しました' });
  }
});

// 代表的なFAQ設定取得API（管理画面用）
app.get('/api/faqs/popular-settings', async (req, res) => {
  try {
    const popularIds = await getPopularIds();
    res.json({ popularIds });
  } catch (error) {
    console.error('❌ 人気FAQ設定取得エラー:', error);
    res.status(500).json({ error: '設定の取得に失敗しました' });
  }
});

// 代表的なFAQ設定更新API（管理画面用）
// 注意: スプレッドシートでは使用回数ベースで自動的に決定されるため、
// このAPIは互換性のために残していますが、実際には使用回数が反映されます
app.post('/api/faqs/popular-settings', async (req, res) => {
  try {
    const { popularIds } = req.body;

    if (!Array.isArray(popularIds)) {
      return res.status(400).json({ error: 'popularIds は配列で指定してください' });
    }

    const data = await loadFAQData();

    // 入力されたIDのうち、有効なものだけを最大4件まで採用
    const validIds = popularIds
      .map(id => parseInt(id))
      .filter(id => !isNaN(id) && data.faqs.some(f => f.id === id));

    const uniqueIds = Array.from(new Set(validIds)).slice(0, 4);

    if (uniqueIds.length === 0) {
      return res.status(400).json({ error: '有効なFAQが選択されていません' });
    }

    // スプレッドシートでは使用回数ベースで自動的に決定されるため、
    // ここでは設定を保存せず、使用回数ベースの結果を返す
    const actualPopularIds = await getPopularIds();
    res.json({ success: true, popularIds: actualPopularIds });
  } catch (error) {
    console.error('❌ 人気FAQ設定更新エラー:', error);
    res.status(500).json({ error: '設定の更新に失敗しました' });
  }
});

// FAQ追加API
app.post('/api/faqs', async (req, res) => {
  const { question, answer, keywords, category } = req.body;
  
  if (!question || !answer) {
    return res.status(400).json({ error: '質問と回答は必須です' });
  }
  
  try {
    const newFAQ = await googleSheets.addFAQ({
      question: question.trim(),
      answer: answer.trim(),
      keywords: keywords || [],
      category: category || '',
    });
    
    res.json({ success: true, faq: newFAQ });
  } catch (error) {
    console.error('❌ FAQ追加エラー:', error);
    res.status(500).json({ error: 'FAQの追加に失敗しました: ' + error.message });
  }
});

// FAQ更新API
app.put('/api/faqs/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { question, answer, keywords, category } = req.body;
  
  if (isNaN(id)) {
    return res.status(400).json({ error: '無効なIDです' });
  }
  
  try {
    const updateData = {};
    if (question !== undefined) updateData.question = question.trim();
    if (answer !== undefined) updateData.answer = answer.trim();
    if (keywords !== undefined) updateData.keywords = keywords;
    if (category !== undefined) updateData.category = category;
    
    await googleSheets.updateFAQ(id, updateData);
    
    // 更新後のデータを取得
    const data = await loadFAQData();
    const updatedFAQ = data.faqs.find(f => f.id === id);
    
    if (!updatedFAQ) {
      return res.status(404).json({ error: 'FAQが見つかりません' });
    }
    
    res.json({ success: true, faq: updatedFAQ });
  } catch (error) {
    console.error('❌ FAQ更新エラー:', error);
    if (error.message === 'FAQが見つかりません') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'FAQの更新に失敗しました: ' + error.message });
  }
});

// FAQ削除API
app.delete('/api/faqs/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: '無効なIDです' });
  }
  
  try {
    await googleSheets.deleteFAQ(id);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ FAQ削除エラー:', error);
    if (error.message === 'FAQが見つかりません') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'FAQの削除に失敗しました: ' + error.message });
  }
});

// FAQ一括インポートAPI（CSV取り込み用）
app.post('/api/faqs/import', async (req, res) => {
  const { rows } = req.body;

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'インポートするデータがありません' });
  }

  try {
    let successCount = 0;
    let errorCount = 0;

    // 各行を順番に追加
    for (const row of rows) {
      const question = (row.question || '').trim();
      const answer = (row.answer || '').trim();
      
      if (question && answer) {
        try {
          await googleSheets.addFAQ({
            question: question,
            answer: answer,
            keywords: Array.isArray(row.keywords) ? row.keywords : [],
            category: row.category || '',
          });
          successCount++;
        } catch (error) {
          console.error('⚠️ FAQ追加エラー:', error);
          errorCount++;
        }
      }
    }

    res.json({ 
      success: true, 
      count: successCount,
      errors: errorCount 
    });
  } catch (error) {
    console.error('❌ 一括インポートエラー:', error);
    res.status(500).json({ error: 'データのインポートに失敗しました' });
  }
});

// サーバー起動
app.listen(PORT, async () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
  console.log(`チャットボット: http://localhost:${PORT}/chatbot.html`);
  console.log(`FAQ管理画面: http://localhost:${PORT}/admin.html`);
  console.log(`📊 データベース: Googleスプレッドシート`);
  console.log('');
  
  // 起動時にFAQデータを読み込んでテスト
  console.log('🔍 起動時にFAQデータを読み込みテスト中...');
  try {
    const testData = await loadFAQData();
    console.log(`📚 読み込んだFAQ数: ${testData.faqs.length}件`);
    if (testData.faqs.length === 0) {
      console.warn('⚠️ FAQデータが0件です。スプレッドシートの設定を確認してください。');
    } else {
      console.log('✅ FAQデータの読み込みに成功しました！');
      console.log(`   例: "${testData.faqs[0].question}"`);
    }
  } catch (error) {
    console.error('❌ FAQデータの読み込みテストでエラー:', error.message);
  }
  console.log('');
});

