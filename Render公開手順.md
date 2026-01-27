# Renderでチャットボットを公開する手順 🚀

## 📋 事前準備

### 1. GitHubアカウントの作成（まだの場合）
- https://github.com にアクセス
- アカウントを作成

### 2. Renderアカウントの作成
- https://render.com にアクセス
- 「Get Started for Free」をクリック
- GitHubアカウントでサインアップ（推奨）

---

## 🔧 ステップ1: GitHubにコードをアップロード

### 1-1. GitHubでリポジトリを作成

1. GitHubにログイン
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名を入力（例: `faq-chatbot`）
4. 「Public」を選択（無料プランでは必須）
5. 「Create repository」をクリック

### 1-2. ローカルでGitを初期化

**VS Codeのターミナルで実行：**

```bash
# Gitを初期化
git init

# ファイルを追加（.envとcredentialsフォルダは自動的に除外されます）
git add .

# 初回コミット
git commit -m "Initial commit"

# GitHubのリポジトリを追加（YOUR_USERNAMEとYOUR_REPO_NAMEを置き換えてください）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# コードをアップロード
git branch -M main
git push -u origin main
```

**⚠️ 重要**: `.env`ファイルと`credentials`フォルダは`.gitignore`で除外されているため、GitHubにアップロードされません。これは正しい動作です。

---

## 🌐 ステップ2: RenderでWebサービスを作成

### 2-1. 新しいWebサービスを作成

1. Renderのダッシュボードにログイン
2. 「New +」→「Web Service」をクリック
3. 「Connect GitHub」をクリック（まだ接続していない場合）
4. 作成したリポジトリを選択
5. 「Connect」をクリック

### 2-2. サービス設定

以下の設定を入力：

- **Name**: `faq-chatbot`（任意の名前）
- **Region**: `Singapore`（日本に近い）
- **Branch**: `main`
- **Root Directory**: （空白のまま）
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2-3. 環境変数の設定

「Environment Variables」セクションで以下を追加：

| Key | Value |
|-----|-------|
| `GOOGLE_SHEETS_SPREADSHEET_ID` | `1QrMLgr-Ws3y4eA3ad2JyjRicDRzP5oTyKl6u9mHRbDE` |
| `GOOGLE_SERVICE_ACCOUNT_PATH` | `./credentials/google-service-account.json.json` |
| `PORT` | `3000`（自動設定されるので省略可） |

### 2-4. 認証情報ファイルのアップロード

**重要**: `credentials`フォルダはGitHubにアップロードされないため、Renderに直接アップロードする必要があります。

#### 方法A: Renderのシェルでアップロード（推奨）

1. Renderのダッシュボードでサービスを開く
2. 「Shell」タブをクリック
3. 以下のコマンドを実行：

```bash
# credentialsフォルダを作成
mkdir -p credentials

# 認証情報ファイルを作成（以下のコマンドを実行）
cat > credentials/google-service-account.json.json << 'EOF'
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
EOF
```

**⚠️ 注意**: 上記のJSONは実際の認証情報ファイルの内容に置き換えてください。ローカルの`credentials/google-service-account.json.json`ファイルの内容をコピーして使用してください。

#### 方法B: 環境変数として設定（より安全）

1. Renderのダッシュボードでサービスを開く
2. 「Environment」タブをクリック
3. 「Add Environment Variable」をクリック
4. 以下の環境変数を追加：

| Key | Value |
|-----|-------|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | （認証情報JSONファイルの内容全体を貼り付け） |

5. `lib/googleSheets.js`を修正して、環境変数から読み込むように変更（後述）

### 2-5. デプロイ開始

1. 「Create Web Service」をクリック
2. デプロイが開始されます（約5-10分かかります）

---

## ✅ ステップ3: デプロイ完了後の確認

### 3-1. デプロイの確認

1. Renderのダッシュボードで「Logs」タブを確認
2. 「✅ Build successful」と表示されれば成功
3. 「Live」リンクをクリックしてアクセス

### 3-2. 動作確認

- チャットボット: `https://your-app-name.onrender.com/chatbot.html`
- 管理画面: `https://your-app-name.onrender.com/admin.html`

---

## 🔧 トラブルシューティング

### エラー: 「Cannot find module」

- `package.json`に必要なパッケージが全て含まれているか確認
- 「Logs」タブでエラー詳細を確認

### エラー: 「Google Sheets API接続エラー」

- 環境変数が正しく設定されているか確認
- 認証情報ファイルが正しくアップロードされているか確認
- Google Sheets APIが有効化されているか確認

### スリープについて

Renderの無料プランでは、15分間アクセスがないと自動的にスリープします。
- スリープ後、最初のアクセス時に約30秒かかります
- これは無料プランの制限です

---

## 💡 より安全な方法: 環境変数で認証情報を管理

認証情報ファイルを直接アップロードする代わりに、環境変数として設定する方法：

### `lib/googleSheets.js`を修正

```javascript
async init() {
  try {
    let keyFile;
    
    // 環境変数から認証情報を読み込む（優先）
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      const keyData = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      keyFile = keyData;
    } else {
      // ファイルから読み込む（ローカル環境用）
      const keyFilePath = path.resolve(process.env.GOOGLE_SERVICE_ACCOUNT_PATH);
      keyFile = keyFilePath;
    }
    
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFile,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    // ... 以下同じ
  }
}
```

この方法なら、認証情報ファイルをGitHubにアップロードする必要がありません。

---

## 📝 まとめ

1. ✅ GitHubにコードをアップロード
2. ✅ RenderでWebサービスを作成
3. ✅ 環境変数を設定
4. ✅ 認証情報ファイルをアップロード
5. ✅ デプロイ完了！

**公開URL**: `https://your-app-name.onrender.com`

無料プランでも十分に動作します！🎉
