@echo off
echo .envファイルを作成しています...
echo.

(
echo # Google Sheets API設定
echo GOOGLE_SHEETS_SPREADSHEET_ID=1QrMLgr-Ws3y4eA3ad2JyjRicDRzP5oTyKl6u9mHRbDE
echo GOOGLE_SERVICE_ACCOUNT_PATH=./credentials/google-service-account.json.json
echo.
echo # サーバー設定
echo PORT=3000
) > .env

echo .envファイルを作成しました！
echo.
echo 内容を確認:
type .env
echo.
pause
