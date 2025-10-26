// auth.js - Versão com Botão Único que Mostra Opções
class AuthService {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthState();
    }

    setupEventListeners() {
        // Botão de login no header
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.openLoginModal());
        }

        // Botão de logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.signOut());
        }

        this.setupModalEvents();
    }

    setupModalEvents() {
        const modal = document.getElementById('login-modal');
        const closeBtn = document.querySelector('.login-close');
        const btnBack = document.getElementById('btn-back');

        // Fechar modal
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeLoginModal());
        }

        // Fechar modal ao clicar fora
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                this.closeLoginModal();
            }
        });

        // Botão principal do modal
        const btnLoginMain = document.getElementById('btn-login-main');
        if (btnLoginMain) {
            btnLoginMain.addEventListener('click', () => this.showLoginOptions());
        }

        // Voltar para opções de login
        if (btnBack) {
            btnBack.addEventListener('click', () => this.showLoginOptions());
        }

        // Login com Google
        const googleBtn = document.getElementById('btn-google-login');
        if (googleBtn) {
            googleBtn.addEventListener('click', () => this.signInWithGoogle());
        }

        // Mostrar formulário de email
        const emailBtn = document.getElementById('btn-email-login');
        if (emailBtn) {
            emailBtn.addEventListener('click', () => this.showEmailForm());
        }

        // Login com email
        const emailSubmitBtn = document.getElementById('btn-email-submit');
        if (emailSubmitBtn) {
            emailSubmitBtn.addEventListener('click', () => this.signInWithEmail());
        }
    }

    openLoginModal() {
        console.log('Abrindo modal de login...');
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'block';
            this.resetModal();
        }
    }

    closeLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    resetModal() {
        // Mostrar botão principal e esconder opções/formulário
        const btnLoginMain = document.getElementById('btn-login-main');
        const loginOptions = document.getElementById('login-options');
        const emailForm = document.getElementById('email-login-form');

        if (btnLoginMain) btnLoginMain.style.display = 'flex';
        if (loginOptions) loginOptions.style.display = 'none';
        if (emailForm) emailForm.style.display = 'none';
    }

    showLoginOptions() {
        console.log('Mostrando opções de login...');
        const btnLoginMain = document.getElementById('btn-login-main');
        const loginOptions = document.getElementById('login-options');
        const emailForm = document.getElementById('email-login-form');

        if (btnLoginMain) btnLoginMain.style.display = 'none';
        if (loginOptions) loginOptions.style.display = 'flex';
        if (emailForm) emailForm.style.display = 'none';
    }

    showEmailForm() {
        console.log('Mostrando formulário de email...');
        const loginOptions = document.getElementById('login-options');
        const emailForm = document.getElementById('email-login-form');

        if (loginOptions) loginOptions.style.display = 'none';
        if (emailForm) emailForm.style.display = 'block';
    }

    async signInWithGoogle() {
        try {
            console.log('Iniciando login com Google...');
            
            // Feedback visual no botão
            const googleBtn = document.getElementById('btn-google-login');
            const originalText = googleBtn.innerHTML;
            googleBtn.innerHTML = '<span class="option-icon">⏳</span><span class="option-text">Conectando...</span>';
            googleBtn.disabled = true;

            const provider = new firebase.auth.GoogleAuthProvider();
            
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            
            provider.addScope('email');
            provider.addScope('profile');
            
            const result = await firebase.auth().signInWithPopup(provider);
            
            console.log('✅ Login com Google realizado:', result.user.email);
            
            // ✅ NOTIFICA O ORDER SERVICE SOBRE O LOGIN
            if (window.orderService) {
                window.orderService.onUserLogin(result.user);
            }
            
            this.closeLoginModal();
            
        } catch (error) {
            console.error('❌ Erro no login com Google:', error);
            // ✅ NOTIFICA O ORDER SERVICE SOBRE O LOGIN
            if (window.orderService) {
                window.orderService.onUserLogin(result.user);
            }
            
            // Restaurar botão
            const googleBtn = document.getElementById('btn-google-login');
            googleBtn.innerHTML = '<span class="option-icon">🚗</span><span class="option-text">Continuar com Google</span>';
            googleBtn.disabled = false;
            
            if (error.code === 'auth/popup-blocked') {
                alert('Popup bloqueado! Por favor, permita popups para este site.');
            } else if (error.code === 'auth/popup-closed-by-user') {
                console.log('Usuário fechou o popup');
            } else {
                alert('Erro ao fazer login com Google. Tente novamente.');
            }
        }
    }

    async signInWithEmail() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            alert('Por favor, preencha email e senha.');
            return;
        }

        try {
            console.log('Tentando login com email...');
            const result = await firebase.auth().signInWithEmailAndPassword(email, password);
            console.log('✅ Login com email realizado:', result.user.email);
            
            // ✅ NOTIFICA O ORDER SERVICE SOBRE O LOGIN
            if (window.orderService) {
                window.orderService.onUserLogin(result.user);
            }
            
            this.closeLoginModal();
            
        } catch (error) {
            console.error('❌ Erro no login com email:', error);
            // ✅ NOTIFICA O ORDER SERVICE SOBRE O LOGIN
            if (window.orderService) {
                window.orderService.onUserLogin(result.user);
            }
            
            // Tentar criar conta se não existir
            if (error.code === 'auth/user-not-found') {
                try {
                    const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
                    console.log('✅ Nova conta criada:', result.user.email);
                    
                    // ✅ NOTIFICA O ORDER SERVICE SOBRE O LOGIN
                    if (window.orderService) {
                        window.orderService.onUserLogin(result.user);
                    }
                    
                    this.closeLoginModal();
                } catch (createError) {
                    alert('Erro ao criar conta: ' + createError.message);
                }
            } else {
                alert('Erro ao fazer login: ' + error.message);
            }
        }
    }

    async signOut() {
        try {
            await firebase.auth().signOut();
            console.log('✅ Logout realizado');
        } catch (error) {
            console.error('❌ Erro ao fazer logout:', error);
        }
    }

    checkAuthState() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.user = user;
                this.updateUI(true);
                console.log('👤 Usuário logado:', user.email);
                this.sendTokenToBackend(user);
                
                // ✅ NOTIFICA O ORDER SERVICE SOBRE O LOGIN
                if (window.orderService) {
                    window.orderService.onUserLogin(user);
                }
            } else {
                this.user = null;
                this.updateUI(false);
                console.log('🔒 Usuário deslogado');
            }
        });
    }

    async sendTokenToBackend(user) {
        try {
            const token = await user.getIdToken();
            
            const response = await fetch('http://localhost:3001/api/auth/firebase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken: token }),
            });

            const data = await response.json();
            
            if (data.success) {
                console.log('✅ Token enviado para backend com sucesso');
                localStorage.setItem('jwtToken', data.token);
            } else {
                console.error('❌ Erro ao enviar token para backend:', data.error);
            }
        } catch (error) {
            console.error('❌ Erro ao comunicar com backend:', error);
        }
    }

    updateUI(isLoggedIn) {
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');
        const userName = document.getElementById('user-name');
        const userAvatar = document.getElementById('user-avatar');

        if (isLoggedIn && this.user) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (userInfo) userInfo.style.display = 'flex';
            if (userName) userName.textContent = this.user.displayName || this.user.email.split('@')[0];
            if (userAvatar) {
                userAvatar.src = this.user.photoURL || 'https://via.placeholder.com/40/1a1a1a/d4af37?text=G67';
                userAvatar.alt = `Avatar de ${this.user.displayName || 'Usuário'}`;
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';
        }
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.authService = new AuthService();
        console.log('🔐 Serviço de autenticação inicializado');
    }, 1000);
});