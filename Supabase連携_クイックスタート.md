# Supabase連携 クイックスタートガイド ⚡

> **5ステップで実装開始！**

---

## 🚀 5ステップで完了

### ステップ1: Supabaseアカウント作成（3分）

1. https://supabase.com にアクセス
2. **"Start your project"** をクリック
3. GitHubまたはメールでアカウント作成

### ステップ2: プロジェクト作成（5分）

1. **"New Project"** をクリック
2. プロジェクト名を入力（例: `chatbot-faq`）
3. データベースパスワードを設定（忘れないようにメモ！）
4. 地域: **Northeast Asia (Tokyo)** を選択
5. **"Create new project"** をクリック
6. 2〜3分待つ

### ステップ3: テーブル作成（10分）

#### FAQテーブル

1. 左メニュー → **"Table Editor"** → **"Create a new table"**
2. テーブル名: `faqs`
3. 以下の列を追加：

| 列名 | 型 | Primary Key | Identity | Nullable | Default |
|------|-----|-------------|-----------|----------|---------|
| id | int8 | ✅ | ✅ | - | - |
| question | text | - | - | ❌ | - |
| answer | text | - | - | ❌ | - |
| keywords | text | - | - | ✅ | - |
| created_at | timestamptz | - | - | - | `now()` |
| updated_at | timestamptz | - | - | - | `now()` |
| usage_count | int8 | - | - | - | `0` |
| category | text | - | - | ✅ | - |

#### Historyテーブル

1. **"Create a new table"** をクリック
2. テーブル名: `history`
3. 以下の列を追加：

| 列名 | 型 | Primary Key | Identity | Nullable |
|------|-----|-------------|-----------|----------|
| id | int8 | ✅ | ✅ | - |
| question | text | - | - | ❌ |
| answer | text | - | - | ❌ |
| faq_id | int8 | - | - | ✅ |
| user_id | text | - | - | ✅ |
| session_id | text | - | - | ✅ |
| satisfaction | int8 | - | - | ✅ |
| created_at | timestamptz | - | - | - |

### ステップ4: 接続情報を取得（2分）

1. 左メニュー → **"Settings"** → **"API"**
2. 以下の3つをコピー：
   - **Project URL**
   - **anon public key**
   - **service_role key**

### ステップ5: プロジェクトに設定（5分）

1. **パッケージをインストール**
   ```bash
   npm install @supabase/supabase-js dotenv
   ```

2. **`.env` ファイルを作成**（プロジェクトルート）
   ```env
   SUPABASE_URL=ここにProject URLを貼り付け
   SUPABASE_ANON_KEY=ここにanon public keyを貼り付け
   SUPABASE_SERVICE_ROLE_KEY=ここにservice_role keyを貼り付け
   PORT=3000
   ```

3. **`lib/supabase.js` を作成**
   ```javascript
   const { createClient } = require('@supabase/supabase-js');
   require('dotenv').config();
   
   const supabase = createClient(
     process.env.SUPABASE_URL,
     process.env.SUPABASE_ANON_KEY
   );
   
   const supabaseAdmin = createClient(
     process.env.SUPABASE_URL,
     process.env.SUPABASE_SERVICE_ROLE_KEY
   );
   
   module.exports = { supabase, supabaseAdmin };
   ```

4. **`server.js` を修正**
   - 詳細は `Supabase連携_超わかりやすい説明書.md` の「ステップ6」を参照

5. **サーバーを起動**
   ```bash
   npm start
   ```

---

## ✅ チェックリスト

- [ ] Supabaseアカウントを作成
- [ ] プロジェクトを作成
- [ ] `faqs` テーブルを作成
- [ ] `history` テーブルを作成
- [ ] 接続情報（URL、キー）を取得
- [ ] パッケージをインストール
- [ ] `.env` ファイルを作成
- [ ] `lib/supabase.js` を作成
- [ ] `server.js` を修正
- [ ] サーバーが起動する
- [ ] チャットボットが動作する

---

## 🔧 トラブルシューティング

### エラー: "Invalid API key"

**解決方法**: `.env` ファイルのキーが正しいか確認

### エラー: "relation does not exist"

**解決方法**: 
- テーブル名が `faqs` と `history` になっているか確認
- Supabaseのダッシュボードでテーブルが作成されているか確認

### エラー: "connection refused"

**解決方法**: `.env` ファイルの `SUPABASE_URL` が正しいか確認

---

## 📚 詳細な説明

より詳しい説明が必要な場合は、`Supabase連携_超わかりやすい説明書.md` を参照してください。

---

**作成日**: 2025年1月
