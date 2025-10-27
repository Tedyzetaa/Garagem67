// menu.js - Sistema de menu para Garagem67
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
        // Dados de exemplo do menu
        this.menuItems = [
            // Bebidas
            {
                id: 'bebida-1',
                name: 'Coca-Cola 2L',
                price: 12.00,
                image: '/img/coca-cola.jpg',
                category: 'bebidas',
                description: 'Refrigerante Coca-Cola 2 litros'
            },
            {
                id: 'bebida-2',
                name: 'Guaraná Antarctica 2L',
                price: 10.00,
                image: '/img/guarana.jpg',
                category: 'bebidas',
                description: 'Refrigerante Guaraná Antarctica 2 litros'
            },
            {
                id: 'bebida-3',
                name: 'Água Mineral 500ml',
                price: 3.00,
                image: '/img/agua.jpg',
                category: 'bebidas',
                description: 'Água mineral sem gás 500ml'
            },
            {
                id: 'bebida-4',
                name: 'Suco de Laranja 1L',
                price: 8.00,
                image: '/img/suco-laranja.jpg',
                category: 'bebidas',
                description: 'Suco natural de laranja 1 litro'
            },

            // Comidas
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
            {
                id: 'comida-3',
                name: 'Pizza Calabresa',
                price: 45.00,
                image: '/img/pizza-calabresa.jpg',
                category: 'comidas',
                description: 'Pizza de calabresa com mussarela'
            },
            {
                id: 'comida-4',
                name: 'Esfiha de Carne',
                price: 5.00,
                image: '/img/esfiha.jpg',
                category: 'comidas',
                description: 'Esfiha aberta de carne'
            },

            // Drinks
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
            },
            {
                id: 'drink-3',
                name: 'Sex on the Beach',
                price: 25.00,
                image: '/img/sex-beach.jpg',
                category: 'drinks',
                description: 'Drink com vodka e sucos tropicais'
            },
            {
                id: 'drink-4',
                name: 'Margarita',
                price: 20.00,
                image: '/img/margarita.jpg',
                category: 'drinks',
                description: 'Margarita clássica com tequila'
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