// app.js - Inicialização geral da aplicação com configurações globais
class App {
    constructor() {
        this.config = {
            whatsappNumber: '556799998888', // ⭐ NÚMERO DO WHATSAPP - ALTERE AQUI ⭐
            whatsappMessage: {
                prefix: '*🛵 NOVO PEDIDO - GARAGEM 67*',
                suffix: '*📱 Via: Site Garagem 67*'
            },
            firebase: {
                apiKey: "AIzaSyBbgzZ21aPFHmeoeahk40eMllzEfCcI7BQ",
                authDomain: "garagem67-c38cf.firebaseapp.com",
                projectId: "garagem67-c38cf",
                storageBucket: "garagem67-c38cf.appspot.com",
                messagingSenderId: "579533283807"
            }
        };
        
        this.init();
    }

    init() {
        console.log('🚀 Inicializando Garagem 67...');
        console.log('📞 WhatsApp Configurado:', this.config.whatsappNumber);
        
        // Tornar config global
        window.appConfig = this.config;
        
        // Debug: Verificar se elementos existem
        setTimeout(() => {
            this.debugElements();
        }, 1000);
        
        this.waitForFirebase().then(() => {
            console.log('✅ Aplicação inicializada com sucesso!');
        }).catch(error => {
            console.error('❌ Erro ao inicializar aplicação:', error);
        });
    }

    debugElements() {
        console.log('🔍 DEBUG - Verificando elementos no DOM:');
        console.log('📍 checkout-btn:', document.getElementById('checkout-btn'));
        console.log('📍 cart-items:', document.getElementById('cart-items'));
        console.log('📍 address-modal:', document.getElementById('address-modal'));
        
        // Verificar se há itens no carrinho
        const cart = localStorage.getItem('garagem67_cart');
        console.log('🛒 Carrinho no localStorage:', cart);
        
        // Verificar usuário logado
        const user = firebase.auth().currentUser;
        console.log('👤 Usuário Firebase:', user);
    }

    waitForFirebase() {
        return new Promise((resolve) => {
            const checkFirebase = () => {
                if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
                    resolve();
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };
            checkFirebase();
        });
    }
}

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', function() {
    window.app = new App();
});