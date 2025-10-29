// menu.js - Sistema de menu atualizado para Garagem67
class MenuManager {
    constructor() {
        this.menuItems = [];
        this.currentCategory = 'bebidas';
        this.init();
    }

    init() {
        console.log('📋 Inicializando MenuManager...');
        this.loadMenuItems();
        this.setupEventListeners();
        this.renderMenu();
    }

    loadMenuItems() {
        // Dados atualizados do menu com bebidas reais
        this.menuItems = [
            // Bebidas - Atualizadas com produtos reais
            {
                id: 'bebida-1',
                name: 'Heineken Long Neck',
                price: 12.00,
                image: '/img/heineken-longneck.jpg',
                category: 'bebidas',
                description: 'Cerveja Heineken 330ml'
            },
            {
                id: 'bebida-2',
                name: 'Budweiser Long Neck',
                price: 10.00,
                image: '/img/budweiser-longneck.jpg',
                category: 'bebidas',
                description: 'Cerveja Budweiser 330ml'
            },
            {
                id: 'bebida-3',
                name: 'Corona Extra',
                price: 15.90,
                image: '/img/corona-extra.jpg',
                category: 'bebidas',
                description: 'Cerveja Corona Extra 330ml'
            },
            {
                id: 'bebida-4',
                name: 'Becks',
                price: 14.90,
                image: '/img/becks.jpg',
                category: 'bebidas',
                description: 'Cerveja Becks 330ml'
            },
            {
                id: 'bebida-5',
                name: 'Spaten',
                price: 13.90,
                image: '/img/spaten.jpg',
                category: 'bebidas',
                description: 'Cerveja Spaten 330ml'
            },
            {
                id: 'bebida-6',
                name: 'Stella Artois',
                price: 14.90,
                image: '/img/stella-artois.jpg',
                category: 'bebidas',
                description: 'Cerveja Stella Artois 330ml'
            },

            // Comidas (mantidas como exemplo)
            {
                id: 'comida-1',
                name: 'Batata Frita',
                price: 15.00,
                image: '/img/batata-frita.jpg',
                category: 'comidas',
                description: 'Porção de batata frita crocante'
            },
            {
                id: 'comida-2',
                name: 'Hambúrguer Artesanal',
                price: 25.00,
                image: '/img/hamburguer.jpg',
                category: 'comidas',
                description: 'Hambúrguer com queijo, alface e tomate'
            },

            // Drinks (mantidos como exemplo)
            {
                id: 'drink-1',
                name: 'Caipirinha',
                price: 18.00,
                image: '/img/caipirinha.jpg',
                category: 'drinks',
                description: 'Caipirinha tradicional com limão'
            },
            {
                id: 'drink-2',
                name: 'Mojito',
                price: 22.00,
                image: '/img/mojito.jpg',
                category: 'drinks',
                description: 'Mojito com hortelã e limão'
            }
        ];

        console.log('📦 Itens do menu carregados:', this.menuItems.length);
    }

    setupEventListeners() {
        // Tabs do menu
        const menuTabs = document.querySelectorAll('.menu-tab');
        menuTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.switchCategory(category);
            });
        });

        console.log('✅ Event listeners do menu configurados');
    }

    switchCategory(category) {
        console.log('🔄 Mudando para categoria:', category);
        
        // Atualizar tabs ativas
        document.querySelectorAll('.menu-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.currentCategory = category;
        this.renderMenu();
    }

    renderMenu() {
        const container = document.getElementById('menu-items-container');
        if (!container) {
            console.error('❌ Container do menu não encontrado');
            return;
        }

        const filteredItems = this.menuItems.filter(item => item.category === this.currentCategory);
        
        console.log(`🎨 Renderizando ${filteredItems.length} itens da categoria ${this.currentCategory}`);

        if (filteredItems.length === 0) {
            container.innerHTML = `
                <div class="empty-category-message">
                    <p>🎯 Em breve nesta categoria!</p>
                    <p>Estamos preparando novidades incríveis para você.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredItems.map(item => `
            <div class="menu-item" data-id="${item.id}">
                <div class="menu-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='/img/placeholder.jpg'">
                </div>
                <div class="menu-item-info">
                    <h3>${item.name}</h3>
                    <p class="menu-item-description">${item.description}</p>
                    <p class="menu-item-price">R$ ${item.price.toFixed(2)}</p>
                </div>
                <div class="menu-item-actions">
                    <button class="btn-add-cart" onclick="window.menuManager.addToCart('${item.id}')">
                        <span class="btn-icon">🛒</span>
                        Adicionar
                    </button>
                </div>
            </div>
        `).join('');

        console.log('✅ Menu renderizado com sucesso');
    }

    addToCart(itemId) {
        console.log('➕ Tentando adicionar item ao carrinho:', itemId);
        
        const item = this.menuItems.find(i => i.id === itemId);
        if (!item) {
            console.error('❌ Item não encontrado:', itemId);
            return;
        }

        console.log('📦 Item encontrado:', item);

        // Disparar evento para o carrinho
        const event = new CustomEvent('addToCart', {
            detail: {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1,
                image: item.image
            }
        });
        
        console.log('🎯 Disparando evento addToCart:', event.detail);
        document.dispatchEvent(event);
    }

    getItemById(itemId) {
        return this.menuItems.find(item => item.id === itemId);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 Inicializando MenuManager...');
    window.menuManager = new MenuManager();
});