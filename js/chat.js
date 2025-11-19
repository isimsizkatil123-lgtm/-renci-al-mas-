// Chat yönetimi - GERÇEK AI
class ChatManager {
    constructor() {
        this.currentChatId = null;
        this.chats = this.loadChats();
        this.apiStatus = 'checking';
        this.init();
    }

    async init() {
        await this.checkAPI();
        this.loadChatHistory();
        this.startNewChat();
    }

    // API DURUM KONTROLÜ
    async checkAPI() {
        const status = await window.crissAIAPI.checkAPIStatus();
        this.apiStatus = status.status;
        
        if (status.status === 'active') {
            this.showNotification('✅ Google AI bağlantısı başarılı!', 'success');
        } else {
            this.showNotification(status.message, 'error');
        }
    }

    // Yeni sohbet başlat
    startNewChat() {
        this.currentChatId = 'chat_' + Date.now();
        this.chats[this.currentChatId] = {
            id: this.currentChatId,
            title: 'Yeni Sohbet',
            messages: [],
            created: new Date().toISOString(),
            isAIActive: this.apiStatus === 'active'
        };
        this.saveChats();
        this.renderChat();
    }

    // Mesaj gönder - GERÇEK AI
    async sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();

        if (!message) return;

        // Kullanıcı mesajını ekle
        this.addMessage('user', message);
        input.value = '';

        // AI yanıtını al - GERÇEK API
        try {
            await this.getRealAIResponse(message);
        } catch (error) {
            this.addMessage('ai', 
                `❌ AI yanıtı alınamadı: ${error.message}\n\n` +
                `🔄 Demo moda geçiliyor...\n\n` +
                `${this.generateDemoResponse(message)}`
            );
        }
    }

    // GERÇEK AI YANITI
    async getRealAIResponse(userMessage) {
        // "AI düşünüyor..." mesajını göster
        this.showThinkingIndicator();
        
        try {
            const response = await window.crissAIAPI.sendChatMessage(userMessage, this.currentChatId);
            this.hideThinkingIndicator();
            this.addMessage('ai', response.message);
            
        } catch (error) {
            this.hideThinkingIndicator();
            throw error;
        }
    }

    // AI düşünüyor göstergesi
    showThinkingIndicator() {
        const thinkingId = 'thinking_' + Date.now();
        this.addMessage('ai', '<div class="thinking-indicator">CrissAI düşünüyor...</div>', thinkingId);
    }

    hideThinkingIndicator() {
        const thinkingElements = document.querySelectorAll('.thinking-indicator');
        thinkingElements.forEach(el => el.closest('.message').remove());
    }

    // Mesaj ekle
    addMessage(sender, content, customId = null) {
        if (!this.currentChatId) return;

        const message = {
            id: customId || 'msg_' + Date.now(),
            sender: sender,
            content: content,
            timestamp: new Date().toISOString(),
            isAI: sender === 'ai'
        };

        this.chats[this.currentChatId].messages.push(message);
        
        // İlk AI mesajında sohbet başlığını güncelle
        if (sender === 'ai' && this.chats[this.currentChatId].title === 'Yeni Sohbet') {
            this.updateChatTitle(content.substring(0, 30) + '...');
        }
        
        this.saveChats();
        this.renderMessages();
    }

    // Sohbet başlığını güncelle
    updateChatTitle(newTitle) {
        this.chats[this.currentChatId].title = newTitle;
        this.saveChats();
        this.loadChatHistory();
    }

    // Mesajları render et
    renderMessages() {
        const container = document.getElementById('chatMessages');
        const chat = this.chats[this.currentChatId];

        if (!chat) return;

        container.innerHTML = chat.messages.map(msg => `
            <div class="message ${msg.sender}">
                <div class="message-content">${msg.content}</div>
                <div class="message-time">${new Date(msg.timestamp).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
        `).join('');

        container.scrollTop = container.scrollHeight;
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
                <div class="chat-preview">${chat.messages[0]?.content.substring(0, 30)}...</div>
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

    // Sohbeti render et
    renderChat() {
        this.renderMessages();
        this.loadChatHistory();
    }

    // Sohbetleri kaydet
    saveChats() {
        localStorage.setItem('crissai_chats', JSON.stringify(this.chats));
    }

    // Sohbetleri yükle
    loadChats() {
        return JSON.parse(localStorage.getItem('crissai_chats') || '{}');
    }

    // Demo yanıt (sadece gerçek API çalışmazsa)
    generateDemoResponse(message) {
        const responses = [
            "Merhaba! Size nasıl yardımcı olabilirim?",
            "Bu konuda daha fazla bilgi verebilirim.",
            "İlginç bir soru! Bunu detaylıca açıklayayım.",
            "Size bu konuda rehberlik edebilirim.",
            "Harika bir soru sordunuz!",
            "Bunu birlikte keşfedelim..."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Bildirim göster
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Global chat manager
window.chatManager = new ChatManager();
