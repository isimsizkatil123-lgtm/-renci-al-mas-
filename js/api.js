// Gerçek API bağlantıları
class CrissAIAPI {
    constructor() {
        this.baseURL = 'https://api.crissai.com/v1';
        this.apiKey = 'AIzaSyBAaEP5bDApq4WYA3xz7duD_yLkrQFYU08';
    }

    async makeRequest(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-User-Token': localStorage.getItem('crissai_token')
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`API hatası: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API bağlantı hatası:', error);
            throw error;
        }
    }

    // Chat mesajı gönder
    async sendChatMessage(message, chatId) {
        return await this.makeRequest('/chat', {
            message: message,
            chat_id: chatId,
            model: 'gpt-4',
            temperature: 0.7
        });
    }

    // Kullanıcı girişi
    async userLogin(username, password) {
        return await this.makeRequest('/auth/login', {
            username: username,
            password: password
        });
    }

    // Kullanıcı kaydı
    async userRegister(username, email, password) {
        return await this.makeRequest('/auth/register', {
            username: username,
            email: email,
            password: password
        });
    }
}

// Global API instance
window.crissAIAPI = new CrissAIAPI();
