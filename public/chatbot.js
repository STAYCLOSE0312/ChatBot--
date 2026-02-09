// API設定: Netlify では Functions、localhost:3000 は従来の Node API、それ以外は APPS_SCRIPT_URL または /api
const API_CONFIG = (() => {
  const origin = window.location.origin;
  const port = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
  const isNodeServer = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && port === '3000';
  if (isNodeServer) {
    return {
      popular: `${origin}/api/faqs/popular`,
      chat: `${origin}/api/chat`,
      method: 'legacy'
    };
  }
  if (/\.netlify\.app$/.test(window.location.hostname) || window.CHATBOT_USE_NETLIFY) {
    return {
      popular: `${origin}/.netlify/functions/popular`,
      chat: `${origin}/.netlify/functions/chat`,
      method: 'netlify'
    };
  }
  if (window.APPS_SCRIPT_URL) {
    const base = window.APPS_SCRIPT_URL.replace(/\?.*$/, '');
    return {
      popular: base + (base.indexOf('?') >= 0 ? '&' : '?') + 'action=popular',
      chat: base,
      method: 'direct'
    };
  }
  return {
    popular: `${origin}/.netlify/functions/popular`,
    chat: `${origin}/.netlify/functions/chat`,
    method: 'netlify'
  };
})();

let chatMessages = [];

// DOM要素
const chatMessagesContainer = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const quickQuestionsButtons = document.getElementById('quickQuestionsButtons');

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    loadPopularQuestions();
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    sendButton.addEventListener('click', sendMessage);
    chatMessagesContainer.addEventListener('click', (e) => {
        const el = e.target.closest('.related-question');
        if (el) askRelatedQuestion(el.textContent);
    });
});

// 代表的な質問を読み込み
async function loadPopularQuestions() {
    try {
        const response = await fetch(API_CONFIG.popular);
        
        if (!response.ok) {
            console.error('FAQ取得エラー:', response.status);
            return;
        }
        
        const faqs = await response.json();
        
        if (!Array.isArray(faqs) || faqs.length === 0) {
            console.warn('FAQデータが空です');
            return;
        }
        
        quickQuestionsButtons.innerHTML = '';
        
        faqs.slice(0, 4).forEach(faq => {
            if (!faq || !faq.question) return;
            
            const button = document.createElement('button');
            button.className = 'quick-question-btn';
            button.textContent = faq.question;
            button.addEventListener('click', () => {
                chatInput.value = faq.question;
                sendMessage();
            });
            quickQuestionsButtons.appendChild(button);
        });
    } catch (error) {
        console.error('代表的な質問の読み込みエラー:', error);
    }
}

// メッセージ送信
async function sendMessage() {
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // ユーザーメッセージを表示
    addUserMessage(message);
    chatInput.value = '';
    
    // タイピングインジケーターを表示
    const typingId = showTypingIndicator();
    
    try {
        const response = await fetch(API_CONFIG.chat, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        // タイピングインジケーターを削除
        removeTypingIndicator(typingId);
        
        // レスポンスのステータスを確認
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'サーバーエラーが発生しました' }));
            console.error('APIエラー:', response.status, errorData);
            addBotMessage(`申し訳ございません。エラーが発生しました。(${response.status}: ${errorData.error || '不明なエラー'})`);
            return;
        }
        
        const data = await response.json();
        
        if (data && data.error) {
            addBotMessage('申し訳ございません。' + (data.error || 'エラーが発生しました。'));
            return;
        }
        if (!data || !data.answer) {
            console.error('無効なレスポンスデータ:', data);
            addBotMessage('申し訳ございません。サーバーからの応答が不正です。');
            return;
        }
        addBotMessage(data.answer, data.relatedQuestions || []);
        
    } catch (error) {
        console.error('メッセージ送信エラー:', error);
        removeTypingIndicator(typingId);
        addBotMessage(`申し訳ございません。エラーが発生しました。(${error.message || 'ネットワークエラー'})`);
    }
}

// ユーザーメッセージを追加
function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${escapeHtml(text)}</p>
        </div>
    `;
    
    chatMessagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// ボットメッセージを追加
function addBotMessage(text, relatedQuestions = []) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    
    let relatedHTML = '';
    if (relatedQuestions.length > 0) {
        relatedHTML = `
            <div class="related-questions">
                <div class="related-questions-title">関連する質問:</div>
                ${relatedQuestions.map(q => `
                    <div class="related-question">${escapeHtml(q)}</div>
                `).join('')}
            </div>
        `;
    }
    
    messageDiv.innerHTML = `
        <div class="message-avatar with-image">
            <img src="images/rimonyan.png" alt="リモにゃん">
        </div>
        <div class="message-content">
            <p>${escapeHtml(text).replace(/\n/g, '<br>')}</p>
            ${relatedHTML}
        </div>
    `;
    
    chatMessagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// タイピングインジケーターを表示
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    const typingId = 'typing-' + Date.now();
    typingDiv.id = typingId;
    typingDiv.className = 'message bot-message';
    
    typingDiv.innerHTML = `
        <div class="message-avatar with-image">
            <img src="images/rimonyan.png" alt="リモにゃん">
        </div>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    chatMessagesContainer.appendChild(typingDiv);
    scrollToBottom();
    
    return typingId;
}

// タイピングインジケーターを削除
function removeTypingIndicator(typingId) {
    const typingDiv = document.getElementById(typingId);
    if (typingDiv) {
        typingDiv.remove();
    }
}

// 関連質問をクリック
function askRelatedQuestion(question) {
    chatInput.value = question;
    sendMessage();
}

// 最下部にスクロール
function scrollToBottom() {
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// HTMLエスケープ
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

