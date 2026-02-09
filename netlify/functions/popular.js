/**
 * Netlify Function: 人気FAQ取得（Apps Script へのプロキシ）
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
  const target = url.indexOf('?') >= 0 ? `${url}&action=popular` : `${url}?action=popular`;
  try {
    const res = await fetch(target);
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
