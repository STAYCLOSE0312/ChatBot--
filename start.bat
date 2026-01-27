@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║       FAQチャットボット - 起動スクリプト                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 【確認】Node.jsがインストールされているか確認中...
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.jsがインストールされていません！
    echo.
    echo 以下のURLからNode.jsをダウンロードしてインストールしてください：
    echo https://nodejs.org/ja
    echo.
    echo インストール後、もう一度このファイルをダブルクリックしてください。
    echo.
    pause
    exit /b 1
)

node --version
echo.
echo ✅ Node.jsが見つかりました！
echo.

echo 【確認】node_modulesフォルダがあるか確認中...
echo.

if not exist "node_modules" (
    echo ⚠ 必要なファイルがインストールされていません。
    echo.
    echo 今から自動でインストールします...
    echo （2〜3分かかる場合があります）
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo ❌ インストールに失敗しました。
        echo.
        echo 【対処方法】
        echo 1. このプロジェクトがGoogleドライブ上にある場合は、
        echo    ローカルディスク（C:\）にコピーしてください
        echo.
        echo 2. 以下のコマンドを手動で実行してください：
        echo    npm install
        echo.
        pause
        exit /b 1
    )
    echo.
    echo ✅ インストール完了！
    echo.
) else (
    echo ✅ 必要なファイルは既にインストール済みです
    echo.
)

echo 【起動】サーバーを起動しています...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✅ 起動したら、以下のURLをブラウザで開いてください：
echo.
echo    チャットボット:
echo    http://localhost:3000/chatbot.html
echo.
echo    FAQ管理画面:
echo    http://localhost:3000/admin.html
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo ⚠ このウィンドウは閉じないでください！
echo   （閉じるとチャットボットが停止します）
echo.
echo サーバーを停止する場合は Ctrl + C を押してください
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

npm start

if %errorlevel% neq 0 (
    echo.
    echo ❌ サーバーの起動に失敗しました。
    echo.
    echo よくある原因：
    echo - ポート3000が既に使用されている
    echo   → 他のプログラムを終了するか、server.jsのポート番号を変更
    echo.
    echo - 必要なファイルがない
    echo   → npm install を実行してください
    echo.
    pause
    exit /b 1
)

