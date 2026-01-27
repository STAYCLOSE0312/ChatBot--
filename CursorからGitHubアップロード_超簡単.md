# 🚀 CursorからGitHubにアップロードする方法（超簡単）

## 📋 準備

### 1. GitHubアカウントの作成（まだの場合）

1. https://github.com にアクセス
2. 「Sign up」をクリックしてアカウント作成

### 2. GitHubでリポジトリを作成

1. GitHubにログイン
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名を入力（例: `faq-chatbot`）
4. **「Public」にチェック**（無料プランでは必須）
5. 「Create repository」をクリック
6. **リポジトリのURLをコピー**しておく（例: `https://github.com/YOUR_USERNAME/faq-chatbot.git`）

---

## 🎯 Cursorでの操作手順

### ステップ1: Source Controlパネルを開く

1. Cursorの左側のサイドバーで、**「Source Control」アイコン**（分岐マーク）をクリック
   - または、`Ctrl + Shift + G` を押す

### ステップ2: 変更をステージング（準備）

1. 「Changes」の下にファイル一覧が表示されます
2. 「+」ボタンをクリックして、**全てのファイルを追加**
   - または、各ファイルの横の「+」をクリックして1つずつ追加
   - または、メッセージ欄の上にある「+」ボタンをクリック

**⚠️ 注意**: `.env`ファイルと`credentials`フォルダは自動的に除外されます（`.gitignore`で設定済み）

### ステップ3: コミット（保存）

1. 上部のメッセージ欄に「初回アップロード」と入力
2. 右上の「✓」（チェックマーク）をクリック
   - または、`Ctrl + Enter` を押す

### ステップ4: GitHubリポジトリを接続

1. コミット後、上部に「Publish Branch」または「Publish to GitHub」というボタンが表示されます
2. クリックすると、以下の選択肢が表示されます：
   - **「Publish to GitHub as public repository」** を選択
   - または、「Publish to GitHub as private repository」（有料プランが必要）

3. リポジトリ名を入力（例: `faq-chatbot`）
4. 「Publish to GitHub」をクリック

**初回の場合**:
- GitHubへの認証を求められる場合があります
- 「Sign in with GitHub」をクリック
- ブラウザでGitHubにログインして許可

### ステップ5: 確認

1. アップロードが完了すると、通知が表示されます
2. 「Open on GitHub」をクリックすると、GitHubのページが開きます
3. ファイルが表示されていれば成功です！

---

## 🔄 2回目以降のアップロード（更新）

コードを変更した後：

1. **Source Controlパネル**を開く（`Ctrl + Shift + G`）
2. 変更されたファイルが表示されます
3. 「+」ボタンで変更をステージング
4. メッセージ欄に変更内容を入力（例: 「FAQを追加」）
5. 「✓」をクリックしてコミット
6. 上部の「Sync Changes」または「Push」をクリック

---

## ⚠️ トラブルシューティング

### 問題1: 「Publish Branch」ボタンが表示されない

**解決方法**:
1. まず、リモートリポジトリを手動で設定：
   - ターミナルを開く（`Ctrl + `` `）
   - 以下のコマンドを実行：
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/faq-chatbot.git
     ```
   - `YOUR_USERNAME` をあなたのGitHubユーザー名に置き換える
2. Source Controlパネルをリフレッシュ

### 問題2: GitHubへの認証が失敗する

**解決方法**:
1. Cursorの設定を開く（`Ctrl + ,`）
2. 「GitHub」で検索
3. 「GitHub: Authentication」を確認
4. 必要に応じて再認証

### 問題3: エラーメッセージが表示される

**解決方法**:
1. ターミナルを開く（`Ctrl + `` `）
2. 以下のコマンドで状態を確認：
   ```bash
   git status
   ```
3. エラーメッセージの内容を確認
4. 必要に応じて、手動でコマンドを実行

---

## 💡 補足情報

### Gitがインストールされていない場合

1. https://git-scm.com/downloads からGitをダウンロード
2. インストール（デフォルト設定でOK）
3. Cursorを再起動

### リモートリポジトリを変更したい場合

ターミナルで以下を実行：

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/NEW_REPO_NAME.git
```

---

## ✅ 完了後の次のステップ

GitHubにアップロードが完了したら、次はRenderで公開します：

1. https://render.com にアクセス
2. 「Get Started for Free」→「Continue with GitHub」
3. 「New +」→「Web Service」
4. アップロードしたリポジトリを選択
5. 設定を入力してデプロイ

詳細は `公開手順_超簡単版.md` を参照してください。

---

**作成日**: 2025年1月
**バージョン**: 1.0.0
