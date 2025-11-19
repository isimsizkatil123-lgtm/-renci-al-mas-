// Chat yönetimi
class ChatManager {
    constructor() {
        this.currentChatId = null;
        this.chats = this.loadChats();
        this.init();
    }

    init() {
        this.loadChatHistory();
        this.startNewChat();
    }

    // Yeni sohbet başlat
    startNewChat() {
        this.currentChatId = 'chat_' + Date.now();
        this.chats[this.currentChatId] = {
            id: this.currentChatId,
            title: 'Yeni Sohbet',
            messages: [],
            created: new Date().toISOString()
        };
        this.saveChats();
        this.renderChat();
    }

    // Mesaj gönder
    async sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();

        if (!message) return;

        // Kullanıcı mesajını ekle
        this.addMessage('user', message);
        input.value = '';

        // AI yanıtını al
        await this.getAIResponse(message);
    }

    // AI yanıtı al
    async getAIResponse(userMessage) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('crissai_token')
                },
                body: JSON.stringify({
                    message: userMessage,
                    chat_id: this.currentChatId
                })
            });

            if (response.ok) {
                const aiResponse = await response.json();
                this.addMessage('ai', aiResponse.message);
            } else {
                throw new Error('AI yanıtı alınamadı');
            }
        } catch (error) {
            // Demo AI yanıtı
            this.addMessage('ai', this.generateDemoResponse(userMessage));
        }
    }

    // Demo AI yanıtı
    generateDemoResponse(message) {
        const responses = [
            "Merhaba! Size nasıl yardımcı olabilirim?",
            "Bu konuda daha fazla bilgi verebilirim.",
            "İlginç bir soru! Bunu araştırayım.",
            "Size bu konuda rehberlik edebilirim.",
            "Harika bir soru sordunuz!",
            "Bunu detaylıca açıklayayım..."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Mesaj ekle
    addMessage(sender, content) {
        if (!this.currentChatId) return;

        const message = {
            id: 'msg_' + Date.now(),
            sender: sender,
            content: content,
            timestamp: new Date().toISOString()
        };

        this.chats[this.currentChatId].messages.push(message);
        this.saveChats();
        this.renderMessages();
    }

    // Mesajları render et
    renderMessages() {
        const container = document.getElementById('chatMessages');
        const chat = this.chats[this.currentChatId];

        if (!chat) return;

        container.innerHTML = chat.messages.map(msg => `
            <div class="message ${msg.sender}">
                <div class="message-content">${msg.content}</div>
            </div>
        `).join('');

        container.scrollTop = container.scrollHeight;
    }

    // Sohbeti render et
    renderChat() {
        this.renderMessages();
        this.loadChatHistory();
    }

    // Sohbet geçmişini yükle
    loadChatHistory() {
        const container = document.getElementById('chatHistory');
        const chats = Object.values(this.chats).sort((a, b) => 
            new Date(b.created) - new Date(a.created)
        );

        container.innerHTML = chats.map(chat => `
            <div class="chat-history-item ${chat.id === this.currentChatId ? 'active' : ''}" 
                 onclick="chatManager.loadChat('${chat.id}')">
                <div class="chat-title">${chat.title}</div>
                <div class="chat-date">${new Date(chat.created).toLocaleDateString('tr-TR')}</div>
            </div>
        `).join('');
    }

    // Sohbet yükle
    loadChat(chatId) {
        this.currentChatId = chatId;
        this.renderChat();
        toggleSidebar();
    }

    // Sohbetleri kaydet
    saveChats() {
        localStorage.setItem('crissai_chats', JSON.stringify(this.chats));
    }

    // Sohbetleri yükle
    loadChats() {
        return JSON.parse(localStorage.getItem('crissai_chats') || '{}');
    }
}

// Global chat manager
window.chatManager = new ChatManager();

// UI fonksiyonları
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function newChat() {
    window.chatManager.startNewChat();
}

function showProfile() {
    const user = window.authManager.currentUser;
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileDate').textContent = new Date(user.join_date).toLocaleDateString('tr-TR');
    document.getElementById('profileModal').classList.add('show');
    toggleSidebar();
}

function closeProfile() {
    document.getElementById('profileModal').classList.remove('show');
}

function logout() {
    window.authManager.logout();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    window.chatManager.sendMessage();
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('chat.html')) {
        window.chatManager.renderChat();
    }
});
