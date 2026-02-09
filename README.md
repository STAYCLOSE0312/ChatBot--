# FAQチャットボット

GoogleスプレッドシートのFAQを参照し、キーワード検索で回答するチャットボットです。  
**Netlify** で公開し、**Google Apps Script** でスプシをAPI化する構成です（AI・Render 不要）。

---

## こちらで用意するもの

| 用意するもの | 内容 |
|-------------|------|
| **Googleスプレッドシート** | シート名 **「FAQ」**。列は **A=ID, B=質問, C=回答, D=キーワード**（カンマ区切り）。E〜Hは作成日時・更新日時・使用回数・カテゴリ（任意）。 |
| **Google Apps Script** | 上記スプシに「拡張機能」→「Apps Script」で `AppsScript/Code.gs` を貼り付け、**ウェブアプリ**としてデプロイ（実行ユーザー: 自分、アクセス: 全員）。デプロイ後に表示される **URL** を控える。 |
| **Netlify の環境変数** | Netlify のサイト設定で **`APPS_SCRIPT_URL`** に、上記のウェブアプリのURLを設定する。 |

FAQの追加・変更は **スプレッドシートを直接編集** すれば反映されます。チャットでの問い合わせ内容は、同じスプシの **「対応履歴」シート** に自動で記録されます（シートがなければ自動作成）。

---

## セットアップの流れ

1. スプレッドシートで「FAQ」シートを用意し、列（ID・質問・回答・キーワード）を揃える。
2. 同じスプシで「拡張機能」→「Apps Script」を開き、`AppsScript/Code.gs` の内容を貼り付けて **ウェブアプリ** でデプロイ。URLをコピー。
3. Netlify でこのリポジトリを接続し、公開ディレクトリを **`public`** に。環境変数 **`APPS_SCRIPT_URL`** に手順2のURLを設定。
4. デプロイ後、サイトのチャット画面で「よくある質問」が表示され、質問送信で回答が返れば完了。

詳しい手順は **`Netlifyとスプシ_セットアップ手順.md`** を参照してください。

---

## プロジェクト構成

```
├── AppsScript/
│   └── Code.gs              # スプシ読み取り・検索API（これをGASに貼る）
├── netlify/
│   └── functions/           # Netlify Functions（Apps Scriptへのプロキシ）
│       ├── popular.js
│       └── chat.js
├── public/
│   ├── chatbot.html / .js / .css
│   ├── admin.html / .js / .css   # 管理画面（ローカルNode用・任意）
│   └── images/
├── lib/
│   └── googleSheets.js     # ローカル server.js 用
├── server.js               # ローカルで Node サーバーを動かす場合のみ使用
├── netlify.toml
└── README.md
```

---

## ローカルで試す

- **Netlify で公開する場合**: リポジトリを Netlify に接続し、上記の環境変数を設定すればそのまま利用できます。
- **Node でローカル実行**: `npm install` → `npm start` で `http://localhost:3000` を起動。このときは `.env` にスプシIDとサービスアカウント情報が必要です（従来構成）。

---

## ライセンス

MIT
