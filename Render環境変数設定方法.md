# 🔧 Render環境変数設定方法（認証情報ファイル対応版）

## ⚠️ 問題

Renderの無料プランでは、ファイルシステムへの書き込みが一時的で、再起動時に消える可能性があります。
そのため、認証情報ファイルをアップロードしても、再起動時に消えてしまう可能性があります。

## ✅ 解決方法

環境変数として認証情報を設定する方法が最も安全で確実です。

---

## 📋 ステップ1: 認証情報JSONをコピー

1. ローカルの `credentials/google-service-account.json.json` ファイルを開く
2. **ファイルの内容を全てコピー**（Ctrl+A → Ctrl+C）

---

## 📋 ステップ2: Renderで環境変数を設定

1. Renderのダッシュボードで、作成したサービス（`ChatBot--`）を開く
2. 左側のメニューから「**環境**」（Environment）タブをクリック
3. 「**環境変数を追加**」（Add Environment Variable）をクリック

### 環境変数を追加

以下の環境変数を**4つ**追加します：

#### 1つ目: 認証情報JSON（重要！）

- **Key**: `GOOGLE_SERVICE_ACCOUNT_JSON`
- **Value**: （コピーした認証情報JSONの内容を**そのまま**貼り付け）
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
- 「**保存**」（Save）をクリック

**⚠️ 重要**: JSONの内容を**そのまま**貼り付けてください。改行やスペースはそのままでOKです。

#### 2つ目: スプレッドシートID

- **Key**: `GOOGLE_SHEETS_SPREADSHEET_ID`
- **Value**: `1QrMLgr-Ws3y4eA3ad2JyjRicDRzP5oTyKl6u9mHRbDE`
- 「保存」をクリック

#### 3つ目: ポート（オプション）

- **Key**: `PORT`
- **Value**: `3000`
- 「保存」をクリック

**注意**: `GOOGLE_SERVICE_ACCOUNT_PATH` は削除してもOKです（環境変数から読み込むため）

---

## 📋 ステップ3: コードを更新してGitHubにプッシュ

環境変数から認証情報を読み込むようにコードを修正しました。
変更をGitHubにプッシュする必要があります。

### Cursorでプッシュ

1. **ソース管理パネル**を開く（`Ctrl + Shift + G`）
2. 「変更」の下に `lib/googleSheets.js` が表示されます
3. 「すべてステージ」をクリック
4. メッセージ欄に「認証情報を環境変数から読み込むように修正」と入力
5. 「✓」をクリック
6. 「変更を同期」または「プッシュ」をクリック

---

## 📋 ステップ4: Renderで再デプロイ

1. Renderのダッシュボードで、サービスを開く
2. 右上の「**手動デプロイ**」（Manual Deploy）→「**最新のコミットをデプロイ**」（Deploy latest commit）をクリック
3. デプロイが完了するまで待つ（5〜10分）

---

## ✅ 確認

デプロイが完了したら：

1. 「**ログ**」（Logs）タブを開く
2. 以下のメッセージが表示されれば成功：
   - `📝 環境変数から認証情報を読み込みます...`
   - `✅ Google Sheets API接続成功`
   - `📚 読み込んだFAQ数: X件`

3. チャットボットにアクセスして動作確認：
   - `https://chatbot-phg2.onrender.com/chatbot.html`

---

## 🔍 トラブルシューティング

### エラー: 「認証情報JSONの解析に失敗しました」

**原因**: JSONの形式が正しくない

**解決方法**:
1. 認証情報ファイルの内容を再度コピー
2. 環境変数の値を確認
3. JSONの開始と終了の `{` と `}` が正しいか確認

### エラー: 「Google Sheets API接続エラー」

**原因**: 環境変数が正しく設定されていない

**解決方法**:
1. Renderの「環境」タブで環境変数を確認
2. `GOOGLE_SERVICE_ACCOUNT_JSON` が正しく設定されているか確認
3. `GOOGLE_SHEETS_SPREADSHEET_ID` が正しく設定されているか確認

---

**作成日**: 2025年1月
**バージョン**: 1.0.0
