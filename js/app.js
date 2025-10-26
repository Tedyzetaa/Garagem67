// Arquivo principal - Inicialização da aplicação
class Garagem67App {
    constructor() {
        this.currentUser = null;
        this.cart = [];
        this.menuData = [];
        this.init();
    }

    async init() {
        console.log("🚀 Inicializando Garagem 67...");
        
        // Carregar dados iniciais
        await this.loadInitialData();
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Inicializar módulos
        this.initializeModules();
        
        console.log("✅ Aplicação inicializada com sucesso!");
    }

    async loadInitialData() {
        // Carregar usuário do localStorage
        this.loadUserFromStorage();
        
        // Carregar carrinho do localStorage
        this.loadCartFromStorage();
        
        // Carregar dados do menu
        this.menuData = await this.loadMenuData();
    }

    setupEventListeners() {
        // Smooth scroll para navegação
        this.setupSmoothScroll();
        
        // Eventos gerais
        this.setupGeneralEvents();
    }

    initializeModules() {
        // Inicializar módulos específicos
        if (typeof MenuManager !== 'undefined') {
            new MenuManager(this.menuData);
        }
        
        if (typeof CartManager !== 'undefined') {
            new CartManager();
        }
        
        if (typeof AuthManager !== 'undefined') {
            new AuthManager();
        }
        
        if (typeof OrdersManager !== 'undefined') {
            new OrdersManager();
        }
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupGeneralEvents() {
        // Fechar modais ao pressionar ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Prevenir envio de formulários com Enter
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.form) {
                e.preventDefault();
            }
        });
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal, .login-modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    loadUserFromStorage() {
        const savedUser = localStorage.getItem('garagem67_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    saveUserToStorage() {
        if (this.currentUser) {
            localStorage.setItem('garagem67_user', JSON.stringify(this.currentUser));
        }
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('garagem67_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    saveCartToStorage() {
        localStorage.setItem('garagem67_cart', JSON.stringify(this.cart));
    }

    async loadMenuData() {
        // Dados do menu - pode ser substituído por uma API
        return {
            bebidas: [
                { id: 1, name: "CERVEJA ARTESANAL", description: "Cerveja local, produção limitada", price: 12.00 },
                { id: 2, name: "WHISKY PREMIUM", description: "Escolha entre nossas marcas exclusivas", price: 25.00 },
                { id: 3, name: "VODKA IMPORTADA", description: "Diversas marcas premium disponíveis", price: 18.00 },
                { id: 4, name: "REFRIGERANTES", description: "Coca-Cola, Guaraná, Fanta e mais", price: 6.00 }
            ],
            comidas: [
                { id: 5, name: "HAMBÚRGUER GOURMET", description: "180g, queijo brie, rúcula e molho especial", price: 28.00 },
                { id: 6, name: "PORÇÃO DE BATATA", description: "Porção grande com queijo gratinado e bacon", price: 20.00 },
                { id: 7, name: "ASINHA DE FRANGO", description: "Porção com 8 unidades, molho barbecue da casa", price: 32.00 },
                { id: 8, name: "BRUSCHETTA ITALIANA", description: "Pão italiano, tomate, manjericão e azeite", price: 16.00 }
            ],
            drinks: [
                { id: 9, name: "CAIPIRINHA PREMIUM", description: "Limão siciliano, açúcar demerara e cachaça artesanal", price: 18.00 },
                { id: 10, name: "MOJITO CLÁSSICO", description: "Rum, hortelã fresca, limão e água com gás", price: 22.00 },
                { id: 11, name: "OLD FASHIONED", description: "Whisky, açúcar, bitter e twist de laranja", price: 28.00 },
                { id: 12, name: "NEGRONI", description: "Gin, vermute tinto e Campari", price: 26.00 }
            ]
        };
    }

    // Método utilitário para mostrar notificações
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Método para formatar preços
    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.app = new Garagem67App();
});