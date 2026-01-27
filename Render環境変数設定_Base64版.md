# 🔧 Render環境変数設定 - Base64エンコード版（推奨）

## ⚠️ 現在の問題

JSONの解析エラーが発生しています：
- `Bad control character in string literal in JSON at position 163`

これは、環境変数にJSONを直接設定する際に、改行文字や特殊文字が正しく処理されていないためです。

---

## ✅ 解決方法: Base64エンコードを使用

Base64エンコードを使用することで、改行文字や特殊文字の問題を回避できます。

---

## 📋 ステップ1: 認証情報JSONをBase64エンコード

### 方法1: オンラインツールを使用

1. 以下のサイトにアクセス：
   - https://www.base64encode.org/
   - または https://base64.guru/converter/encode/json

2. ローカルの `credentials/google-service-account.json.json` の内容をコピー
3. Base64エンコードツールに貼り付け
4. エンコードされた文字列をコピー

### 方法2: Node.jsでエンコード（推奨）

Cursorのターミナルで以下を実行：

```bash
node -e "const fs = require('fs'); const data = fs.readFileSync('credentials/google-service-account.json.json', 'utf8'); console.log(Buffer.from(data, 'utf8').toString('base64'));"
```

これで、Base64エンコードされた文字列が表示されます。これをコピーしてください。

---

## 📋 ステップ2: Renderで環境変数を設定

1. Renderのダッシュボードで、サービス（`ChatBot--`）を開く
2. 左側のメニューから「**環境**」（Environment）タブをクリック
3. `GOOGLE_SERVICE_ACCOUNT_JSON` を削除（存在する場合）
4. 「**環境変数を追加**」をクリック

#### Base64エンコードされた認証情報を追加

- **Key**: `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`
- **Value**: ステップ1で取得したBase64エンコードされた文字列を貼り付け
- 「**保存**」をクリック

---

## 📋 ステップ3: コードを更新してGitHubにプッシュ

Base64デコードに対応するようにコードを修正しました。変更をプッシュしてください。

1. Cursorのソース管理パネルを開く（`Ctrl + Shift + G`）
2. 「変更」の下に `lib/googleSheets.js` が表示されます
3. 「すべてステージ」をクリック
4. メッセージ欄に「Base64エンコード対応を追加」と入力
5. 「✓」をクリック
6. 「変更を同期」または「プッシュ」をクリック

---

## 📋 ステップ4: Renderで再デプロイ

1. Renderのダッシュボードで、サービスを開く
2. 右上の「**手動デプロイ**」→「**最新のコミットをデプロイ**」をクリック
3. デプロイが完了するまで待つ（5〜10分）

---

## ✅ 確認

デプロイ完了後、「ログ」タブで以下を確認：

✅ **成功のサイン**:
- `📝 環境変数から認証情報を読み込みます...`
- `Base64エンコードされた認証情報をデコードします...`
- `✅ 認証情報を読み込みました (project_id: chatbot-project2026)`
- `✅ Google Sheets API接続成功`
- `📚 読み込んだFAQ数: X件`（0件ではない）

---

## 💡 補足情報

### Base64エンコードの利点

- 改行文字や特殊文字の問題を回避
- 環境変数に安全に設定可能
- 文字エンコーディングの問題を回避

### 両方の方法に対応

コードは以下の両方に対応しています：
- `GOOGLE_SERVICE_ACCOUNT_JSON` - 通常のJSON（改行文字の問題がある場合がある）
- `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` - Base64エンコードされたJSON（推奨）

---

**作成日**: 2025年1月
**バージョン**: 1.0.0
