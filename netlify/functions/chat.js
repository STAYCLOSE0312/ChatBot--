/**
 * Netlify Function: チャット検索（Apps Script へのプロキシ）
 * 環境変数 APPS_SCRIPT_URL にデプロイしたWebアプリのURLを設定してください。
 */
exports.handler = async (event, context) => {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'APPS_SCRIPT_URL が設定されていません' })
    };
  }
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }
  let body;
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'リクエスト形式が不正です' })
    };
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: body.message || '' })
    });
    const text = await res.text();
    const statusCode = res.ok ? 200 : res.status;
    return {
      statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message || 'APIの呼び出しに失敗しました' })
    };
  }
};
