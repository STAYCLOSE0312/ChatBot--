# 🔧 Render環境変数設定 - 最終確認と修正方法

## ⚠️ 現在のエラー

ログを確認したところ、以下のエラーが発生しています：

- `invalid_grant: Invalid JWT Signature` - JWT署名が無効
- これは認証情報のJSONが正しく設定されていないか、形式が間違っていることを示しています

---

## 🔍 問題の原因

1. **環境変数 `GOOGLE_SERVICE_ACCOUNT_JSON` が設定されていない可能性**
   - ログに「📝 環境変数から認証情報を読み込みます...」が表示されていない

2. **JSONの形式が間違っている可能性**
   - 改行文字が正しく処理されていない
   - JSONの構造が正しくない

---

## ✅ 解決方法

### ステップ1: Renderで環境変数を確認

1. Renderのダッシュボードで、サービス（`ChatBot--`）を開く
2. 左側のメニューから「**環境**」（Environment）タブをクリック
3. 環境変数の一覧を確認

#### 確認ポイント

- `GOOGLE_SERVICE_ACCOUNT_JSON` が存在するか
- `GOOGLE_SHEETS_SPREADSHEET_ID` が正しいか（`1QrMLgr-Ws3y4eA3ad2JyjRicDRzP5oTyKl6u9mHRbDE`）

---

### ステップ2: 環境変数を正しく設定

#### `GOOGLE_SERVICE_ACCOUNT_JSON` を設定

1. 「**環境変数を追加**」をクリック
2. 以下のように設定：

   **Key**: `GOOGLE_SERVICE_ACCOUNT_JSON`
   
   **Value**: 以下のJSONを**そのまま**コピーして貼り付け：

```json
{"type":"service_account","project_id":"chatbot-project2026","private_key_id":"b1b2434323955e205e8ae9ee4ffce2c26579c9c7","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCuQmKJ3GjfYnhR\nSvGjrWLtPaJ+gY1fWceef8A5JtCiflr78emEvwlF8KRvfzvUk3HD3o66jEYaDLu3\n9ZJRwVcqdsvaYiVaojvRt0X46vfBnrp15j4kcLJu7nIrtZ48vx6ed1Gpq5Ql1vWh\ntgxfXJIxv3vHk9dzGQ54apxOI1jLmzVNGhbAlxo9iwdCOqBUUcJ75FeBRH5EECrM\nCLqdb/8WXwin8NFMealOxABOY8/OBV6mHpFtk4EJYMoVuAGH1e2NTaYIleLwx0v5\nXncxWe6xFe5UOBDQmod/pL7uA6JVRgdG4qtnNlY7Ye/cfKqjtxF10qaeER/8m1ii\n12jC8u1LAgMBAAECggEAOARwH8giUFkbu2o/lnG44PHUyB0GYLYANSP1G4ouPGYp\nAl/IRRuSNBEBEzSP+6xwQFpNgItyR5J7T84Z/L0Ns8Ffk7LENkf7udVUIYoLHgtT\n/m2G4Xj26zEss39dQELh6WgK8OOOqsFY0eSvQoKEHojjFguhEUdnPu9qkrXLKBwS\nabWijvBLHq4/5ObQJ/2fjLy2aOSQaff0m8Ub9WgnFQwYkyZ5SxKpEcakkoHQHRGu\nAUcXP5/5y4UNECRMAlNooHeavv3AT5Kd/rZWXzT+OAI/PlxbQ6ZH4p/9lj4sfgwq\nrq6ZC/HvfW4HPdyMmkW124mOlgrkMxmdizG8g477vQKBgQDu4sOiKN0kT/s8ZK1F\nZwH3SdQ8Rc/zNL+lJKw6+8onyC0MEyHkkOh4I3vbEtccb5mDspn7wwkMbnk64qXT\no32mZywmGoTruxM3RxR9Dma7R6dNfMrJj0gUL/08VBVA3YdgfxsePzgX1PmN5wCL\nYCU0XAohO4rH7GtAgmMBBqT5lwKBgQC6vlofNbiQAh4N5Az3+vqIZqIBtPhBOKlM\nphIUm41ye5KTqCip5Kt9+Q6zko+tIWlbdYZXFv7fhPeOQvFFefQ/frx2086dgQsJ\nGybT/iB0H8uCup7nOPFwbSQptGsIf5rR+wM2SpH5tCDEJMr5HeJp8d3uKlMijfgt\ngOD+a/WYbQKBgQDk9deILx511Wr5oY0pfec2ez6+XjNH6YDd6d5h0j8aDhSPBC9y\nASmvLGNjwBUJHjXHMoG/+llL3v6239EMniCqQyzfgH9x6SYrzybmDc2NJspFzJwY\nwAnXv386OWT9fNZqOKlnPjSnMuvVhFjTPV2rZ6QV4hnMMN9DPzVhIFszFQKBgAxm\nl5V6+8aUXWqOuk29XOWx6xAx9EpgeN2eKZU0vy/bBODJSen+RWUYJOHH2cKldVmd\ndE5UOJifO9E2oM78SjvtLpa1egL7jsAMDYgGWCFd+yWzPtob7eyJUt1yHalyz9Uh\n1hTE3uy2CXb8+n2QfniKlzI5nUuuIczjwg0jHiwBAoGALQ5xdtKwujNt3yWgVvwx\n2k+lGVYDEiJlbhENye+bTUYVP8ob+GkAWjqQ8+0s8EbdDx/pU+Udxk4e2YHLrryr\nrZMgN8pkvuZ7ahmtt2Yth1FXxqVizJ273NYonDlRabc/wNITF9E9D//Df04Op9Ko\nCsYK0w/6vk114HDGoP7im0w=\n-----END PRIVATE KEY-----\n","client_email":"chatbot-service2026@chatbot-project2026.iam.gserviceaccount.com","client_id":"113078626159904511878","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/chatbot-service2026%40chatbot-project2026.iam.gserviceaccount.com","universe_domain":"googleapis.com"}
```

**⚠️ 重要**: 上記のJSONは**1行**になっています。これをそのままコピーして貼り付けてください。

3. 「**保存**」をクリック

---

### ステップ3: スプレッドシートIDを確認

1. 環境変数 `GOOGLE_SHEETS_SPREADSHEET_ID` を確認
2. 値が `1QrMLgr-Ws3y4eA3ad2JyjRicDRzP5oTyKl6u9mHRbDE` になっているか確認
3. 間違っている場合は修正

---

### ステップ4: コードを更新してGitHubにプッシュ

認証情報の読み込み処理を改善しました。変更をプッシュしてください。

1. Cursorのソース管理パネルを開く（`Ctrl + Shift + G`）
2. 「変更」の下に `lib/googleSheets.js` が表示されます
3. 「すべてステージ」をクリック
4. メッセージ欄に「認証情報の読み込み処理を改善」と入力
5. 「✓」をクリック
6. 「変更を同期」または「プッシュ」をクリック

---

### ステップ5: Renderで再デプロイ

1. Renderのダッシュボードで、サービスを開く
2. 右上の「**手動デプロイ**」→「**最新のコミットをデプロイ**」をクリック
3. デプロイが完了するまで待つ（5〜10分）

---

### ステップ6: ログで確認

デプロイ完了後、「ログ」タブで以下を確認：

✅ **成功のサイン**:
- `GOOGLE_SERVICE_ACCOUNT_JSON: (設定済み)`
- `📝 環境変数から認証情報を読み込みます...`
- `✅ 認証情報を読み込みました (project_id: chatbot-project2026)`
- `✅ Google Sheets API接続成功`
- `📚 読み込んだFAQ数: X件`（0件ではない）

---

## 💡 JSONを1行形式でコピーする方法

環境変数に設定する際は、JSONを1行形式にする方が安全です。

### 方法1: ローカルファイルから1行形式でコピー

1. `credentials/google-service-account.json.json` を開く
2. 全て選択（Ctrl+A）
3. コピー（Ctrl+C）
4. Renderの環境変数のValue欄に貼り付け（Ctrl+V）

**注意**: Renderの環境変数では、改行が含まれていても問題ありませんが、1行形式の方が確実です。

---

**作成日**: 2025年1月
**バージョン**: 1.0.0
