# 🔍 Renderデプロイ確認とエラー解決方法

## 📋 デプロイの状態を確認

### ステップ1: Renderのダッシュボードで確認

1. Renderのダッシュボードで、サービス（`ChatBot--`）を開く
2. 左側のメニューから「**ログ**」（Logs）タブをクリック
3. 以下の情報を確認：

#### ✅ デプロイが完了している場合

- 「Build successful」または「Deploy successful」と表示される
- 「Live」と表示される
- エラーメッセージがない

#### ❌ デプロイが失敗している場合

- 「Build failed」または「Deploy failed」と表示される
- エラーメッセージが表示される

---

## 🔍 エラーの原因を特定

### よくあるエラーと解決方法

#### エラー1: 「Google Sheets API接続エラー」

**原因**: 環境変数が正しく設定されていない

**解決方法**:
1. 「環境」（Environment）タブを開く
2. 以下の環境変数が設定されているか確認：
   - `GOOGLE_SERVICE_ACCOUNT_JSON` - 認証情報JSONの内容
   - `GOOGLE_SHEETS_SPREADSHEET_ID` - `1QrMLgr-Ws3y4eA3ad2JyjRicDRzP5oTyKl6u9mHRbDE`
   - `PORT` - `3000`（オプション）

3. `GOOGLE_SERVICE_ACCOUNT_JSON` が正しく設定されているか確認：
   - JSONの内容が正しく貼り付けられているか
   - `{` から始まって `}` で終わっているか
   - 改行が含まれているか

#### エラー2: 「認証情報JSONの解析に失敗しました」

**原因**: JSONの形式が正しくない

**解決方法**:
1. 環境変数 `GOOGLE_SERVICE_ACCOUNT_JSON` の値を確認
2. JSONの形式が正しいか確認（`{` と `}` が正しく閉じられているか）
3. 必要に応じて、再度コピーして貼り付け

#### エラー3: 「スプレッドシートIDが設定されていません」

**原因**: 環境変数 `GOOGLE_SHEETS_SPREADSHEET_ID` が設定されていない

**解決方法**:
1. 「環境」タブで環境変数を確認
2. `GOOGLE_SHEETS_SPREADSHEET_ID` が設定されているか確認
3. 値が `1QrMLgr-Ws3y4eA3ad2JyjRicDRzP5oTyKl6u9mHRbDE` になっているか確認

---

## 🔧 デプロイを再実行する方法

### 方法1: 最新のコミットをデプロイ

1. Renderのダッシュボードで、サービスを開く
2. 右上の「**手動デプロイ**」（Manual Deploy）→「**最新のコミットをデプロイ**」（Deploy latest commit）をクリック
3. デプロイが完了するまで待つ（5〜10分）

### 方法2: ビルドキャッシュをクリアしてデプロイ

1. 「**手動デプロイ**」→「**ビルドキャッシュをクリアしてデプロイ**」（Clear build cache & deploy）をクリック
2. デプロイが完了するまで待つ

---

## 📝 環境変数の設定を再確認

### ステップ1: 環境変数の一覧を確認

1. 「環境」（Environment）タブを開く
2. 以下の環境変数が表示されているか確認：

| Key | Value |
|-----|-------|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | （認証情報JSONの内容） |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | `1QrMLgr-Ws3y4eA3ad2JyjRicDRzP5oTyKl6u9mHRbDE` |
| `PORT` | `3000`（オプション） |

### ステップ2: 環境変数の値を確認

#### `GOOGLE_SERVICE_ACCOUNT_JSON` の確認

1. 環境変数のValue欄をクリック
2. JSONの内容が正しく表示されているか確認：
   - `{` から始まっているか
   - `}` で終わっているか
   - 全てのフィールドが含まれているか

#### 正しいJSONの形式

```json
{
  "type": "service_account",
  "project_id": "chatbot-project2026",
  "private_key_id": "b1b2434323955e205e8ae9ee4ffce2c26579c9c7",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "chatbot-service2026@chatbot-project2026.iam.gserviceaccount.com",
  ...
}
```

---

## 🚀 デプロイ後の確認

### ステップ1: ログを確認

1. 「ログ」（Logs）タブを開く
2. 以下のメッセージが表示されれば成功：
   - `📝 環境変数から認証情報を読み込みます...`
   - `✅ Google Sheets API接続成功`
   - `📚 読み込んだFAQ数: X件`（0件ではない）

### ステップ2: チャットボットで動作確認

1. チャットボットにアクセス：
   - `https://chatbot-phg2.onrender.com/chatbot.html`

2. 質問を入力して動作確認：
   - 例: 「領収書は発行できますか？」

3. エラーが表示される場合：
   - ブラウザの開発者ツール（F12）でエラーを確認
   - Renderのログでエラーメッセージを確認

---

## ⚠️ トラブルシューティング

### 問題1: デプロイが完了しない

**解決方法**:
1. 「Cancel deploy」をクリックしてキャンセル
2. 再度「手動デプロイ」→「最新のコミットをデプロイ」を実行

### 問題2: 環境変数が反映されない

**解決方法**:
1. 環境変数を削除して再度追加
2. デプロイを再実行

### 問題3: ログにエラーが表示される

**解決方法**:
1. ログのエラーメッセージを確認
2. エラーの内容に応じて対処：
   - 環境変数が設定されていない → 環境変数を追加
   - JSONの形式が正しくない → JSONを修正
   - スプレッドシートIDが間違っている → IDを確認

---

**作成日**: 2025年1月
**バージョン**: 1.0.0
