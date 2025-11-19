// Kullanıcı yönetimi
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
    }

    // Giriş yap
    async login(username, password) {
        try {
            // Gerçek API bağlantısı
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const userData = await response.json();
                this.currentUser = userData;
                this.isLoggedIn = true;
                localStorage.setItem('crissai_token', userData.token);
                localStorage.setItem('crissai_user', JSON.stringify(userData));
                window.location.href = 'chat.html';
            } else {
                throw new Error('Giriş başarısız');
            }
        } catch (error) {
            // Demo mod - gerçek API yoksa
            this.demoLogin(username, password);
        }
    }

    // Demo giriş (gerçek API yoksa)
    demoLogin(username, password) {
        if (username && password) {
            this.currentUser = {
                id: 1,
                username: username,
                email: `${username}@demo.com`,
                join_date: new Date().toISOString()
            };
            this.isLoggedIn = true;
            localStorage.setItem('crissai_user', JSON.stringify(this.currentUser));
            window.location.href = 'chat.html';
        } else {
            alert('Kullanıcı adı ve şifre gerekli!');
        }
    }

    // Kayıt ol
    async register(username, email, password) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            });

            if (response.ok) {
                alert('Kayıt başarılı! Giriş yapabilirsiniz.');
                showLogin();
            } else {
                throw new Error('Kayıt başarısız');
            }
        } catch (error) {
            // Demo kayıt
            this.demoRegister(username, email, password);
        }
    }

    demoRegister(username, email, password) {
        if (username && email && password) {
            const users = JSON.parse(localStorage.getItem('crissai_users') || '[]');
            users.push({ username, email, password });
            localStorage.setItem('crissai_users', JSON.stringify(users));
            alert('Demo kayıt başarılı! Giriş yapabilirsiniz.');
            showLogin();
        }
    }

    // Çıkış yap
    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem('crissai_token');
        localStorage.removeItem('crissai_user');
        window.location.href = 'index.html';
    }

    // Oturum kontrolü
    checkAuth() {
        const userData = localStorage.getItem('crissai_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.isLoggedIn = true;
            return true;
        }
        return false;
    }
}

// Global auth manager
window.authManager = new AuthManager();

// Giriş/Kayıt fonksiyonları
function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLogin() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    window.authManager.login(username, password);
}

function register() {
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regPasswordConfirm').value;

    if (password !== confirm) {
        alert('Şifreler eşleşmiyor!');
        return;
    }

    window.authManager.register(username, email, password);
}

// Sayfa yüklendiğinde kontrol et
if (window.location.pathname.includes('chat.html')) {
    if (!window.authManager.checkAuth()) {
        window.location.href = 'index.html';
    }
}
