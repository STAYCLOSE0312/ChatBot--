const fs = require('fs');
const path = require('path');

const envContent = `# Google Sheets API設定
GOOGLE_SHEETS_SPREADSHEET_ID=1QrMLgr-Ws3y4eA3ad2JyjRicDRzP5oTyKl6u9mHRbDE
GOOGLE_SERVICE_ACCOUNT_PATH=./credentials/google-service-account.json.json

# サーバー設定
PORT=3000
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ .envファイルを作成しました！');
  console.log('\n内容:');
  console.log(envContent);
} catch (error) {
  console.error('❌ .envファイルの作成に失敗しました:', error.message);
  process.exit(1);
}
