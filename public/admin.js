const API_URL = 'http://localhost:3000/api';

let faqs = [];
const contactHistoryData = [
    {
        id: 'history-001',
        name: '田中 太郎',
        date: '2025-11-28 13:45',
        email: 'taro@example.com',
        subject: '退会手続きについて',
        tags: ['退会', '手続き'],
        messages: [
            { role: 'user', text: '退会の手続き方法について教えてください。', time: '13:45' },
            { role: 'bot', text: 'マイページの「アカウント設定」から退会申請が可能です。', time: '13:46' },
            { role: 'user', text: '必要な書類はありますか？', time: '13:47' },
            { role: 'bot', text: '特別な書類は不要です。申請完了後に確認メールが届きます。', time: '13:48' }
        ]
    },
    {
        id: 'history-002',
        name: '佐藤 花子',
        date: '2025-11-27 09:12',
        email: 'hanako@example.com',
        subject: '住所変更の手順',
        tags: ['住所変更', '会員情報'],
        messages: [
            { role: 'user', text: '引っ越したので住所を変更したいです。', time: '09:12' },
            { role: 'bot', text: 'マイページの「会員情報」から住所を更新できます。', time: '09:13' },
            { role: 'user', text: '本人確認は必要ですか？', time: '09:13' },
            { role: 'bot', text: '登録メール宛に確認コードを送るので入力してください。', time: '09:14' }
        ]
    },
    {
        id: 'history-003',
        name: '鈴木 一郎',
        date: '2025-11-25 18:02',
        email: 'ichiro@example.com',
        subject: '分割払いの残額確認',
        tags: ['支払い', '分割'],
        messages: [
            { role: 'user', text: '分割払いの残額を確認したいのですが。', time: '18:02' },
            { role: 'bot', text: 'マイページの「支払い履歴」から残額をご確認いただけます。', time: '18:03' },
            { role: 'user', text: '遅れた場合はどうなりますか？', time: '18:04' },
            { role: 'bot', text: 'サポート窓口までご連絡ください。延長プランをご案内いたします。', time: '18:05' }
        ]
    }
];

// DOM要素
const addFaqForm = document.getElementById('addFaqForm');
const editFaqForm = document.getElementById('editFaqForm');
const faqList = document.getElementById('faqList');
const faqCount = document.getElementById('faqCount');
const editModal = document.getElementById('editModal');
const listSectionTitle = document.getElementById('listSectionTitle');
const faqListView = document.getElementById('faqListView');
const csvImportView = document.getElementById('csvImportView');
const contactHistoryView = document.getElementById('contactHistoryView');
const contactHistoryList = document.getElementById('contactHistoryList');
const toolbarHistoryButton = document.getElementById('toolbarHistoryButton');
const toolbarFaqButton = document.getElementById('toolbarFaqButton');
const toolbarCsvButton = document.getElementById('toolbarCsvButton');
const toolbarButtons = document.querySelectorAll('.toolbar-btn');
const popularSettingsContainer = document.getElementById('popularSettings');
const savePopularButton = document.getElementById('savePopularButton');
const historyModal = document.getElementById('historyModal');
const historyModalBody = document.getElementById('historyModalBody');
const historyModalTitle = document.getElementById('historyModalTitle');

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    loadFAQs();
    
    addFaqForm.addEventListener('submit', handleAddFAQ);
    editFaqForm.addEventListener('submit', handleEditFAQ);

    // ツールバーのボタン切り替え
    if (toolbarHistoryButton && toolbarFaqButton && toolbarCsvButton) {
        toolbarHistoryButton.addEventListener('click', () => {
            showContactHistoryView();
        });

        toolbarFaqButton.addEventListener('click', () => {
            showFAQView();
        });

        toolbarCsvButton.addEventListener('click', () => {
            showCSVImportView();
        });

        // 初期表示はお問い合わせ履歴
        showContactHistoryView();
    }

    // CSVアップロードボタン
    const csvUploadButton = document.getElementById('csvUploadButton');
    if (csvUploadButton) {
        csvUploadButton.addEventListener('click', handleCSVUpload);
    }

    // よくある質問設定の保存ボタン
    if (savePopularButton) {
        savePopularButton.addEventListener('click', savePopularSettings);
    }

    // FAQ読込完了後に「よくある質問」設定も読み込む
    loadPopularSettings();

    // お問い合わせ履歴（デモ）を描画
    renderContactHistory();
});

// FAQ一覧を読み込み
async function loadFAQs() {
    try {
        const response = await fetch(`${API_URL}/faqs`);
        faqs = await response.json();
        
        renderFAQList();
        updateFAQCount();
        // FAQが更新されたら人気FAQの選択肢も更新
        renderPopularSettingsUI();
    } catch (error) {
        console.error('FAQ読み込みエラー:', error);
        showNotification('FAQの読み込みに失敗しました', 'error');
    }
}

// 「よくある質問」設定を読み込み
async function loadPopularSettings() {
    try {
        const response = await fetch(`${API_URL}/faqs/popular-settings`);
        const data = await response.json();
        window.currentPopularIds = data.popularIds || [];
        renderPopularSettingsUI();
    } catch (error) {
        console.error('人気FAQ設定の読み込みエラー:', error);
    }
}

// 「よくある質問」設定のUIを描画
function renderPopularSettingsUI() {
    if (!popularSettingsContainer || faqs.length === 0) return;

    const popularIds = window.currentPopularIds || [];
    const slots = 4;

    popularSettingsContainer.innerHTML = '';

    for (let i = 0; i < slots; i++) {
        const row = document.createElement('div');
        row.className = 'popular-row';

        const label = document.createElement('span');
        label.className = 'popular-row-label';
        label.textContent = i + 1;

        const select = document.createElement('select');
        select.className = 'popular-select';

        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '（未選択）';
        select.appendChild(emptyOption);

        faqs.forEach(faq => {
            const option = document.createElement('option');
            option.value = faq.id;
            option.textContent = faq.question;
            select.appendChild(option);
        });

        const currentId = popularIds[i];
        if (currentId) {
            select.value = currentId;
        }

        row.appendChild(label);
        row.appendChild(select);
        popularSettingsContainer.appendChild(row);
    }
}

// 「よくある質問」設定を保存
async function savePopularSettings() {
    if (!popularSettingsContainer) return;

    const selects = popularSettingsContainer.querySelectorAll('.popular-select');
    const ids = Array.from(selects)
        .map(sel => parseInt(sel.value))
        .filter(id => !isNaN(id));

    if (ids.length === 0) {
        showNotification('少なくとも1件は「よくある質問」を選択してください', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/faqs/popular-settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ popularIds: ids })
        });

        const data = await response.json();

        if (data.success) {
            window.currentPopularIds = data.popularIds || ids;
            showNotification('「よくある質問」を保存しました', 'success');
        } else {
            showNotification(data.error || '「よくある質問」の保存に失敗しました', 'error');
        }
    } catch (error) {
        console.error('人気FAQ設定保存エラー:', error);
        showNotification('「よくある質問」の保存に失敗しました', 'error');
    }
}

// お問い合わせ履歴（デモ）を描画
function renderContactHistory() {
    if (!contactHistoryList) return;

    contactHistoryList.innerHTML = contactHistoryData.map(item => `
        <div class="contact-history-card">
            <div class="contact-history-header">
                <span class="contact-history-name">${escapeHtml(item.name)}</span>
                <span class="contact-history-date">${escapeHtml(item.date)}</span>
            </div>
            <div class="contact-history-message">${escapeHtml(item.subject)}</div>
            <div class="contact-history-tags">
                ${item.tags.map(tag => `<span class="history-tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
            <button class="btn btn-secondary history-detail-btn" data-history-id="${item.id}">詳細を見る</button>
        </div>
    `).join('');

    const detailButtons = document.querySelectorAll('.history-detail-btn');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const historyId = btn.getAttribute('data-history-id');
            openHistoryModal(historyId);
        });
    });
}

function openHistoryModal(historyId) {
    const history = contactHistoryData.find(item => item.id === historyId);
    if (!history || !historyModal || !historyModalBody) return;

    historyModalTitle.textContent = `${history.name} 様のお問い合わせ`;

    const infoHtml = `
        <div class="history-info">
            <div><strong>日時:</strong>${history.date}</div>
            <div><strong>メール:</strong>${escapeHtml(history.email)}</div>
            <div><strong>件名:</strong>${escapeHtml(history.subject)}</div>
        </div>
    `;

    const conversationHtml = history.messages.map(msg => `
        <div class="history-message ${msg.role}">
            <div class="message-meta">${msg.role === 'user' ? 'お客様' : 'サポート'} ・ ${msg.time}</div>
            <div class="message-bubble">${escapeHtml(msg.text)}</div>
        </div>
    `).join('');

    historyModalBody.innerHTML = `
        ${infoHtml}
        <div class="history-conversation">
            ${conversationHtml}
        </div>
    `;

    historyModal.classList.add('active');
}

function closeHistoryModal() {
    if (historyModal) {
        historyModal.classList.remove('active');
    }
}

// グローバルスコープで公開（HTMLのonclickから呼び出し可能にする）
window.closeHistoryModal = closeHistoryModal;

if (historyModal) {
    historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) {
            closeHistoryModal();
        }
    });
}

// FAQ一覧を描画
function renderFAQList() {
    if (faqs.length === 0) {
        faqList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <p>FAQが登録されていません</p>
            </div>
        `;
        return;
    }
    
    faqList.innerHTML = faqs.map(faq => `
        <div class="faq-item">
            <div class="faq-question">${escapeHtml(faq.question)}</div>
            <div class="faq-answer">${escapeHtml(faq.answer)}</div>
            ${faq.keywords && faq.keywords.length > 0 ? `
                <div class="faq-keywords">
                    ${faq.keywords.map(kw => `<span class="keyword-tag">${escapeHtml(kw)}</span>`).join('')}
                </div>
            ` : ''}
            <div class="faq-actions">
                <button class="btn btn-edit" onclick="openEditModal(${faq.id})">✏️ 編集</button>
                <button class="btn btn-delete" onclick="deleteFAQ(${faq.id})">🗑️ 削除</button>
            </div>
        </div>
    `).join('');
}

// FAQ件数を更新
function updateFAQCount() {
    faqCount.textContent = faqs.length;
}

// FAQ追加
async function handleAddFAQ(e) {
    e.preventDefault();
    
    const question = document.getElementById('newQuestion').value.trim();
    const answer = document.getElementById('newAnswer').value.trim();
    const keywordsStr = document.getElementById('newKeywords').value.trim();
    const keywords = keywordsStr ? keywordsStr.split(',').map(k => k.trim()).filter(k => k) : [];
    
    try {
        const response = await fetch(`${API_URL}/faqs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question, answer, keywords })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('FAQを追加しました', 'success');
            addFaqForm.reset();
            loadFAQs();
        } else {
            showNotification('FAQの追加に失敗しました', 'error');
        }
    } catch (error) {
        console.error('FAQ追加エラー:', error);
        showNotification('FAQの追加に失敗しました', 'error');
    }
}

// 編集モーダルを開く
function openEditModal(id) {
    const faq = faqs.find(f => f.id === id);
    if (!faq) return;
    
    document.getElementById('editId').value = faq.id;
    document.getElementById('editQuestion').value = faq.question;
    document.getElementById('editAnswer').value = faq.answer;
    document.getElementById('editKeywords').value = faq.keywords ? faq.keywords.join(', ') : '';
    
    editModal.classList.add('active');
}

// 編集モーダルを閉じる
function closeEditModal() {
    editModal.classList.remove('active');
    editFaqForm.reset();
}

// FAQ編集
async function handleEditFAQ(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editId').value);
    const question = document.getElementById('editQuestion').value.trim();
    const answer = document.getElementById('editAnswer').value.trim();
    const keywordsStr = document.getElementById('editKeywords').value.trim();
    const keywords = keywordsStr ? keywordsStr.split(',').map(k => k.trim()).filter(k => k) : [];
    
    try {
        const response = await fetch(`${API_URL}/faqs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question, answer, keywords })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('FAQを更新しました', 'success');
            closeEditModal();
            loadFAQs();
        } else {
            showNotification('FAQの更新に失敗しました', 'error');
        }
    } catch (error) {
        console.error('FAQ更新エラー:', error);
        showNotification('FAQの更新に失敗しました', 'error');
    }
}

// FAQ削除
async function deleteFAQ(id) {
    if (!confirm('このFAQを削除してもよろしいですか？')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/faqs/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('FAQを削除しました', 'success');
            loadFAQs();
        } else {
            showNotification('FAQの削除に失敗しました', 'error');
        }
    } catch (error) {
        console.error('FAQ削除エラー:', error);
        showNotification('FAQの削除に失敗しました', 'error');
    }
}

// ビュー切り替え（FAQ一覧）
function showFAQView() {
    if (!faqListView || !csvImportView || !contactHistoryView) return;

    faqListView.classList.remove('hidden');
    csvImportView.classList.add('hidden');
    contactHistoryView.classList.add('hidden');

    if (listSectionTitle) {
        listSectionTitle.textContent = 'FAQ一覧';
    }

    setActiveToolbar(toolbarFaqButton);
}

// ビュー切り替え（CSV取り込み）
function showCSVImportView() {
    if (!faqListView || !csvImportView || !contactHistoryView) return;

    faqListView.classList.add('hidden');
    csvImportView.classList.remove('hidden');
    contactHistoryView.classList.add('hidden');

    if (listSectionTitle) {
        listSectionTitle.textContent = 'CSV取り込み';
    }

    setActiveToolbar(toolbarCsvButton);
}

// ビュー切り替え（お問い合わせ履歴）
function showContactHistoryView() {
    if (!faqListView || !csvImportView || !contactHistoryView) return;

    faqListView.classList.add('hidden');
    csvImportView.classList.add('hidden');
    contactHistoryView.classList.remove('hidden');

    if (listSectionTitle) {
        listSectionTitle.textContent = 'お問い合わせ履歴';
    }

    // お問い合わせ履歴を再描画
    renderContactHistory();

    setActiveToolbar(toolbarHistoryButton);
}

// ツールバーの選択状態を更新
function setActiveToolbar(activeButton) {
    if (!toolbarButtons) return;

    toolbarButtons.forEach(btn => btn.classList.remove('active'));
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// CSV取り込み処理
async function handleCSVUpload() {
    const fileInput = document.getElementById('csvFileInput');
    const resultEl = document.getElementById('csvUploadResult');

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        showNotification('CSVファイルを選択してください', 'error');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
        const text = e.target.result;
        try {
            const rows = parseCSV(text);

            if (!rows || rows.length === 0) {
                showNotification('有効なデータが見つかりませんでした', 'error');
                return;
            }

            const response = await fetch(`${API_URL}/faqs/import`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rows })
            });

            const data = await response.json();

            if (data.success) {
                showNotification(`CSVを取り込みました（${data.count}件）`, 'success');
                fileInput.value = '';
                if (resultEl) {
                    resultEl.textContent = '';
                }
                await loadFAQs();
                showFAQView();
            } else {
                const msg = data.error || 'CSVの取り込みに失敗しました';
                showNotification(msg, 'error');
                if (resultEl) {
                    resultEl.textContent = msg;
                }
                console.error('CSV import server error:', data);
            }
        } catch (error) {
            console.error('CSV取り込みエラー:', error);
            showNotification('CSVの取り込みに失敗しました', 'error');
        }
    };

    // 日本のExcel標準（Shift_JIS）で保存されたCSVを想定
    reader.readAsText(file, 'Shift_JIS');
}

// CSVテキストを行データに変換（ExcelのCSV形式・複数行セルに対応）
function parseCSV(text) {
    const rawRows = [];
    let currentRow = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === '"') {
            // 連続する "" はエスケープされた " として扱う
            if (inQuotes && text[i + 1] === '"') {
                current += '"';
                i++; // 次の " をスキップ
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(current);
            current = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            // 改行（CRLF / LF）で行区切り。ただしダブルクォート内はそのまま
            if (char === '\r' && text[i + 1] === '\n') {
                i++; // CRLF の LF をスキップ
            }
            currentRow.push(current);
            // 完全に空の行は無視
            if (currentRow.some(col => col.trim() !== '')) {
                rawRows.push(currentRow);
            }
            currentRow = [];
            current = '';
        } else {
            current += char;
        }
    }

    // 最後の行を追加
    if (current.length > 0 || currentRow.length > 0) {
        currentRow.push(current);
        if (currentRow.some(col => col.trim() !== '')) {
            rawRows.push(currentRow);
        }
    }

    const rows = [];

    for (let i = 0; i < rawRows.length; i++) {
        const cols = rawRows[i];
        if (cols.length < 3) continue;

        const no = (cols[0] || '').trim();
        const question = (cols[1] || '').trim();
        const answer = (cols[2] || '').trim();
        const keywordsStr = (cols[3] || '').trim();

        // ヘッダー行（NO / 質問 / 回答 ...）はスキップ
        if (i === 0) {
            const isHeader =
                (question.includes('質問') && answer.includes('回答')) ||
                no.toLowerCase() === 'no';
            if (isHeader) continue;
        }

        if (!question || !answer) {
            continue;
        }

        const keywords = keywordsStr
            ? keywordsStr.split(/[、,]/).map(k => k.trim()).filter(k => k)
            : [];

        rows.push({
            no,
            question,
            answer,
            keywords
        });
    }

    return rows;
}

// 通知を表示
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// HTMLエスケープ
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// モーダル外クリックで閉じる
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeEditModal();
    }
});

