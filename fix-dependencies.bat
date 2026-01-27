@echo off
echo 依存関係を修復しています...
echo.

echo [1/3] node_modulesフォルダを削除中...
if exist node_modules (
    rmdir /s /q node_modules
    echo node_modulesフォルダを削除しました。
) else (
    echo node_modulesフォルダは存在しません。
)

echo.
echo [2/3] package-lock.jsonを削除中...
if exist package-lock.json (
    del /q package-lock.json
    echo package-lock.jsonを削除しました。
) else (
    echo package-lock.jsonは存在しません。
)

echo.
echo [3/3] 依存関係を再インストール中...
call npm install

echo.
echo 修復が完了しました！
pause
