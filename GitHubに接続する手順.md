# GitHub に接続する手順（高校生でもわかる版）

このプロジェクトを GitHub にアップして、Netlify と連携できるようにする手順です。  
**「何をしているか」** を短く説明しながら進めます。

---

## 事前に用意するもの

1. **Git がパソコンに入っているか**
   - Cursor や VS Code には Git が含まれていることが多いです。
   - 確認: Cursor で **ターミナル**（下の「ターミナル」タブ）を開き、次のコマンドを打って Enter。
     ```bash
     git --version
     ```
   - `git version 2.xx.x` のように出れば OK。  
     「コマンドが見つかりません」と出たら、[Git for Windows](https://git-scm.com/download/win) をインストールしてください。

2. **GitHub のアカウント**
   - [github.com](https://github.com) で無料アカウントを作成しておく。

---

## 全体の流れ（イメージ）

```
いまのフォルダ（ChatBot制作）
    ↓ ① このフォルダを「Gitで管理する」と宣言（git init）
    ↓ ② 変更を「1つのまとまり」として記録（git add → git commit）
    ↓ ③ GitHub に「倉庫」を1つ作る（ブラウザで操作）
    ↓ ④ 「このフォルダの内容を、その倉庫に送る」と設定（git remote）
    ↓ ⑤ 実際に送る（git push）
```

「倉庫」＝ GitHub の **リポジトリ**（プロジェクトの入れ物）だと思って大丈夫です。

---

## ステップ1: このフォルダを Git の管理下にする

1. Cursor で **このプロジェクトのフォルダ**（ChatBot制作）を開いた状態にします。
2. メニュー **表示** → **ターミナル** でターミナルを開く（または `` Ctrl+` ``）。
3. 次のコマンドを **1行ずつ** 打って Enter します。

```bash
git init
```

- **意味**: 「このフォルダを、Git で管理します」と宣言するコマンドです。
- **結果**: `Initialized empty Git repository in ...` と出れば成功。フォルダの中に `.git` という隠しフォルダができます（普段は見えません）。

---

## ステップ2: 初回の「記録」を作る（コミット）

「どのファイルを GitHub に送るか」を選んで、1回分の記録（コミット）を作ります。

### 2-1. 送らないファイルは除外されているか確認

このプロジェクトには **`.gitignore`** というファイルがあります。  
ここに書かれた名前のファイル・フォルダは **Git に含めず、GitHub に送りません**。

- 例: `.env`（環境変数）や `credentials/`（認証情報）は **絶対に送ってはいけない** ので、`.gitignore` に書いてあります。  
  → そのまま触らなくて大丈夫です。

### 2-2. 全部のファイルを「記録対象」に含める

ターミナルで、次のコマンドを打ちます。

```bash
git add .
```

- **意味**: 「今ある変更を、次の記録に含める」という意味です。  
  `.` は「このフォルダの中全部」です。

### 2-3. 1本の記録として保存する（コミット）

```bash
git commit -m "初回コミット：チャットボットのコード"
```

- **意味**: さっき `git add` した内容を、「初回の記録」として保存します。  
  `-m "..."` の部分は「この記録の説明」なので、好きな言葉に変えてOKです。
- **結果**: `1 file changed` や `XX files changed` のように出れば成功です。

---

## ステップ3: GitHub に「倉庫」を作る

ここは **ブラウザ** で GitHub にログインして操作します。

1. [https://github.com](https://github.com) を開き、ログインする。
2. 画面右上の **「+」** をクリック → **「New repository」** を選ぶ。
3. 次のように入力する：
   - **Repository name**: 例）`chatbot-project`（半角英数字とハイフンだけ。好きな名前でOK）
   - **Description**: 空欄でOK。例）「FAQチャットボット」
   - **Public** を選ぶ（無料のまま使うなら Public で問題ありません）。
   - **「Add a README file」** などには **チェックを入れない**（こっちで既に README があるため）。
4. **「Create repository」** をクリックする。
5. 次の画面で **「…or push an existing repository from the command line」** というところを探す。  
   そこに、次の2行のようなコマンドが表示されています（あなたのリポジトリ名に合わせて表示されます）:
   ```bash
   git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
   git branch -M main
   git push -u origin main
   ```
   **この画面は開いたまま** にしておく（次のステップで使います）。

---

## ステップ4: 「このフォルダの先送り先は GitHub だ」と設定する

Cursor の **ターミナル** に戻ります。

GitHub の画面に表示されていた  
`git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git`  
を **そのままコピー** して、ターミナルに貼り付けて Enter します。

- **意味**: 「このプロジェクトの“送り先”は、この GitHub のリポジトリです」と登録するコマンドです。  
  `origin` は「送り先のあだ名」だと思って大丈夫です。

次に、ブランチ名を `main` にそろえます（多くの場合、GitHub は `main` を使います）。

```bash
git branch -M main
```

---

## ステップ5: GitHub に実際に送る（プッシュ）

ターミナルで次を打ちます。

```bash
git push -u origin main
```

- **意味**: 今のコミット（記録）を、`origin`（GitHub）の `main` というブランチに送ります。  
  `-u` は「次からは `git push` だけでもこの先に送る」という設定です。

### 初回だけ「ログイン」を求められる場合

- **GitHub のユーザー名** と **パスワード** を聞かれた場合、  
  パスワードの代わりに **Personal Access Token（トークン）** を使う必要があります（GitHub がパスワードでのログインを廃止しているため）。
- トークンの作り方（かんたん）:
  1. GitHub の **Settings** → 左の **Developer settings** → **Personal access tokens** → **Tokens (classic)**。
  2. **Generate new token (classic)** をクリック。
  3. **Note**: 例）`netlify-push`。**Expiration**: 90 days など。
  4. **repo** にチェックを入れる。
  5. **Generate token** で作成し、表示されたトークンを **1回だけ** コピーして保存。
  6. ターミナルでパスワードを聞かれたら、そのトークンを貼り付ける（画面には何も表示されませんが、入力されています）。

成功すると、  
`Enumerating objects: ... Writing objects: 100% ...`  
のあと、**GitHub のリポジトリのページを更新すると、ファイル一覧が表示されます。**

---

## このあと（Netlify につなぐとき）

1. [Netlify](https://app.netlify.com/) にログイン。
2. **Add new site** → **Import an existing project**。
3. **GitHub** を選ぶ → 表示された中から **今プッシュしたリポジトリ**（例: `chatbot-project`）を選ぶ。
4. **Branch to deploy**: `main` のまま。
5. **Build settings**:  
   - Build command: 空欄でOK  
   - Publish directory: **`public`** と入力  
6. **Environment variables** で **`APPS_SCRIPT_URL`** を追加（Apps Script のウェブアプリのURL）。
7. **Deploy** でデプロイ完了です。

---

## まとめ（コマンド一覧）

初回だけ、だいたい次の順番で打ちます。

```bash
git init
git add .
git commit -m "初回コミット：チャットボットのコード"
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
git branch -M main
git push -u origin main
```

2回目以降、コードを直したあと GitHub に反映したいときは:

```bash
git add .
git commit -m "〇〇を変更した"
git push
```

これで「Cursor で編集 → GitHub に送る」ができるようになります。
