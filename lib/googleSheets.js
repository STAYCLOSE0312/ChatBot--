// Google Sheets API連携モジュール
const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();

class GoogleSheetsService {
  constructor() {
    this.auth = null;
    this.sheets = null;
    this.spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    this.initPromise = null; // 初期化のPromiseを保持
    this.initialized = false; // 初期化完了フラグ
    
    // 環境変数の確認
    if (!this.spreadsheetId) {
      console.error('❌ 環境変数 GOOGLE_SHEETS_SPREADSHEET_ID が設定されていません');
      console.error('   .envファイルに以下を設定してください:');
      console.error('   GOOGLE_SHEETS_SPREADSHEET_ID=1QrMLgr-Ws3y4eA3ad2JyjRicDRzP5oTyKl6u9mHRbDE');
    }
    
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_PATH) {
      console.error('❌ 環境変数 GOOGLE_SERVICE_ACCOUNT_PATH が設定されていません');
      console.error('   .envファイルに以下を設定してください:');
      console.error('   GOOGLE_SERVICE_ACCOUNT_PATH=./credentials/google-service-account.json.json');
    }
    
    // 初期化を開始（Promiseを保持）
    this.initPromise = this.init();
  }

  async init() {
    try {
      if (!this.spreadsheetId) {
        throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID環境変数が設定されていません');
      }
      
      let authConfig;
      
      // 環境変数から認証情報を読み込む（Render用）
      if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        console.log('📝 環境変数から認証情報を読み込みます...');
        try {
          const keyData = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
          authConfig = {
            credentials: keyData,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
          };
        } catch (parseError) {
          throw new Error(`認証情報JSONの解析に失敗しました: ${parseError.message}`);
        }
      }
      // ファイルパスから読み込む（ローカル環境用）
      else if (process.env.GOOGLE_SERVICE_ACCOUNT_PATH) {
        console.log('📝 ファイルパスから認証情報を読み込みます...');
        const keyFilePath = path.resolve(process.env.GOOGLE_SERVICE_ACCOUNT_PATH);
        const fs = require('fs');
        
        if (!fs.existsSync(keyFilePath)) {
          throw new Error(`認証情報ファイルが見つかりません: ${keyFilePath}`);
        }
        
        authConfig = {
          keyFile: keyFilePath,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        };
      }
      else {
        throw new Error('認証情報が設定されていません。GOOGLE_SERVICE_ACCOUNT_JSON または GOOGLE_SERVICE_ACCOUNT_PATH を設定してください。');
      }
      
      const auth = new google.auth.GoogleAuth(authConfig);
      
      this.auth = await auth.getClient();
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      if (!this.sheets) {
        throw new Error('Google Sheets APIの初期化に失敗しました');
      }
      
      console.log('✅ Google Sheets API接続成功');
      console.log(`   スプレッドシートID: ${this.spreadsheetId}`);
      this.initialized = true; // 初期化完了
    } catch (error) {
      console.error('❌ Google Sheets API接続エラー:', error.message);
      console.error('   認証情報ファイルのパス:', path.resolve(process.env.GOOGLE_SERVICE_ACCOUNT_PATH || './credentials/google-service-account.json.json'));
      console.error('   スプレッドシートID:', this.spreadsheetId || '未設定');
      console.error('   .envファイルの設定を確認してください');
      this.sheets = null; // エラー時はnullに設定
      this.initialized = false;
      throw error; // エラーを再スロー
    }
  }
  
  // 初期化が完了するまで待つ
  async ensureInitialized() {
    if (this.initialized) {
      return; // 既に初期化済み
    }
    
    if (this.initPromise) {
      try {
        await this.initPromise; // 初期化が完了するまで待つ
      } catch (error) {
        // エラーは既にログに出力されているので、ここでは再スローしない
      }
    } else {
      // initPromiseが存在しない場合は初期化を開始
      this.initPromise = this.init();
      await this.initPromise;
    }
  }

  // FAQシートから全データを取得
  async getFAQs() {
    try {
      // 初期化が完了するまで待つ
      await this.ensureInitialized();
      
      // this.sheetsが初期化されているか確認
      if (!this.sheets) {
        throw new Error('Google Sheets APIが初期化されていません。.envファイルの設定を確認してください。');
      }
      
      if (!this.spreadsheetId) {
        throw new Error('スプレッドシートIDが設定されていません。.envファイルにGOOGLE_SHEETS_SPREADSHEET_IDを設定してください。');
      }
      
      console.log('🔍 スプレッドシートからFAQデータを読み込み開始...');
      console.log(`   スプレッドシートID: ${this.spreadsheetId}`);
      
      // まずシート名を確認（「FAQ」または「シート1」を試す）
      let range = 'FAQ!A2:H';
      let response;
      let usedRange = range;
      
      try {
        console.log(`   範囲を取得中: ${range}`);
        response = await this.sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: range,
        });
        console.log('   ✅ FAQシートからデータを取得しました');
      } catch (error) {
        console.log(`   ⚠️ FAQシートが見つかりません (${error.message})。「シート1」を試します...`);
        range = 'シート1!A2:H';
        usedRange = range;
        try {
          response = await this.sheets.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetId,
            range: range,
          });
          console.log('   ✅ シート1からデータを取得しました');
        } catch (error2) {
          console.error('   ❌ シート1も見つかりませんでした:', error2.message);
          throw error2;
        }
      }
      
      const rows = response.data.values || [];
      console.log(`📊 取得した行数: ${rows.length}件`);
      
      if (rows.length === 0) {
        console.warn('⚠️ データが0件です。スプレッドシートの範囲を確認してください。');
        console.log(`   使用した範囲: ${usedRange}`);
        // 範囲を広げて再試行
        try {
          const widerRange = usedRange.replace('A2:H', 'A:H');
          console.log(`   範囲を広げて再試行: ${widerRange}`);
          const retryResponse = await this.sheets.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetId,
            range: widerRange,
          });
          const retryRows = retryResponse.data.values || [];
          console.log(`   再試行結果: ${retryRows.length}件`);
          if (retryRows.length > 1) {
            // ヘッダー行を除く
            rows.push(...retryRows.slice(1));
            console.log(`   ヘッダーを除いた行数: ${rows.length}件`);
          }
        } catch (retryError) {
          console.error('   再試行も失敗:', retryError.message);
        }
      }
      
      const faqs = rows.map((row, index) => {
        const faq = {
          id: parseInt(row[0]) || index + 1,
          question: (row[1] || '').trim(),
          answer: (row[2] || '').trim(),
          keywords: row[3] ? row[3].split(',').map(k => k.trim()).filter(k => k) : [],
          createdAt: row[4] || '',
          updatedAt: row[5] || '',
          usageCount: parseInt(row[6]) || 0,
          category: row[7] || '',
        };
        return faq;
      }).filter(faq => faq.question.length > 0); // 質問が空の行を除外
      
      console.log(`📚 有効なFAQデータ: ${faqs.length}件`);
      
      // デバッグ: 最初の3件を表示
      if (faqs.length > 0) {
        console.log('📝 読み込んだFAQの例:');
        faqs.slice(0, 3).forEach(faq => {
          console.log(`  - ID: ${faq.id}, 質問: "${faq.question.substring(0, 50)}"`);
          console.log(`    キーワード: ${faq.keywords.join(', ') || '(なし)'}`);
        });
      } else {
        console.warn('⚠️ 有効なFAQデータが0件です。スプレッドシートの構造を確認してください。');
        console.log('   期待される構造:');
        console.log('   列A: NO (ID)');
        console.log('   列B: 質問');
        console.log('   列C: 回答');
        console.log('   列D: キーワード');
      }
      
      return faqs;
    } catch (error) {
      console.error('❌ FAQデータの読み込みエラー:', error.message);
      console.error('   エラー詳細:', error);
      if (error.response) {
        console.error('   レスポンス:', error.response.data);
      }
      return [];
    }
  }

  // FAQを追加
  async addFAQ(faq) {
    try {
      // 既存のFAQを取得して新しいIDを決定
      const existingFAQs = await this.getFAQs();
      const newId = existingFAQs.length > 0 
        ? Math.max(...existingFAQs.map(f => f.id)) + 1 
        : 1;

      const values = [[
        newId,
        faq.question,
        faq.answer,
        Array.isArray(faq.keywords) ? faq.keywords.join(',') : (faq.keywords || ''),
        new Date().toISOString(),
        new Date().toISOString(),
        faq.usageCount || 0,
        faq.category || '',
      ]];
      
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'FAQ!A2',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: { values },
      });

      return {
        id: newId,
        ...faq,
        createdAt: values[0][4],
        updatedAt: values[0][5],
        usageCount: values[0][6],
        category: values[0][7],
      };
    } catch (error) {
      console.error('❌ FAQ追加エラー:', error.message);
      throw error;
    }
  }

  // FAQを更新
  async updateFAQ(id, updateData) {
    try {
      const faqs = await this.getFAQs();
      const faqIndex = faqs.findIndex(f => f.id === id);
      
      if (faqIndex === -1) {
        throw new Error('FAQが見つかりません');
      }

      // 行番号を計算（ヘッダー行 + インデックス + 1）
      const rowNumber = faqIndex + 2;

      // 更新する列を決定
      const updates = [];
      if (updateData.question !== undefined) {
        updates.push({ range: `FAQ!B${rowNumber}`, values: [[updateData.question]] });
      }
      if (updateData.answer !== undefined) {
        updates.push({ range: `FAQ!C${rowNumber}`, values: [[updateData.answer]] });
      }
      if (updateData.keywords !== undefined) {
        const keywordsStr = Array.isArray(updateData.keywords) 
          ? updateData.keywords.join(',') 
          : updateData.keywords;
        updates.push({ range: `FAQ!D${rowNumber}`, values: [[keywordsStr]] });
      }
      if (updateData.category !== undefined) {
        updates.push({ range: `FAQ!H${rowNumber}`, values: [[updateData.category]] });
      }
      
      // updated_atを更新
      updates.push({ range: `FAQ!F${rowNumber}`, values: [[new Date().toISOString()]] });

      // バッチ更新
      await this.sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          valueInputOption: 'USER_ENTERED',
          data: updates,
        },
      });

      return { success: true };
    } catch (error) {
      console.error('❌ FAQ更新エラー:', error.message);
      throw error;
    }
  }

  // FAQを削除
  async deleteFAQ(id) {
    try {
      const faqs = await this.getFAQs();
      const faqIndex = faqs.findIndex(f => f.id === id);
      
      if (faqIndex === -1) {
        throw new Error('FAQが見つかりません');
      }

      // 行番号を計算（ヘッダー行 + インデックス + 1）
      const rowNumber = faqIndex + 2;

      // 行を削除
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 0, // FAQシートのID（最初のシート）
                dimension: 'ROWS',
                startIndex: rowNumber - 1,
                endIndex: rowNumber,
              },
            },
          }],
        },
      });

      return { success: true };
    } catch (error) {
      console.error('❌ FAQ削除エラー:', error.message);
      throw error;
    }
  }

  // FAQの使用回数をインクリメント
  async incrementFAQUsage(id) {
    try {
      const faqs = await this.getFAQs();
      const faq = faqs.find(f => f.id === id);
      
      if (!faq) {
        return;
      }

      const rowNumber = faqs.indexOf(faq) + 2;
      const newUsageCount = (faq.usageCount || 0) + 1;
      
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `FAQ!G${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [[newUsageCount]] },
      });
    } catch (error) {
      console.error('⚠️ 使用回数更新エラー:', error.message);
    }
  }

  // 履歴を追加
  async addHistory(history) {
    try {
      const values = [[
        new Date().toISOString(),
        history.question,
        history.answer,
        history.faqId || '',
        history.userId || 'anonymous',
        history.sessionId || '',
        history.satisfaction || '',
        history.note || '',
      ]];
      
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'History!A2',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: { values },
      });
    } catch (error) {
      console.error('⚠️ 履歴保存エラー:', error.message);
    }
  }

  // 人気FAQのID一覧を取得（使用回数の多い順）
  async getPopularIds(limit = 4) {
    try {
      const faqs = await this.getFAQs();
      return faqs
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, limit)
        .map(f => f.id);
    } catch (error) {
      console.error('❌ 人気FAQ取得エラー:', error.message);
      return [];
    }
  }
}

module.exports = new GoogleSheetsService();
