# Render環境変数設定 - 最速解決方法 🚀

## ✅ 現在の状況

コードは既にBase64エンコード対応済みです。Gitを使わずに、**直接Renderで環境変数を設定**するだけで解決できます。

---

## 📋 手順（5分で完了）

### ステップ1: 認証情報をBase64エンコード

以下のいずれかの方法でBase64エンコードを取得してください：

#### 方法A: オンラインツールを使う（最も簡単）

1. ブラウザで以下のサイトを開く：
   - https://www.base64encode.org/
   - または https://base64.guru/converter/encode/json

2. `credentials/google-service-account.json.json` ファイルを開く

3. **ファイル全体の内容をコピー**（`{` から `}` まで全て）

4. オンラインツールに貼り付けて「Encode」をクリック

5. 生成されたBase64文字列をコピー

#### 方法B: PowerShellでエンコード（上級者向け）

PowerShellを開いて以下を実行：

```powershell
$json = Get-Content "credentials\google-service-account.json.json" -Raw -Encoding UTF8
$bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
$base64 = [System.Convert]::ToBase64String($bytes)
$base64
```

---

### ステップ2: Renderで環境変数を設定

1. **Renderダッシュボードにアクセス**
   - https://dashboard.render.com/

2. **あなたのWebサービスをクリック**

3. **左メニューから「Environment」を選択**

4. **既存の環境変数を確認**
   - `GOOGLE_SERVICE_ACCOUNT_JSON` があれば**削除**する
   - `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` があれば**削除**する

5. **新しい環境変数を追加**
   - 「Add Environment Variable」をクリック
   - **Key**: `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`
   - **Value**: ステップ1で取得したBase64文字列を貼り付け
   - 「Save Changes」をクリック

6. **他の環境変数を確認**
   以下の環境変数が設定されていることを確認：
   - `GOOGLE_SHEETS_SPREADSHEET_ID` = `1QrMLgr-Ws3y4eA3ad2JyjRicDRzP5oTyKl6u9mHRbDE`
   - `PORT` = `3000`（または任意のポート番号）

---

### ステップ3: 再デプロイ

1. **Renderダッシュボードで「Manual Deploy」をクリック**
   - または「Events」タブから「Deploy latest commit」をクリック

2. **デプロイが完了するまで待つ**（2-3分）

3. **ログを確認**
   - 「Logs」タブを開く
   - 以下のメッセージが表示されれば成功：
     ```
     ✅ 認証情報を読み込みました (project_id: chatbot-project2026)
     ✅ Google Sheets API接続成功
     ✅ FAQデータを読み込みました
     ```

---

## 🔍 エラーが出た場合

### エラー1: `JSONの解析エラー`

**原因**: Base64文字列が正しくない

**解決方法**:
1. ステップ1を再度実行して、正しいBase64文字列を取得
2. Renderで環境変数を削除して再追加
3. 値の前後に余分なスペースや改行がないか確認

### エラー2: `認証情報JSONに必須フィールドが不足`

**原因**: JSONファイルが不完全

**解決方法**:
1. `credentials/google-service-account.json.json` ファイルを開く
2. ファイルが完全なJSON形式になっているか確認（`{` で始まり `}` で終わる）
3. 再度Base64エンコードして設定

### エラー3: `invalid_grant: Invalid JWT Signature`

**原因**: 認証情報の形式が正しくない

**解決方法**:
1. 環境変数 `GOOGLE_SERVICE_ACCOUNT_JSON` が残っていないか確認（削除）
2. `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` のみを使用
3. Base64文字列を再生成して設定

---

## ✅ 動作確認

デプロイが完了したら：

1. **チャットボットにアクセス**
   - RenderのURL（例: `https://your-app.onrender.com/chatbot.html`）

2. **質問を送信**
   - 例: 「こんにちは」
   - 回答が返ってくれば成功！

3. **ログで確認**
   - Renderの「Logs」タブで以下を確認：
     - `✅ 認証情報を読み込みました`
     - `✅ Google Sheets API接続成功`
     - `✅ FAQデータを読み込みました`

---

## 📝 まとめ

- ✅ Git操作は不要
- ✅ コード変更は不要（既に対応済み）
- ✅ Renderで環境変数を設定するだけ
- ✅ Base64エンコードを使うことで文字化けを回避

これで完了です！🎉
