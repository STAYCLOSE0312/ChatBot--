const API_URL = 'http://localhost:3000/api';

let chatMessages = [];

// DOM要素
const chatMessagesContainer = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const quickQuestionsButtons = document.getElementById('quickQuestionsButtons');

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    loadPopularQuestions();
    
    // エンターキーで送信
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // 送信ボタン
    sendButton.addEventListener('click', sendMessage);
});

// 代表的な質問を読み込み
async function loadPopularQuestions() {
    try {
        const response = await fetch(`${API_URL}/faqs/popular`);
        const faqs = await response.json();
        
        quickQuestionsButtons.innerHTML = '';
        
        faqs.slice(0, 4).forEach(faq => {
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
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        // タイピングインジケーターを削除
        removeTypingIndicator(typingId);
        
        // ボットの回答を表示
        addBotMessage(data.answer, data.relatedQuestions || []);
        
    } catch (error) {
        console.error('メッセージ送信エラー:', error);
        removeTypingIndicator(typingId);
        addBotMessage('申し訳ございません。エラーが発生しました。もう一度お試しください。');
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
                    <div class="related-question" onclick="askRelatedQuestion('${escapeHtml(q)}')">
                        ${escapeHtml(q)}
                    </div>
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

