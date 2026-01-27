# 🚨 Render環境変数設定 - 緊急対応

## ⚠️ 現在の問題

ログを確認したところ、以下の問題が確認されました：

1. **`GOOGLE_SERVICE_ACCOUNT_JSON` が設定されていない**
   - 環境変数の確認ログに表示されていない
   - これが原因で認証情報が読み込めていません

2. **`invalid_grant: 無効な JWT署名` エラー**
   - 認証情報が正しく設定されていないか、JSONの形式が間違っている可能性があります

---

## 🔧 解決方法

### ステップ1: Renderで環境変数を確認・設定

1. Renderのダッシュボードで、サービス（`ChatBot--`）を開く
2. 左側のメニューから「**環境**」（Environment）タブをクリック
3. 環境変数の一覧を確認

#### `GOOGLE_SERVICE_ACCOUNT_JSON` が設定されていない場合

1. 「**環境変数を追加**」（Add Environment Variable）をクリック
2. 以下のように設定：

   **Key**: `GOOGLE_SERVICE_ACCOUNT_JSON`
   
   **Value**: 以下のJSONを**そのまま**コピーして貼り付け：

```json
{
  "type": "service_account",
  "project_id": "chatbot-project2026",
  "private_key_id": "b1b2434323955e205e8ae9ee4ffce2c26579c9c7",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCuQmKJ3GjfYnhR\nSvGjrWLtPaJ+gY1fWceef8A5JtCiflr78emEvwlF8KRvfzvUk3HD3o66jEYaDLu3\n9ZJRwVcqdsvaYiVaojvRt0X46vfBnrp15j4kcLJu7nIrtZ48vx6ed1Gpq5Ql1vWh\ntgxfXJIxv3vHk9dzGQ54apxOI1jLmzVNGhbAlxo9iwdCOqBUUcJ75FeBRH5EECrM\nCLqdb/8WXwin8NFMealOxABOY8/OBV6mHpFtk4EJYMoVuAGH1e2NTaYIleLwx0v5\nXncxWe6xFe5UOBDQmod/pL7uA6JVRgdG4qtnNlY7Ye/cfKqjtxF10qaeER/8m1ii\n12jC8u1LAgMBAAECggEAOARwH8giUFkbu2o/lnG44PHUyB0GYLYANSP1G4ouPGYp\nAl/IRRuSNBEBEzSP+6xwQFpNgItyR5J7T84Z/L0Ns8Ffk7LENkf7udVUIYoLHgtT\n/m2G4Xj26zEss39dQELh6WgK8OOOqsFY0eSvQoKEHojjFguhEUdnPu9qkrXLKBwS\nabWijvBLHq4/5ObQJ/2fjLy2aOSQaff0m8Ub9WgnFQwYkyZ5SxKpEcakkoHQHRGu\nAUcXP5/5y4UNECRMAlNooHeavv3AT5Kd/rZWXzT+OAI/PlxbQ6ZH4p/9lj4sfgwq\nrq6ZC/HvfW4HPdyMmkW124mOlgrkMxmdizG8g477vQKBgQDu4sOiKN0kT/s8ZK1F\nZwH3SdQ8Rc/zNL+lJKw6+8onyC0MEyHkkOh4I3vbEtccb5mDspn7wwkMbnk64qXT\no32mZywmGoTruxM3RxR9Dma7R6dNfMrJj0gUL/08VBVA3YdgfxsePzgX1PmN5wCL\nYCU0XAohO4rH7GtAgmMBBqT5lwKBgQC6vlofNbiQAh4N5Az3+vqIZqIBtPhBOKlM\nphIUm41ye5KTqCip5Kt9+Q6zko+tIWlbdYZXFv7fhPeOQvFFefQ/frx2086dgQsJ\nGybT/iB0H8uCup7nOPFwbSQptGsIf5rR+wM2SpH5tCDEJMr5HeJp8d3uKlMijfgt\ngOD+a/WYbQKBgQDk9deILx511Wr5oY0pfec2ez6+XjNH6YDd6d5h0j8aDhSPBC9y\nASmvLGNjwBUJHjXHMoG/+llL3v6239EMniCqQyzfgH9x6SYrzybmDc2NJspFzJwY\nwAnXv386OWT9fNZqOKlnPjSnMuvVhFjTPV2rZ6QV4hnMMN9DPzVhIFszFQKBgAxm\nl5V6+8aUXWqOuk29XOWx6xAx9EpgeN2eKZU0vy/bBODJSen+RWUYJOHH2cKldVmd\ndE5UOJifO9E2oM78SjvtLpa1egL7jsAMDYgGWCFd+yWzPtob7eyJUt1yHalyz9Uh\n1hTE3uy2CXb8+n2QfniKlzI5nUuuIczjwg0jHiwBAoGALQ5xdtKwujNt3yWgVvwx\n2k+lGVYDEiJlbhENye+bTUYVP8ob+GkAWjqQ8+0s8EbdDx/pU+Udxk4e2YHLrryr\nrZMgN8pkvuZ7ahmtt2Yth1FXxqVizJ273NYonDlRabc/wNITF9E9D//Df04Op9Ko\nCsYK0w/6vk114HDGoP7im0w=\n-----END PRIVATE KEY-----\n",
  "client_email": "chatbot-service2026@chatbot-project2026.iam.gserviceaccount.com",
  "client_id": "113078626159904511878",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/chatbot-service2026%40chatbot-project2026.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```

3. 「**保存**」（Save）をクリック

#### スプレッドシートIDを確認

ログを見ると、スプレッドシートIDが `1QzMLgr` になっていますが、正しくは `1QrMLgr` です。

1. 環境変数 `GOOGLE_SHEETS_SPREADSHEET_ID` を確認
2. 値が `1QrMLgr-Ws3y4eA3ad2JyjRicDRzP5oTyKl6u9mHRbDE` になっているか確認
3. 間違っている場合は修正

---

### ステップ2: コードを更新してGitHubにプッシュ

環境変数の確認ログに `GOOGLE_SERVICE_ACCOUNT_JSON` を追加しました。
変更をGitHubにプッシュする必要があります。

1. Cursorのソース管理パネルを開く（`Ctrl + Shift + G`）
2. 「変更」の下に `server.js` が表示されます
3. 「すべてステージ」をクリック
4. メッセージ欄に「環境変数の確認ログを追加」と入力
5. 「✓」をクリック
6. 「変更を同期」または「プッシュ」をクリック

---

### ステップ3: Renderで再デプロイ

1. Renderのダッシュボードで、サービスを開く
2. 右上の「**手動デプロイ**」→「**最新のコミットをデプロイ**」をクリック
3. デプロイが完了するまで待つ（5〜10分）

---

### ステップ4: ログで確認

デプロイ完了後、「ログ」タブで以下を確認：

✅ **成功のサイン**:
- `GOOGLE_SERVICE_ACCOUNT_JSON: (設定済み)`
- `📝 環境変数から認証情報を読み込みます...`
- `✅ Google Sheets API接続成功`
- `📚 読み込んだFAQ数: X件`（0件ではない）

❌ **エラーの場合**:
- `GOOGLE_SERVICE_ACCOUNT_JSON: (未設定)` → 環境変数が設定されていない
- `認証情報JSONの解析に失敗しました` → JSONの形式が間違っている

---

## ⚠️ 重要な注意事項

### JSONの貼り付け方法

1. **ファイルからコピー**:
   - ローカルの `credentials/google-service-account.json.json` を開く
   - 全て選択（Ctrl+A）
   - コピー（Ctrl+C）

2. **Renderに貼り付け**:
   - Renderの環境変数のValue欄をクリック
   - 貼り付け（Ctrl+V）
   - **改行やスペースはそのままでOK**

3. **確認**:
   - `{` から始まって `}` で終わっているか
   - 全てのフィールドが含まれているか

---

## 🔍 トラブルシューティング

### 問題1: JSONの解析エラー

**原因**: JSONの形式が正しくない

**解決方法**:
1. JSONの内容を再度確認
2. `{` と `}` が正しく閉じられているか確認
3. カンマやクォートが正しいか確認

### 問題2: 環境変数が反映されない

**解決方法**:
1. 環境変数を削除して再度追加
2. デプロイを再実行

### 問題3: スプレッドシートIDが間違っている

**解決方法**:
1. 環境変数 `GOOGLE_SHEETS_SPREADSHEET_ID` を確認
2. 正しいID: `1QrMLgr-Ws3y4eA3ad2JyjRicDRzP5oTyKl6u9mHRbDE`
3. 間違っている場合は修正

---

**作成日**: 2025年1月
**バージョン**: 1.0.0
