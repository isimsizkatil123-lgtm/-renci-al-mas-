// GOOGLE AI API ENTEGRASYONU - KEY SABIT
class CrissAIAPI {
    constructor() {
        // SABIT API KEY - SENIN KEYIN BURADA
        this.apiKey = 'AIzaSyBAaEP5bDApq4WYA3xz7duD_yLkrQFYU08';
        this.baseURL = 'https://generativelanguage.googleapis.com/v1';
        this.model = 'gemini-pro';
        this.isActive = true;
    }

    // GOOGLE AI CHAT MESAJI
    async sendChatMessage(message, chatId) {
        if (!this.isActive) {
            throw new Error('API devre dışı');
        }

        try {
            console.log('🔗 Google AI APIye bağlanılıyor...');
            
            const response = await fetch(`${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: message
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1000,
                        topP: 0.8,
                        topK: 40
                    }
                })
            });

            console.log('📡 API Yanıt Durumu:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP Hatası: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ API Başarılı Yanıt:', data);
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return { 
                    message: data.candidates[0].content.parts[0].text,
                    usage: data.usageMetadata
                };
            } else {
                throw new Error('API geçersiz yanıt formatı');
            }

        } catch (error) {
            console.error('❌ Google AI API hatası:', error);
            throw new Error(`Google AI bağlantı hatası: ${error.message}`);
        }
    }

    // API DURUM KONTROLÜ
    async checkAPIStatus() {
        try {
            const testResponse = await this.sendChatMessage('Merhaba', 'test');
            return { 
                status: 'active',
                message: '✅ Google AI API bağlantısı başarılı!'
            };
        } catch (error) {
            return {
                status: 'error',
                message: `❌ API Hatası: ${error.message}`
            };
        }
    }
}

// Global API instance
window.crissAIAPI = new CrissAIAPI();
