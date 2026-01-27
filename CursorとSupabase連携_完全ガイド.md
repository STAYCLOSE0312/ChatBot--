# CursorとSupabase連携 完全ガイド 🚀

> **CursorエディタでSupabaseを使う方法を、ステップバイステップで説明します！**

---

## 📋 目次

1. [準備するもの](#準備するもの)
2. [ステップ1: Supabaseの準備](#ステップ1-supabaseの準備)
3. [ステップ2: Cursorでプロジェクトを開く](#ステップ2-cursorでプロジェクトを開く)
4. [ステップ3: 必要なパッケージをインストール](#ステップ3-必要なパッケージをインストール)
5. [ステップ4: 環境変数を設定](#ステップ4-環境変数を設定)
6. [ステップ5: Supabase接続モジュールを作成](#ステップ5-supabase接続モジュールを作成)
7. [ステップ6: server.jsを修正](#ステップ6-serverjsを修正)
8. [ステップ7: 動作確認](#ステップ7-動作確認)
9. [トラブルシューティング](#トラブルシューティング)

---

## 準備するもの

- ✅ Cursorエディタ（既にインストール済み）
- ✅ Node.js（既にインストール済み）
- ✅ Supabaseアカウント（作成済み）
- ✅ Supabaseプロジェクト（作成済み）
- ✅ 30分の時間

---

## ステップ1: Supabaseの準備

### 1-1. Supabaseの接続情報を取得

1. Supabaseのダッシュボードにログイン
   - URL: https://supabase.com/dashboard
2. プロジェクトを選択
3. 左メニューから **"Settings"**（歯車アイコン）をクリック
4. **"API"** をクリック
5. 以下の3つの情報をコピーしてメモ帳に保存：

   - **Project URL**
     - 例: `https://abcdefghijklmnop.supabase.co`
   
   - **anon public key**
     - 長い文字列（例: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`）
   
   - **service_role key**
     - これも長い文字列
     - **⚠️ 重要**: このキーは絶対に他人に見せないこと！

### 1-2. テーブルが作成されているか確認

1. 左メニューから **"Table Editor"** をクリック
2. `faqs` テーブルが存在するか確認
3. 存在しない場合は、`Supabase連携_超わかりやすい説明書.md` を参照して作成

---

## ステップ2: Cursorでプロジェクトを開く

### 2-1. Cursorでプロジェクトフォルダを開く

1. **Cursorを起動**
2. **"File"** → **"Open Folder"** をクリック
3. プロジェクトフォルダを選択
   - 例: `G:\マイドライブ\003｜Cursor\ChatBot制作`
4. **"フォルダーの選択"** をクリック

### 2-2. フォルダ構造を確認

Cursorの左側のエクスプローラーで、以下のファイルがあることを確認：

```
ChatBot制作/
├── server.js          ← これを修正します
├── package.json       ← 依存関係を追加します
├── .env               ← 新規作成します
├── lib/               ← 新規作成します
│   └── supabase.js    ← 新規作成します
└── public/            ← 既存のファイル
```

---

## ステップ3: 必要なパッケージをインストール

### 3-1. Cursorのターミナルを開く

1. Cursorの下部にある **"Terminal"** タブをクリック
   - または **Ctrl + `**（バッククォート）キーを押す
2. ターミナルが開いたことを確認

### 3-2. パッケージをインストール

ターミナルに以下のコマンドを入力してEnterキーを押す：

```bash
npm install @supabase/supabase-js dotenv
```

**説明**:
- `@supabase/supabase-js`: Supabaseを使うためのパッケージ
- `dotenv`: 環境変数を読み込むパッケージ

### 3-3. インストール完了を確認

インストールが完了すると、以下のようなメッセージが表示されます：

```
added 15 packages, and audited 16 packages in 5s
```

`package.json` ファイルを開いて、`dependencies` に以下が追加されているか確認：

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "dotenv": "^16.3.1",
    ...
  }
}
```

---

## ステップ4: 環境変数を設定

### 4-1. .envファイルを作成

1. Cursorの左側のエクスプローラーで、プロジェクトのルートフォルダを右クリック
2. **"New File"** を選択
3. ファイル名を `.env` と入力（先頭のドットを忘れずに！）
4. Enterキーを押す

### 4-2. .envファイルに接続情報を記入

`.env` ファイルを開いて、以下の内容を入力：

```env
# Supabase設定
SUPABASE_URL=ここにProject URLを貼り付け
SUPABASE_ANON_KEY=ここにanon public keyを貼り付け
SUPABASE_SERVICE_ROLE_KEY=ここにservice_role keyを貼り付け

# サーバー設定
PORT=3000
```

**例**（実際の値に置き換えてください）:

```env
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
PORT=3000
```

### 4-3. .gitignoreに追加（重要！）

`.gitignore` ファイルを開いて、以下の行があるか確認：

```
.env
node_modules/
```

なければ追加してください（`.env` ファイルをGitにコミットしないため）。

---

## ステップ5: Supabase接続モジュールを作成

### 5-1. libフォルダを作成

1. Cursorの左側のエクスプローラーで、プロジェクトのルートフォルダを右クリック
2. **"New Folder"** を選択
3. フォルダ名を `lib` と入力
4. Enterキーを押す

### 5-2. supabase.jsファイルを作成

1. `lib` フォルダを右クリック
2. **"New File"** を選択
3. ファイル名を `supabase.js` と入力
4. Enterキーを押す

### 5-3. supabase.jsにコードを記入

`lib/supabase.js` ファイルを開いて、以下のコードを入力：

```javascript
// Supabaseに接続するためのモジュール
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// 環境変数から接続情報を取得
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// エラーチェック
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabaseの環境変数が設定されていません');
  console.error('   .envファイルにSUPABASE_URLとSUPABASE_ANON_KEYを設定してください');
}

// 通常操作用のクライアント（読み込みなど）
const supabase = createClient(supabaseUrl, supabaseKey);

// 管理操作用のクライアント（追加・更新・削除など）
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = {
  supabase,      // 通常の操作用
  supabaseAdmin  // 管理操作用
};
```

### 5-4. ファイルを保存

**Ctrl + S** を押してファイルを保存

---

## ステップ6: server.jsを修正

### 6-1. server.jsを開く

1. Cursorの左側のエクスプローラーで `server.js` をクリック
2. ファイルが開いたことを確認

### 6-2. インポート部分を修正

ファイルの最初の部分（1〜5行目あたり）を以下のように修正：

**変更前**:
```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
```

**変更後**:
```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
// Supabaseを追加
const { supabase, supabaseAdmin } = require('./lib/supabase');
```

### 6-3. loadFAQData関数を修正

`loadFAQData()` 関数を見つけて、以下のように置き換え：

**変更前**:
```javascript
// FAQデータの読み込み
function loadFAQData() {
  try {
    const data = fs.readFileSync(FAQ_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('FAQデータの読み込みエラー:', error);
    return { faqs: [] };
  }
}
```

**変更後**:
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

### 6-4. チャットAPIを修正

`app.post('/api/chat')` を見つけて、以下のように修正：

**変更前**:
```javascript
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'メッセージが必要です' });
  }
  
  // FAQ検索
  const results = searchFAQ(message);
  
  if (results.length > 0) {
    const bestMatch = results[0];
    res.json({
      answer: bestMatch.answer,
      relatedQuestions: results.slice(1, 4).map(r => r.question)
    });
  } else {
    res.json({
      answer: 'お問い合わせありがとうございます。申し訳ございませんが、該当する情報が見つかりませんでした。',
      relatedQuestions: []
    });
  }
});
```

**変更後**:
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
      answer = 'お問い合わせありがとうございます。申し訳ございませんが、該当する情報が見つかりませんでした。';
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

### 6-5. その他のAPIも修正

`Supabase連携_実装コード例.md` を参照して、以下のAPIも修正してください：

- `app.get('/api/faqs')` - FAQ一覧取得
- `app.post('/api/faqs')` - FAQ追加
- `app.put('/api/faqs/:id')` - FAQ更新
- `app.delete('/api/faqs/:id')` - FAQ削除

### 6-6. initializeFAQData関数をコメントアウト

`initializeFAQData()` 関数の呼び出しをコメントアウト：

```javascript
// サーバー起動
// initializeFAQData(); // Supabaseを使うので不要
app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
  console.log(`チャットボット: http://localhost:${PORT}/chatbot.html`);
  console.log(`FAQ管理画面: http://localhost:${PORT}/admin.html`);
});
```

### 6-7. ファイルを保存

**Ctrl + S** を押してファイルを保存

---

## ステップ7: 動作確認

### 7-1. サーバーを起動

1. Cursorのターミナルで、以下のコマンドを入力：

```bash
npm start
```

2. 以下のようなメッセージが表示されれば成功：

```
サーバーが起動しました: http://localhost:3000
チャットボット: http://localhost:3000/chatbot.html
FAQ管理画面: http://localhost:3000/admin.html
```

### 7-2. ブラウザでアクセス

1. ブラウザを開く
2. 以下のURLにアクセス：
   ```
   http://localhost:3000/chatbot.html
   ```

### 7-3. チャットボットをテスト

1. 質問を入力（例: "営業時間を教えてください"）
2. 回答が返ってくることを確認
3. Supabaseのダッシュボードで `history` テーブルを確認
   - 履歴が保存されているか確認

### 7-4. FAQ管理画面をテスト

1. 以下のURLにアクセス：
   ```
   http://localhost:3000/admin.html
   ```

2. 新しいFAQを追加
3. Supabaseのダッシュボードで `faqs` テーブルを確認
   - 追加されたFAQが表示されているか確認

---

## トラブルシューティング

### エラー: "Cannot find module './lib/supabase'"

**原因**: `lib/supabase.js` ファイルが存在しない、またはパスが間違っている

**解決方法**:
1. `lib` フォルダが存在するか確認
2. `lib/supabase.js` ファイルが存在するか確認
3. ファイル名のスペルが正しいか確認

### エラー: "Invalid API key"

**原因**: `.env` ファイルのキーが間違っている

**解決方法**:
1. `.env` ファイルを開く
2. Supabaseのダッシュボードから正しいキーをコピー
3. `.env` ファイルに貼り付け
4. サーバーを再起動

### エラー: "relation does not exist"

**原因**: テーブルが存在しない、またはテーブル名が間違っている

**解決方法**:
1. Supabaseのダッシュボードで `faqs` テーブルが存在するか確認
2. テーブル名が `faqs` になっているか確認（大文字小文字も重要）
3. 存在しない場合は、`Supabase連携_超わかりやすい説明書.md` を参照して作成

### エラー: "connection refused"

**原因**: SupabaseのURLが間違っている

**解決方法**:
1. `.env` ファイルの `SUPABASE_URL` を確認
2. Supabaseのダッシュボードから正しいURLをコピー
3. `.env` ファイルに貼り付け
4. サーバーを再起動

### サーバーが起動しない

**原因**: 構文エラーやモジュールのインポートエラー

**解決方法**:
1. ターミナルのエラーメッセージを確認
2. `server.js` の構文エラーを確認
3. すべての `async` 関数に `await` が正しく使われているか確認

---

## ✅ チェックリスト

実装が完了したら、以下を確認してください：

- [ ] Supabaseの接続情報を取得
- [ ] `faqs` と `history` テーブルを作成
- [ ] Cursorでプロジェクトを開く
- [ ] `@supabase/supabase-js` と `dotenv` をインストール
- [ ] `.env` ファイルを作成して接続情報を記入
- [ ] `.gitignore` に `.env` を追加
- [ ] `lib/supabase.js` を作成
- [ ] `server.js` を修正
- [ ] サーバーが起動する
- [ ] チャットボットが動作する
- [ ] FAQが追加・更新・削除できる
- [ ] 履歴が保存される

---

## 🎉 完了！

これで、CursorとSupabaseの連携が完了しました！

### 次のステップ

- AI連携でFAQを自動生成
- 分析ダッシュボードの作成
- 認証機能の追加
- リアルタイム更新機能

詳しくは、他の資料を参照してください。

---

**作成日**: 2025年1月  
**バージョン**: 1.0.0
