# Supabase連携 超わかりやすい説明書 🎓

> **この説明書は中学生でもわかるように書かれています！**  
> 難しい言葉には必ず説明を付けています。

---

## 📚 目次

1. [Supabaseって何？](#supabaseって何)
2. [なぜSupabaseを使うの？](#なぜsupabaseを使うの)
3. [準備するもの](#準備するもの)
4. [ステップ1: Supabaseアカウントを作ろう](#ステップ1-supabaseアカウントを作ろう)
5. [ステップ2: プロジェクトを作ろう](#ステップ2-プロジェクトを作ろう)
6. [ステップ3: データベースのテーブルを作ろう](#ステップ3-データベースのテーブルを作ろう)
7. [ステップ4: 接続情報を取得しよう](#ステップ4-接続情報を取得しよう)
8. [ステップ5: プロジェクトにSupabaseを設定しよう](#ステップ5-プロジェクトにsupabaseを設定しよう)
9. [ステップ6: コードを書こう](#ステップ6-コードを書こう)
10. [ステップ7: 動作確認をしよう](#ステップ7-動作確認をしよう)
11. [よくある質問](#よくある質問)

---

## Supabaseって何？

### 簡単に言うと...

**Supabase（スーパーベース）** は、**データを保存するための箱** をインターネット上に作ってくれるサービスです。

### たとえ話で理解しよう 🏪

あなたがお店を開きたいとします。

- **JSONファイル**: 手帳にメモを書く（簡単だけど、たくさん書けない）
- **Googleスプレッドシート**: Excelファイルに書く（見やすいけど、たくさんの人が同時に使うと遅い）
- **Supabase**: 本格的な倉庫を借りる（たくさん保存できる、速い、安全）

Supabaseは、**本格的なデータベース**（データを保存する倉庫）を、**無料で簡単に**使えるようにしてくれるサービスです。

### 専門用語の説明

- **データベース**: データ（情報）を整理して保存する場所。図書館の本棚みたいなもの
- **テーブル**: データベースの中の表。Excelのシートみたいなもの
- **PostgreSQL**: データベースの種類の名前。とても強力で信頼できる
- **API**: プログラム同士が会話するための方法

---

## なぜSupabaseを使うの？

### Supabaseの良いところ ✅

1. **無料で始められる**
   - 小規模な使い方なら、ずっと無料
   - お金をかけずに試せる

2. **設定が簡単**
   - 難しい設定がほとんどない
   - ボタンをクリックするだけで使える

3. **速い**
   - たくさんの人が同時に使っても速い
   - データの読み書きが高速

4. **安全**
   - データが勝手に消えない
   - 不正アクセスから守ってくれる

5. **管理画面が使いやすい**
   - データを直接見ることができる
   - Excelみたいに操作できる

### 他の方法と比べると...

| 方法 | 難しさ | 速さ | 無料で使える量 |
|------|--------|------|----------------|
| JSONファイル | ⭐ とても簡単 | ⭐ 遅い | 小さい |
| Googleスプレッドシート | ⭐⭐ 簡単 | ⭐⭐ 普通 | 中くらい |
| Supabase | ⭐⭐⭐ 普通 | ⭐⭐⭐⭐⭐ とても速い | 大きい |

---

## 準備するもの

実装を始める前に、以下を準備しましょう：

1. **パソコン**（Windows、Mac、どちらでもOK）
2. **インターネット接続**
3. **メールアドレス**（Supabaseのアカウント作成に必要）
4. **Node.jsがインストールされていること**（すでにインストール済みのはず）
5. **30分〜1時間の時間**

---

## ステップ1: Supabaseアカウントを作ろう

### 1-1. Supabaseのサイトにアクセス

1. ブラウザ（Chrome、Edgeなど）を開く
2. 以下のURLにアクセス：
   ```
   https://supabase.com
   ```

### 1-2. アカウントを作成

1. 画面右上の **"Start your project"** または **"Sign up"** ボタンをクリック
2. **GitHubアカウントで登録** を選ぶ（おすすめ）
   - または、メールアドレスで登録も可能
3. 指示に従ってアカウントを作成

**💡 ヒント**: GitHubアカウントがない場合は、メールアドレスで登録できます。

---

## ステップ2: プロジェクトを作ろう

### 2-1. 新しいプロジェクトを作成

1. Supabaseのダッシュボード（管理画面）にログイン
2. 画面右上の **"New Project"** ボタンをクリック

### 2-2. プロジェクト情報を入力

以下の情報を入力します：

- **Name（プロジェクト名）**: `chatbot-faq`（好きな名前でOK）
- **Database Password（データベースのパスワード）**: 
  - 強力なパスワードを設定（忘れないようにメモ！）
  - 例: `MyChatbot2025!`（これは例です。自分で考えてください）
- **Region（地域）**: `Northeast Asia (Tokyo)` を選ぶ（日本に近いので速い）

### 2-3. プロジェクトを作成

1. **"Create new project"** ボタンをクリック
2. **2〜3分待つ**（プロジェクトが作られるのを待ちます）
3. 完了したら、自動的にプロジェクトのダッシュボードが表示されます

**⏰ 待っている間**: コーヒーを飲んだり、ストレッチをしたりしましょう！

---

## ステップ3: データベースのテーブルを作ろう

テーブルとは、データを保存する表のことです。Excelのシートみたいなものだと思ってください。

### 3-1. Table Editorを開く

1. 左側のメニューから **"Table Editor"** をクリック
2. **"Create a new table"** ボタンをクリック

### 3-2. FAQテーブルを作成

#### テーブル名を設定

- **Name**: `faqs` と入力
- **Description（説明）**: `よくある質問と回答を保存するテーブル`（任意）
- **"Save"** をクリック

#### カラム（列）を追加

**⚠️ 重要**: idカラムは**必ず最初に**追加してください！

テーブルを作ったら、以下の列を追加します：

**列1: id（ID番号）** ⭐ 最初に作成！
- 左側の **"Add column"** をクリック
- **Name**: `id`
- **Type**: `int8` を選択（または `bigint`）
- **Is Primary Key**: ✅ **チェックを入れる**（必須！）
- **Is Identity**: ✅ **チェックを入れる**（必須！自動で番号が振られる）
- **"Save"** をクリック

**💡 ポイント**: 
- `Is Primary Key` と `Is Identity` の**両方**にチェックを入れることが重要です
- 既存のカラムを後からIdentityに変更しようとするとエラーが出ます
- エラーが出た場合は、`Supabase連携_エラー解決方法.md` を参照してください

**列2: question（質問）**
- **"Add column"** をクリック
- **Name**: `question`
- **Type**: `text` を選択
- **Is Nullable**: ❌ チェックを外す（必須にする）
- **"Save"** をクリック

**列3: answer（回答）**
- **"Add column"** をクリック
- **Name**: `answer`
- **Type**: `text` を選択
- **Is Nullable**: ❌ チェックを外す
- **"Save"** をクリック

**列4: keywords（キーワード）**
- **"Add column"** をクリック
- **Name**: `keywords`
- **Type**: `text` を選択
- **Is Nullable**: ✅ チェックを入れる（空欄でもOK）
- **"Save"** をクリック

**列5: created_at（作成日時）**
- **"Add column"** をクリック
- **Name**: `created_at`
- **Type**: `timestamptz` を選択
- **Default Value**: `now()` と入力（自動で現在の日時が入る）
- **"Save"** をクリック

**列6: updated_at（更新日時）**
- **"Add column"** をクリック
- **Name**: `updated_at`
- **Type**: `timestamptz` を選択
- **Default Value**: `now()` と入力
- **"Save"** をクリック

**列7: usage_count（使用回数）**
- **"Add column"** をクリック
- **Name**: `usage_count`
- **Type**: `int8` を選択
- **Default Value**: `0` と入力
- **"Save"** をクリック

**列8: category（カテゴリ）**
- **"Add column"** をクリック
- **Name**: `category`
- **Type**: `text` を選択
- **Is Nullable**: ✅ チェックを入れる
- **"Save"** をクリック

### 3-3. Historyテーブルを作成

同じように、チャット履歴を保存するテーブルも作ります。

1. **"Create a new table"** をクリック
2. **Name**: `history` と入力
3. 以下の列を追加：

| 列名 | 型 | 説明 |
|------|-----|------|
| id | int8 | ID番号（Primary Key、Identity） |
| question | text | ユーザーの質問 |
| answer | text | ボットの回答 |
| faq_id | int8 | 使用されたFAQのID（空欄でもOK） |
| user_id | text | ユーザーID |
| session_id | text | セッションID |
| satisfaction | int8 | 満足度（1-5、空欄でもOK） |
| created_at | timestamptz | 作成日時（Default: now()） |

**💡 ヒント**: `faq_id`、`user_id`、`session_id`、`satisfaction` は **Is Nullable** にチimage.pngください（空欄でもOKにします）。

### 3-4. サンプルデータを追加（テスト用）

1. `faqs` テーブルを開く
2. 画面下部の **"Insert row"** をクリック
3. 以下のデータを入力：

```
question: 営業時間を教えてください
answer: 営業時間は平日9:00〜18:00です。土日祝日は休業となります。
keywords: 営業時間,何時,いつ,時間,営業
category: 基本情報
```

4. **"Save"** をクリック

これで、データベースの準備が完了です！

---

## ステップ4: 接続情報を取得しよう

プログラムからSupabaseに接続するために、**接続情報**（パスワードみたいなもの）を取得します。

### 4-1. API設定を開く

1. 左側のメニューから **"Settings"**（歯車のアイコン）をクリック
2. **"API"** をクリック

### 4-2. 必要な情報をコピー

以下の3つの情報をメモ帳にコピーしておきます：

1. **Project URL**
   - 例: `https://abcdefghijklmnop.supabase.co`
   - このURLをコピー

2. **anon public key**
   - 長い文字列（例: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`）
   - このキーをコピー

3. **service_role key**（管理用、注意して使う）
   - これも長い文字列
   - このキーをコピー（**絶対に他人に見せないこと！**）

**💡 重要**: これらの情報は、後で `.env` ファイルに保存します。

---

## ステップ5: プロジェクトにSupabaseを設定しよう

### 5-1. パッケージをインストール

ターミナル（コマンドプロンプト）を開いて、以下のコマンドを実行：

```bash
npm install @supabase/supabase-js dotenv
```

**説明**:
- `@supabase/supabase-js`: Supabaseを使うためのパッケージ
- `dotenv`: 環境変数（設定情報）を読み込むパッケージ

### 5-2. .envファイルを作成

プロジェクトのルートフォルダ（`server.js` がある場所）に、`.env` というファイルを作成します。

**ファイル名**: `.env`

**内容**:
```env
# Supabase設定
SUPABASE_URL=https://あなたのProject URLを貼り付け
SUPABASE_ANON_KEY=あなたのanon public keyを貼り付け
SUPABASE_SERVICE_ROLE_KEY=あなたのservice_role keyを貼り付け

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

### 5-3. .gitignoreに追加

`.gitignore` ファイルを開いて、以下の行があるか確認：

```
.env
node_modules/
```

なければ追加してください（`.env` ファイルをGitにコミットしないため）。

---

## ステップ6: コードを書こう

### 6-1. Supabase接続モジュールを作成

`lib/supabase.js` というファイルを新しく作成します。

**ファイル名**: `lib/supabase.js`

**内容**:
```javascript
// Supabaseに接続するためのモジュール
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// 環境変数から接続情報を取得
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Supabaseクライアントを作成
const supabase = createClient(supabaseUrl, supabaseKey);

// 管理用のクライアント（サービスロールキーを使用）
const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = {
  supabase,      // 通常の操作用
  supabaseAdmin  // 管理操作用
};
```

**説明**:
- `createClient`: Supabaseに接続するための関数
- `supabase`: 通常の操作（FAQの読み込みなど）に使う
- `supabaseAdmin`: 管理操作（FAQの追加・削除など）に使う

### 6-2. server.jsを修正

既存の `server.js` を修正して、JSONファイルの代わりにSupabaseを使うようにします。

#### 変更1: 必要なモジュールを追加

ファイルの最初の部分を修正：

```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
// Supabaseを追加
const { supabase, supabaseAdmin } = require('./lib/supabase');

const app = express();
const PORT = process.env.PORT || 3000;
```

#### 変更2: FAQデータの読み込み関数を修正

`loadFAQData()` 関数を以下のように変更：

```javascript
// FAQデータの読み込み（Supabaseから）
async function loadFAQData() {
  try {
    // SupabaseからFAQデータを取得
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('FAQデータの読み込みエラー:', error);
      return { faqs: [] };
    }
    
    // キーワードを配列に変換（Supabaseでは文字列で保存されるため）
    const faqs = data.map(faq => ({
      ...faq,
      keywords: faq.keywords ? faq.keywords.split(',').map(k => k.trim()) : []
    }));
    
    return { faqs };
  } catch (error) {
    console.error('FAQデータの読み込みエラー:', error);
    return { faqs: [] };
  }
}
```

**説明**:
- `supabase.from('faqs')`: `faqs` テーブルからデータを取得
- `.select('*')`: すべての列を取得
- `.order('id')`: ID順に並べる

#### 変更3: FAQ追加APIを修正

`app.post('/api/faqs')` を以下のように変更：

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
        question: question,
        answer: answer,
        keywords: Array.isArray(keywords) ? keywords.join(',') : (keywords || ''),
        category: category || '',
        usage_count: 0
      })
      .select()
      .single();
    
    if (error) {
      console.error('FAQ追加エラー:', error);
      return res.status(500).json({ error: 'FAQの追加に失敗しました' });
    }
    
    // キーワードを配列に変換して返す
    const faq = {
      ...data,
      keywords: data.keywords ? data.keywords.split(',').map(k => k.trim()) : []
    };
    
    res.json({ success: true, faq: faq });
  } catch (error) {
    console.error('FAQ追加エラー:', error);
    res.status(500).json({ error: 'FAQの追加に失敗しました' });
  }
});
```

#### 変更4: FAQ更新APIを修正

`app.put('/api/faqs/:id')` を以下のように変更：

```javascript
// FAQ更新API
app.put('/api/faqs/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { question, answer, keywords, category } = req.body;
  
  try {
    // 更新するデータを準備
    const updateData = {};
    if (question) updateData.question = question;
    if (answer) updateData.answer = answer;
    if (keywords) {
      updateData.keywords = Array.isArray(keywords) 
        ? keywords.join(',') 
        : keywords;
    }
    if (category !== undefined) updateData.category = category;
    updateData.updated_at = new Date().toISOString();
    
    // SupabaseでFAQを更新
    const { data, error } = await supabaseAdmin
      .from('faqs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('FAQ更新エラー:', error);
      return res.status(500).json({ error: 'FAQの更新に失敗しました' });
    }
    
    if (!data) {
      return res.status(404).json({ error: 'FAQが見つかりません' });
    }
    
    // キーワードを配列に変換して返す
    const faq = {
      ...data,
      keywords: data.keywords ? data.keywords.split(',').map(k => k.trim()) : []
    };
    
    res.json({ success: true, faq: faq });
  } catch (error) {
    console.error('FAQ更新エラー:', error);
    res.status(500).json({ error: 'FAQの更新に失敗しました' });
  }
});
```

#### 変更5: FAQ削除APIを修正

`app.delete('/api/faqs/:id')` を以下のように変更：

```javascript
// FAQ削除API
app.delete('/api/faqs/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    // SupabaseからFAQを削除
    const { error } = await supabaseAdmin
      .from('faqs')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('FAQ削除エラー:', error);
      return res.status(500).json({ error: 'FAQの削除に失敗しました' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('FAQ削除エラー:', error);
    res.status(500).json({ error: 'FAQの削除に失敗しました' });
  }
});
```

#### 変更6: チャットAPIに履歴保存を追加

`app.post('/api/chat')` を以下のように変更：

```javascript
// チャットボット用API
app.post('/api/chat', async (req, res) => {
  const { message, userId, sessionId } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'メッセージが必要です' });
  }
  
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
          .update({ usage_count: (faqData.usage_count || 0) + 1 })
          .eq('id', faqId);
      }
    } catch (error) {
      console.error('使用回数更新エラー:', error);
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
    console.error('履歴保存エラー:', error);
  }
  
  res.json({
    answer: answer,
    relatedQuestions: results.slice(1, 4).map(r => r.question)
  });
});

// セッションID生成関数（簡単な実装）
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
```

#### 変更7: 初期化関数を削除またはコメントアウト

`initializeFAQData()` 関数は不要になるので、コメントアウトするか削除します。

---

## ステップ7: 動作確認をしよう

### 7-1. サーバーを起動

ターミナルで以下のコマンドを実行：

```bash
npm start
```

エラーが出ないことを確認してください。

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

### 7-5. エラーが出た場合

ターミナルにエラーメッセージが表示されます。よくあるエラーは以下の通り：

- **"Invalid API key"**: `.env` ファイルのキーが間違っている
- **"relation does not exist"**: テーブル名が間違っている、またはテーブルが作られていない
- **"connection refused"**: SupabaseのURLが間違っている

---

## よくある質問

### Q1: Supabaseは本当に無料？

**A**: はい、小規模な使い方なら無料です。無料プランでは：
- データベース容量: 500MB
- ファイルストレージ: 1GB
- 月間APIリクエスト: 2,000,000回

これで十分な量です！

### Q2: データは消えない？

**A**: はい、消えません。Supabaseは定期的にバックアップを取っているので、安心です。

### Q3: 他の人にデータを見られない？

**A**: 大丈夫です。APIキーを知っている人だけがアクセスできます。`.env` ファイルを他人に見せないようにしてください。

### Q4: 日本語のデータも保存できる？

**A**: はい、問題なく保存できます。Supabaseは日本語を完全にサポートしています。

### Q5: スマホからも使える？

**A**: はい、使えます。Supabaseはインターネット経由でアクセスするので、どこからでも使えます。

### Q6: エラーが出たときはどうすればいい？

**A**: 
1. ターミナルのエラーメッセージを確認
2. `.env` ファイルの設定を確認
3. Supabaseのダッシュボードでテーブルが正しく作られているか確認
4. **"identity column type must be smallint, integer, or bigint"** というエラーが出た場合:
   - `Supabase連携_エラー解決方法.md` を参照してください
   - テーブルを削除して作り直すのが一番簡単です
5. それでも解決しない場合は、エラーメッセージをコピーして質問してください

---

## 🎉 おめでとうございます！

Supabaseを使ったチャットボットの実装が完了しました！

### 次のステップ

1. **AI連携**: OpenAI APIでFAQを自動生成
2. **分析機能**: 履歴データからよくある質問を分析
3. **認証機能**: 管理画面にログイン機能を追加
4. **リアルタイム更新**: FAQが更新されたら自動で反映

詳しくは、他の資料を参照してください。

---

**作成日**: 2025年1月  
**バージョン**: 1.0.0
