// garagem67/js/auth.js - Sistema de autenticação com Firebase ATUALIZADO
class AuthService {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        console.log('🔐 Serviço de autenticação inicializado');
        this.setupAuthListeners();
        this.setupLoginModal();
        this.checkAuthState();
    }

    setupAuthListeners() {
        // Listener do Firebase para mudanças de autenticação
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.handleUserLoggedIn(user);
            } else {
                this.handleUserLoggedOut();
            }
        });
    }

    setupLoginModal() {
        const loginModal = document.getElementById('login-modal');
        const loginClose = document.querySelector('.login-close');
        const loginOptions = document.getElementById('login-options');
        const btnLoginMain = document.getElementById('btn-login-main');
        const btnGoogleLogin = document.getElementById('btn-google-login');
        const btnEmailLogin = document.getElementById('btn-email-login');
        const emailLoginForm = document.getElementById('email-login-form');
        const btnBack = document.getElementById('btn-back');
        const headerLoginBtn = document.getElementById('login-btn');

        if (headerLoginBtn) {
            headerLoginBtn.addEventListener('click', () => {
                console.log('👆 Botão Entrar do header clicado');
                loginModal.style.display = 'block';
                this.resetLoginModal();
            });
        }

        // Fechar modal
        if (loginClose) {
            loginClose.addEventListener('click', () => {
                loginModal.style.display = 'none';
                this.resetLoginModal();
            });
        }

        // Clique fora do modal para fechar
        loginModal.addEventListener('click', (event) => {
            if (event.target === loginModal) {
                loginModal.style.display = 'none';
                this.resetLoginModal();
            }
        });

        // Botão principal de login
        if (btnLoginMain) {
            btnLoginMain.addEventListener('click', () => {
                console.log('Abrindo opções de login...');
                loginOptions.style.display = 'block';
                btnLoginMain.style.display = 'none';
            });
        }

        // Login com Google
        if (btnGoogleLogin) {
            btnGoogleLogin.addEventListener('click', () => {
                this.signInWithGoogle();
            });
        }

        // Login com email
        if (btnEmailLogin) {
            btnEmailLogin.addEventListener('click', () => {
                loginOptions.style.display = 'none';
                emailLoginForm.style.display = 'block';
            });
        }

        // Voltar para opções
        if (btnBack) {
            btnBack.addEventListener('click', () => {
                emailLoginForm.style.display = 'none';
                loginOptions.style.display = 'block';
            });
        }

        // Evento para abrir modal externamente
        document.addEventListener('openLoginModal', () => {
            loginModal.style.display = 'block';
            this.resetLoginModal();
        });
    }

    resetLoginModal() {
        const loginOptions = document.getElementById('login-options');
        const emailLoginForm = document.getElementById('email-login-form');
        const btnLoginMain = document.getElementById('btn-login-main');

        if (loginOptions) loginOptions.style.display = 'none';
        if (emailLoginForm) emailLoginForm.style.display = 'none';
        if (btnLoginMain) btnLoginMain.style.display = 'block';
    }

    async signInWithGoogle() {
        try {
            console.log('Iniciando login com Google...');
            
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');
            
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            
            const result = await firebase.auth().signInWithPopup(provider);
            const user = result.user;
            
            console.log('✅ Login com Google bem-sucedido:', user);
            await this.handleGoogleLoginSuccess(user);
            
        } catch (error) {
            console.error('❌ Erro no login com Google:', error);
            
            if (error.code === 'auth/popup-closed-by-user') {
                console.log('ℹ️ Usuário fechou a popup de login');
                return;
            }
            
            this.showLoginError('Erro ao fazer login com Google: ' + error.message);
        }
    }

    // 🆕 FUNÇÃO ATUALIZADA COM FIRESTORE
    async handleGoogleLoginSuccess(user) {
        try {
            // Salvar dados básicos do usuário LOCALMENTE
            const userData = {
                nome: user.displayName || user.email.split('@')[0],
                email: user.email,
                picture: user.photoURL || 'https://via.placeholder.com/40'
            };

            // Verificar se já tem dados completos salvos
            const existingData = this.getUserData();
            if (existingData && existingData.telefone && existingData.endereco) {
                console.log('✅ Dados completos encontrados, mesclando...');
                userData.telefone = existingData.telefone;
                userData.endereco = existingData.endereco;
                userData.cidade = existingData.cidade;
                userData.estado = existingData.estado;
                userData.cep = existingData.cep;
                userData.complemento = existingData.complemento;
                userData.cpf = existingData.cpf || ''; // ⭐ NOVO CAMPO
            }

            // ⭐ SALVAR NO FIRESTORE (automático via firebase-customers.js)
            if (window.firebaseCustomers) {
                console.log('🔄 Disparando sincronização com Firestore...');
                // O firebase-customers.js já cuida disso automaticamente
            }

            this.saveUserData(userData);
            this.updateUI(user);

            // Fechar modal de login
            const loginModal = document.getElementById('login-modal');
            if (loginModal) {
                loginModal.style.display = 'none';
            }

            // Continuar com o fluxo do pedido
            this.continueCheckoutFlow();

        } catch (error) {
            console.error('❌ Erro ao processar login:', error);
        }
    }

    continueCheckoutFlow() {
        console.log('🔄 Continuando fluxo do checkout após login...');
        
        // Disparar evento para continuar o checkout
        setTimeout(() => {
            if (window.cartManager) {
                window.cartManager.proceedToAddressModal();
            }
        }, 500);
    }

    handleUserLoggedIn(user) {
        console.log('✅ Usuário logado:', user.email);
        this.user = user;
        this.updateUI(user);

        // 🆕 Preencher formulário com dados existentes
        if (window.firebaseCustomers) {
            setTimeout(() => {
                window.firebaseCustomers.fillFormWithExistingData();
            }, 1000);
        }
    }

    handleUserLoggedOut() {
        console.log('🔒 Usuário deslogado');
        this.user = null;
        this.updateUI(null);
    }

    updateUI(user) {
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');
        const userName = document.getElementById('user-name');
        const userAvatar = document.getElementById('user-avatar');

        if (user) {
            // Usuário logado
            if (loginBtn) loginBtn.style.display = 'none';
            if (userInfo) userInfo.style.display = 'flex';
            
            if (userName) {
                userName.textContent = user.displayName || user.email.split('@')[0];
            }
            
            if (userAvatar && user.photoURL) {
                userAvatar.src = user.photoURL;
                userAvatar.style.display = 'block';
            }
        } else {
            // Usuário não logado
            if (loginBtn) loginBtn.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';
        }
    }

    async signOut() {
        try {
            await firebase.auth().signOut();
            console.log('✅ Logout realizado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao fazer logout:', error);
        }
    }

    checkAuthState() {
        const user = firebase.auth().currentUser;
        if (user) {
            this.handleUserLoggedIn(user);
        } else {
            this.handleUserLoggedOut();
        }
    }

    getUserData() {
        try {
            const userData = localStorage.getItem('garagem67_user_data');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('❌ Erro ao carregar dados do usuário:', error);
            return null;
        }
    }

    saveUserData(userData) {
        try {
            localStorage.setItem('garagem67_user_data', JSON.stringify(userData));
            console.log('💾 Dados do usuário salvos:', userData);
        } catch (error) {
            console.error('❌ Erro ao salvar dados do usuário:', error);
        }
    }

    showLoginError(message) {
        alert(message);
    }
}

// Configurar logout
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (window.authService) {
                window.authService.signOut();
            }
        });
    }
});

// Inicializar serviço de autenticação
document.addEventListener('DOMContentLoaded', function() {
    window.authService = new AuthService();
});
