// 認証情報をBase64エンコードするスクリプト
const fs = require('fs');
const path = require('path');

try {
  // 認証情報ファイルを読み込む
  const credentialsPath = path.join(__dirname, 'credentials', 'google-service-account.json.json');
  const jsonContent = fs.readFileSync(credentialsPath, 'utf8');
  
  // Base64エンコード
  const base64 = Buffer.from(jsonContent).toString('base64');
  
  console.log('='.repeat(80));
  console.log('✅ Base64エンコード完了！');
  console.log('='.repeat(80));
  console.log('\n以下の文字列をコピーして、Renderの環境変数に設定してください：\n');
  console.log('環境変数名: GOOGLE_SERVICE_ACCOUNT_JSON_BASE64');
  console.log('値:');
  console.log(base64);
  console.log('\n' + '='.repeat(80));
  console.log('\n📋 Renderでの設定手順：');
  console.log('1. Renderのダッシュボードにアクセス');
  console.log('2. あなたのWebサービスを選択');
  console.log('3. 「Environment」タブをクリック');
  console.log('4. 「Add Environment Variable」をクリック');
  console.log('5. Key: GOOGLE_SERVICE_ACCOUNT_JSON_BASE64');
  console.log('6. Value: 上記のBase64文字列を貼り付け');
  console.log('7. 「Save Changes」をクリック');
  console.log('8. サービスを再デプロイ');
  console.log('\n' + '='.repeat(80));
  
} catch (error) {
  console.error('❌ エラー:', error.message);
  process.exit(1);
}
