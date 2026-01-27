# Supabase連携 実装コード例 💻

> **コピー&ペーストで使える実装コード**

---

## 📁 ファイル構成

```
ChatBot制作/
├── lib/
│   └── supabase.js          # Supabase接続モジュール
├── server.js                 # メインサーバー（修正版）
├── .env                      # 環境変数（自分で作成）
└── package.json             # 依存関係
```

---

## 1. lib/supabase.js（新規作成）

```javascript
// Supabaseに接続するためのモジュール
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// 環境変数から接続情報を取得
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabaseの環境変数が設定されていません');
  console.error('   .envファイルにSUPABASE_URLとSUPABASE_ANON_KEYを設定してください');
}

// 通常操作用のクライアント
const supabase = createClient(supabaseUrl, supabaseKey);

// 管理操作用のクライアント（サービスロールキーを使用）
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = {
  supabase,      // 通常の操作用（読み込みなど）
  supabaseAdmin  // 管理操作用（追加・更新・削除など）
};
```

---

## 2. server.js（修正版の主要部分）

### 2-1. インポート部分

```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
// Supabaseを追加
const { supabase, supabaseAdmin } = require('./lib/supabase');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
```

### 2-2. FAQデータの読み込み関数

```javascript
// FAQデータの読み込み（Supabaseから）
async function loadFAQData() {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('❌ FAQデータの読み込みエラー:', error);
      return { faqs: [] };
    }
    
    // キーワードを配列に変換（Supabaseでは文字列で保存されるため）
    const faqs = (data || []).map(faq => ({
      ...faq,
      keywords: faq.keywords 
        ? faq.keywords.split(',').map(k => k.trim()).filter(k => k)
        : []
    }));
    
    return { faqs };
  } catch (error) {
    console.error('❌ FAQデータの読み込みエラー:', error);
    return { faqs: [] };
  }
}
```

### 2-3. チャットAPI（履歴保存付き）

```javascript
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
    const data = await loadFAQData();
    const results = searchFAQ(message, data.faqs);
    
    let answer, faqId;
    if (results.length > 0) {
      // 最もスコアの高いFAQを返す
      const bestMatch = results[0];
      answer = bestMatch.answer;
      faqId = bestMatch.id;
      
      // 使用回数をインクリメント
      try {
        const { data: faqData } = await supabaseAdmin
          .from('faqs')
          .select('usage_count')
          .eq('id', faqId)
          .single();
        
        if (faqData) {
          await supabaseAdmin
            .from('faqs')
            .update({ 
              usage_count: (faqData.usage_count || 0) + 1,
              updated_at: new Date().toISOString()
            })
            .eq('id', faqId);
        }
      } catch (error) {
        console.error('⚠️ 使用回数更新エラー:', error);
      }
    } else {
      // マッチしない場合のデフォルト応答
      answer = 'お問い合わせありがとうございます。申し訳ございませんが、該当する情報が見つかりませんでした。お手数ですが、別の言い方でお試しいただくか、カスタマーサポートまでお問い合わせください。';
      faqId = null;
    }
    
    // 履歴を保存
    try {
      await supabaseAdmin
        .from('history')
        .insert({
          question: message,
          answer: answer,
          faq_id: faqId,
          user_id: userId || 'anonymous',
          session_id: sessionId || generateSessionId()
        });
    } catch (error) {
      console.error('⚠️ 履歴保存エラー:', error);
    }
    
    res.json({
      answer: answer,
      relatedQuestions: results.slice(1, 4).map(r => r.question)
    });
  } catch (error) {
    console.error('❌ チャットAPIエラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});
```

### 2-4. FAQ一覧取得API

```javascript
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
```

### 2-5. 代表的なFAQ取得API

```javascript
// 代表的なFAQ取得API（初回表示用）
app.get('/api/faqs/popular', async (req, res) => {
  try {
    const data = await loadFAQData();
    
    // 使用回数の多い順に並べる
    const popularFaqs = [...data.faqs]
      .sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))
      .slice(0, 4);
    
    res.json(popularFaqs);
  } catch (error) {
    console.error('❌ 代表的なFAQ取得エラー:', error);
    res.status(500).json({ error: 'FAQの取得に失敗しました' });
  }
});
```

### 2-6. FAQ追加API

```javascript
// FAQ追加API
app.post('/api/faqs', async (req, res) => {
  const { question, answer, keywords, category } = req.body;
  
  if (!question || !answer) {
    return res.status(400).json({ error: '質問と回答は必須です' });
  }
  
  try {
    // SupabaseにFAQを追加
    const { data, error } = await supabaseAdmin
      .from('faqs')
      .insert({
        question: question.trim(),
        answer: answer.trim(),
        keywords: Array.isArray(keywords) 
          ? keywords.join(',') 
          : (keywords || ''),
        category: category || '',
        usage_count: 0
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ FAQ追加エラー:', error);
      return res.status(500).json({ error: 'FAQの追加に失敗しました: ' + error.message });
    }
    
    // キーワードを配列に変換して返す
    const faq = {
      ...data,
      keywords: data.keywords 
        ? data.keywords.split(',').map(k => k.trim()).filter(k => k)
        : []
    };
    
    res.json({ success: true, faq: faq });
  } catch (error) {
    console.error('❌ FAQ追加エラー:', error);
    res.status(500).json({ error: 'FAQの追加に失敗しました' });
  }
});
```

### 2-7. FAQ更新API

```javascript
// FAQ更新API
app.put('/api/faqs/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { question, answer, keywords, category } = req.body;
  
  if (isNaN(id)) {
    return res.status(400).json({ error: '無効なIDです' });
  }
  
  try {
    // 更新するデータを準備
    const updateData = {
      updated_at: new Date().toISOString()
    };
    
    if (question !== undefined) updateData.question = question.trim();
    if (answer !== undefined) updateData.answer = answer.trim();
    if (keywords !== undefined) {
      updateData.keywords = Array.isArray(keywords) 
        ? keywords.join(',') 
        : keywords;
    }
    if (category !== undefined) updateData.category = category;
    
    // SupabaseでFAQを更新
    const { data, error } = await supabaseAdmin
      .from('faqs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('❌ FAQ更新エラー:', error);
      return res.status(500).json({ error: 'FAQの更新に失敗しました: ' + error.message });
    }
    
    if (!data) {
      return res.status(404).json({ error: 'FAQが見つかりません' });
    }
    
    // キーワードを配列に変換して返す
    const faq = {
      ...data,
      keywords: data.keywords 
        ? data.keywords.split(',').map(k => k.trim()).filter(k => k)
        : []
    };
    
    res.json({ success: true, faq: faq });
  } catch (error) {
    console.error('❌ FAQ更新エラー:', error);
    res.status(500).json({ error: 'FAQの更新に失敗しました' });
  }
});
```

### 2-8. FAQ削除API

```javascript
// FAQ削除API
app.delete('/api/faqs/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: '無効なIDです' });
  }
  
  try {
    // SupabaseからFAQを削除
    const { error } = await supabaseAdmin
      .from('faqs')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('❌ FAQ削除エラー:', error);
      return res.status(500).json({ error: 'FAQの削除に失敗しました: ' + error.message });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('❌ FAQ削除エラー:', error);
    res.status(500).json({ error: 'FAQの削除に失敗しました' });
  }
});
```

### 2-9. 履歴取得API（オプション）

```javascript
// 履歴取得API（管理画面用）
app.get('/api/history', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100); // 最新100件
    
    if (error) {
      console.error('❌ 履歴取得エラー:', error);
      return res.status(500).json({ error: '履歴の取得に失敗しました' });
    }
    
    res.json(data || []);
  } catch (error) {
    console.error('❌ 履歴取得エラー:', error);
    res.status(500).json({ error: '履歴の取得に失敗しました' });
  }
});
```

### 2-10. よくある質問の分析API（オプション）

```javascript
// よくある質問の分析API
app.get('/api/analytics/popular-questions', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // 指定期間の履歴を取得
    const { data, error } = await supabaseAdmin
      .from('history')
      .select('question, created_at')
      .gte('created_at', cutoffDate.toISOString());
    
    if (error) {
      console.error('❌ 分析エラー:', error);
      return res.status(500).json({ error: '分析に失敗しました' });
    }
    
    // 質問ごとに集計
    const questionCounts = {};
    (data || []).forEach(record => {
      const question = record.question;
      questionCounts[question] = (questionCounts[question] || 0) + 1;
    });
    
    // 回数の多い順にソート
    const popularQuestions = Object.entries(questionCounts)
      .map(([question, count]) => ({ question, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    res.json(popularQuestions);
  } catch (error) {
    console.error('❌ 分析エラー:', error);
    res.status(500).json({ error: '分析に失敗しました' });
  }
});
```

---

## 3. .envファイル（テンプレート）

```env
# Supabase設定
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# サーバー設定
PORT=3000
```

**⚠️ 注意**: 実際の値に置き換えてください！

---

## 4. package.json（依存関係の確認）

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2"
  }
}
```

---

## 📝 使い方

1. **`lib/supabase.js` を作成**（上記のコードをコピー）
2. **`server.js` を修正**（既存の関数を上記のコードに置き換え）
3. **`.env` ファイルを作成**（Supabaseの接続情報を入力）
4. **パッケージをインストール**:
   ```bash
   npm install @supabase/supabase-js dotenv
   ```
5. **サーバーを起動**:
   ```bash
   npm start
   ```

---

## 🔍 デバッグのヒント

### エラーログを確認

ターミナルに表示されるエラーメッセージを確認してください：
- `❌` マークが付いている行はエラー
- `⚠️` マークが付いている行は警告（動作は続行）

### Supabaseダッシュボードで確認

1. Supabaseのダッシュボードにログイン
2. **"Table Editor"** でデータが正しく保存されているか確認
3. **"Logs"** でAPIリクエストのログを確認

---

## 🎯 次のステップ

- AI連携でFAQを自動生成
- 分析ダッシュボードの作成
- 認証機能の追加
- リアルタイム更新機能

---

**作成日**: 2025年1月  
**バージョン**: 1.0.0
