/**
 * FAQチャットボット用 Google Apps Script
 * スプレッドシートの「FAQ」シートを読み、キーワード・質問文で検索するWeb API
 * デプロイ: デプロイ → ウェブアプリ → 実行ユーザー「自分」、アクセス「全員」
 */

var SHEET_NAME = 'FAQ';
var HISTORY_SHEET_NAME = '対応履歴';
var HEADER_ROW = 1;
/** このスコア未満の「一番マッチ」は採用せず「見つかりません」と返す（誤マッチ防止） */
var MIN_SCORE = 50;

/**
 * GET: 人気FAQ取得（よくある質問ボタン用）
 * ?action=popular → 先頭4件（使用回数でソート）
 * ?action=faqs   → 全件（任意）
 */
function doGet(e) {
  var result;
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'popular';
  
  try {
    var faqs = getFAQs();
    if (action === 'faqs') {
      result = { faqs: faqs };
    } else {
      // popular: 使用回数降順で先頭4件
      var sorted = faqs.slice().sort(function(a, b) { return (b.usageCount || 0) - (a.usageCount || 0); });
      result = sorted.slice(0, 4);
    }
    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({ error: err.message || 'FAQの取得に失敗しました' }, 500);
  }
}

/**
 * POST: チャット検索
 * Body: {"message": "ユーザーの質問文", "customerId": "匿名顧客ID（任意）"}
 * 戻り: {"answer": "回答", "relatedQuestions": ["質問1", "質問2", ...]}
 */
function doPost(e) {
  var message, customerId;
  try {
    var body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    message = body.message || '';
    customerId = body.customerId || '';
  } catch (parseErr) {
    return createJsonResponse({ error: 'リクエスト形式が不正です' }, 400);
  }
  
  if (!message || String(message).trim() === '') {
    return createJsonResponse({ error: 'メッセージが必要です' }, 400);
  }
  
  try {
    var results = searchFAQ(String(message).trim());
    var answer;
    var relatedQuestions = [];
    
    if (results.length > 0 && results[0].score >= MIN_SCORE) {
      answer = results[0].answer;
      relatedQuestions = results.slice(1, 4).map(function(r) { return r.question; });
    } else {
      answer = 'お問い合わせいただき、誠にありがとうございます。\n恐れ入りますが、該当する情報を確認することができませんでした。お手数をおかけいたしますが、カスタマーサポートまでお問い合わせください。';
    }
    
    // 対応履歴をスプシに追記（失敗しても回答は返す）
    try {
      appendHistory(message, answer, String(customerId).trim());
    } catch (historyErr) {}
    
    return createJsonResponse({
      answer: answer,
      relatedQuestions: relatedQuestions
    });
  } catch (err) {
    return createJsonResponse({ error: err.message || '検索に失敗しました' }, 500);
  }
}

/**
 * スプレッドシートからFAQ一覧を取得
 * 列: A=ID, B=質問, C=回答, D=キーワード(カンマ区切り), E=作成日時, F=更新日時, G=使用回数, H=カテゴリ
 */
function getFAQs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0];
  }
  var lastRow = sheet.getLastRow();
  if (lastRow <= HEADER_ROW) {
    return [];
  }
  var data = sheet.getRange(HEADER_ROW + 1, 1, lastRow, 8).getValues();
  var faqs = [];
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var question = row[1] ? String(row[1]).trim() : '';
    if (question === '') continue;
    var keywords = row[3] ? String(row[3]).split(',').map(function(k) { return k.trim(); }).filter(function(k) { return k; }) : [];
    faqs.push({
      id: row[0] ? Number(row[0]) : i + 1,
      question: question,
      answer: row[2] ? String(row[2]).trim() : '',
      keywords: keywords,
      createdAt: row[4] || '',
      updatedAt: row[5] || '',
      usageCount: row[6] ? Number(row[6]) : 0,
      category: row[7] ? String(row[7]).trim() : ''
    });
  }
  return faqs;
}

/**
 * 質問文でFAQを検索（キーワード・質問文マッチでスコア付け）
 */
function searchFAQ(query) {
  var faqs = getFAQs();
  var queryLower = query.toLowerCase().trim();
  var results = [];
  
  for (var i = 0; i < faqs.length; i++) {
    var faq = faqs[i];
    var totalScore = 0;
    
    if (faq.question && faq.question.toLowerCase().trim() === queryLower) {
      totalScore += 100;
    }
    if (faq.question && faq.question.toLowerCase().indexOf(queryLower) !== -1) {
      totalScore += 50;
    }
    if (faq.question && queryLower.indexOf(faq.question.toLowerCase().trim()) !== -1) {
      totalScore += 50;
    }
    
    if (faq.keywords && faq.keywords.length > 0) {
      for (var k = 0; k < faq.keywords.length; k++) {
        var kw = faq.keywords[k].toLowerCase().trim();
        if (kw && queryLower.indexOf(kw) !== -1) {
          totalScore += 20;
        }
        if (kw && faq.question && faq.question.toLowerCase().indexOf(kw) !== -1) {
          totalScore += 10;
        }
      }
    }
    
    var commonWords = queryLower.split(/\s+/).filter(function(w) { return w.length > 1; });
    if (faq.answer && commonWords.length > 0) {
      for (var w = 0; w < commonWords.length; w++) {
        if (faq.answer.toLowerCase().indexOf(commonWords[w]) !== -1) {
          totalScore += 5;
        }
      }
    }
    
    if (totalScore > 0) {
      results.push({ question: faq.question, answer: faq.answer, id: faq.id, score: totalScore });
    }
  }
  
  results.sort(function(a, b) { return b.score - a.score; });
  return results;
}

/**
 * 対応履歴シートに 日時・質問・回答・やり取り回数・顧客ID を1行追加
 * 「対応履歴」がなければ「シート1」など先頭シートに追記する。5列処理で失敗しても3列で必ず残す。
 */
function appendHistory(question, answer, customerId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(HISTORY_SHEET_NAME);
  if (!sheet) {
    var first = ss.getSheets()[0];
    var firstVal = first.getLastRow() >= 1 ? (first.getRange(1, 1, 1, 2).getValues()[0] || []) : [];
    if (firstVal[0] === '日時' || firstVal[0] === '質問' || firstVal[1] === '質問') {
      sheet = first;
    } else {
      sheet = ss.insertSheet(HISTORY_SHEET_NAME);
      sheet.getRange(1, 1, 1, 5).setValues([['日時', '質問', '回答', 'やり取り回数', '顧客ID']]);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }
  }
  var now = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  var count = '';
  try {
    var lastRow = sheet.getLastRow();
    var numCols = Math.max(sheet.getLastColumn(), 1);
    if (lastRow >= 1 && numCols < 5) {
      sheet.getRange(1, 4, 1, 5).setValues([['やり取り回数', '顧客ID']]);
      sheet.getRange(1, 4, 1, 5).setFontWeight('bold');
      numCols = 5;
    }
    if (customerId && lastRow >= 2 && numCols >= 5) {
      var data = sheet.getRange(2, 5, lastRow, 5).getValues();
      var n = 0;
      for (var i = 0; i < data.length; i++) {
        if (String(data[i][0] || '').trim() === String(customerId).trim()) n++;
      }
      count = n + 1;
    }
  } catch (e) {
    count = '';
  }
  try {
    sheet.appendRow([now, question, answer, count, customerId || '']);
  } catch (e) {
    try {
      sheet.appendRow([now, question, answer]);
    } catch (e2) {}
  }
}

/**
 * JSONレスポンスを返す
 */
function createJsonResponse(data, statusCode) {
  statusCode = statusCode || 200;
  var output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
