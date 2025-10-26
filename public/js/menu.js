// menu.js - Sistema de cardápio interativo
class MenuManager {
    constructor() {
        this.categories = {
            bebidas: [
                {
                    id: "1",
                    name: "HEINEKEN LONG NECK",
                    description: "Cerveja premium holandesa, sabor suave e refrescante",
                    price: 12.00,
                    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop",
                    category: "bebidas"
                },
                {
                    id: "2", 
                    name: "BUDWEISER LONG NECK",
                    description: "Cerveja americana, conhecida como a Rainha das Cervejas",
                    price: 10.00,
                    image: "https://images.unsplash.com/photo-1566633808645-73aaff1b6d99?w=400&h=300&fit=crop",
                    category: "bebidas"
                },
                {
                    id: "3",
                    name: "CORONA EXTRA",
                    description: "Cerveja mexicana leve e refrescante, ideal com limão",
                    price: 15.90,
                    image: "https://images.unsplash.com/photo-1586993456357-62daa76d6d39?w=400&h=300&fit=crop", 
                    category: "bebidas"
                },
                {
                    id: "4",
                    name: "BECKS",
                    description: "Cerveja alemã puro malte, sabor tradicional e encorpado",
                    price: 14.90,
                    image: "https://images.unsplash.com/photo-1618885472187-470dc06697b7?w=400&h=300&fit=crop",
                    category: "bebidas"
                },
                {
                    id: "5",
                    name: "SPATEN",
                    description: "Cerveja alemã clássica, sabor equilibrado e aromático",
                    price: 13.90,
                    image: "https://images.unsplash.com/photo-1571613316887-6f8d5c8117be?w=400&h=300&fit=crop",
                    category: "bebidas"
                },
                {
                    id: "6",
                    name: "STELLA ARTOIS",
                    description: "Cerveja belga premium, sabor refinado e elegante",
                    price: 14.90,
                    image: "https://images.unsplash.com/photo-1600788879271-6c969b4b570d?w=400&h=300&fit=crop",
                    category: "bebidas"
                }
            ],
            comidas: [
                {
                    id: "7",
                    name: "PORÇÃO DE BATATA FRITA",
                    description: "Batata frita crocante temperada com ervas finas",
                    price: 25.00,
                    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
                    category: "comidas"
                },
                {
                    id: "8",
                    name: "PORÇÃO DE MANDIOCA",
                    description: "Mandioca frita dourada com queijo coalho",
                    price: 28.00,
                    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop",
                    category: "comidas"
                },
                {
                    id: "9",
                    name: "PORÇÃO DE FRANGO A PASSARINHO",
                    description: "Pedaços de frango empanados e fritos, crocantes por fora e suculentos por dentro",
                    price: 35.00,
                    image: "https://images.unsplash.com/photo-1626645735736-86fea8a58fd8?w=400&h=300&fit=crop",
                    category: "comidas"
                },
                {
                    id: "10",
                    name: "PORÇÃO DE CALABRESA ACEBOLADA",
                    description: "Calabresa fatiada grelhada com cebolas em rodelas",
                    price: 30.00,
                    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
                    category: "comidas"
                }
            ],
            drinks: [
                {
                    id: "11",
                    name: "CAIPIRINHA DE VODKA",
                    description: "Tradicional caipirinha com vodka, limão, açúcar e gelo",
                    price: 18.00,
                    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop",
                    category: "drinks"
                },
                {
                    id: "12",
                    name: "MOJITO",
                    description: "Rum, limão, hortelã, açúcar e água com gás",
                    price: 22.00,
                    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop",
                    category: "drinks"
                },
                {
                    id: "13",
                    name: "COSMOPOLITAN",
                    description: "Vodka, licor de laranja, suco de cranberry e limão",
                    price: 25.00,
                    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop",
                    category: "drinks"
                },
                {
                    id: "14",
                    name: "NEGRONI",
                    description: "Gin, vermute tinto e Campari, clássico italiano",
                    price: 28.00,
                    image: "https://images.unsplash.com/photo-1570593742245-4b2c2b591b6b?w=400&h=300&fit=crop",
                    category: "drinks"
                },
                {
                    id: "15",
                    name: "MARGARITA",
                    description: "Tequila, licor de laranja e suco de limão, borda com sal",
                    price: 24.00,
                    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop",
                    category: "drinks"
                },
                {
                    id: "16",
                    name: "PIÑA COLADA",
                    description: "Rum, leite de coco e suco de abacaxi, drink tropical",
                    price: 26.00,
                    image: "https://images.unsplash.com/photo-1578024989063-ba516d26f760?w=400&h=300&fit=crop",
                    category: "drinks"
                }
            ]
        };
        
        this.currentCategory = 'bebidas';
        this.init();
    }

    init() {
        console.log('📋 Inicializando MenuManager...');
        this.setupEventListeners();
        this.loadMenu('bebidas');
    }

    setupEventListeners() {
        // Tabs do menu
        const menuTabs = document.querySelectorAll('.menu-tab');
        menuTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.getAttribute('data-category');
                this.switchCategory(category);
            });
        });

        // Evento personalizado para adicionar ao carrinho
        document.addEventListener('addToCartFromMenu', (event) => {
            this.addToCart(event.detail);
        });
    }

    switchCategory(category) {
        console.log(`🔄 Alternando para categoria: ${category}`);
        
        // Atualizar tabs ativas
        document.querySelectorAll('.menu-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Carregar menu da categoria
        this.loadMenu(category);
        this.currentCategory = category;
    }

    loadMenu(category) {
        const container = document.getElementById('menu-items-container');
        if (!container) return;

        const items = this.categories[category] || [];
        
        if (items.length === 0) {
            container.innerHTML = '<div class="empty-menu-message">Nenhum item disponível nesta categoria</div>';
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="menu-item" data-id="${item.id}">
                <div class="menu-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="menu-item-content">
                    <h3>${item.name}</h3>
                    <p class="menu-item-description">${item.description}</p>
                    <div class="menu-item-footer">
                        <span class="menu-item-price">R$ ${item.price.toFixed(2)}</span>
                        <button class="btn-add-to-cart" onclick="menuManager.addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                            <span class="btn-icon">+</span>
                            Adicionar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        console.log(`📦 ${items.length} itens carregados na categoria ${category}`);
    }

    addToCart(item) {
        console.log('🛒 Adicionando ao carrinho do menu:', item);
        
        // Disparar evento para o CartManager
        const addToCartEvent = new CustomEvent('addToCart', {
            detail: {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1
            }
        });
        document.dispatchEvent(addToCartEvent);

        // Feedback visual
        this.showAddToCartFeedback(item.name);
    }

    showAddToCartFeedback(itemName) {
        // Criar elemento de feedback
        const feedback = document.createElement('div');
        feedback.className = 'add-to-cart-feedback';
        feedback.innerHTML = `
            <span>✅ ${itemName} adicionado ao carrinho!</span>
        `;
        
        document.body.appendChild(feedback);
        
        // Animação
        setTimeout(() => {
            feedback.classList.add('show');
        }, 100);
        
        // Remover após 2 segundos
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 2000);
    }

    searchMenu(query) {
        if (!query.trim()) {
            this.loadMenu(this.currentCategory);
            return;
        }

        const allItems = Object.values(this.categories).flat();
        const filteredItems = allItems.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );

        const container = document.getElementById('menu-items-container');
        if (!container) return;

        if (filteredItems.length === 0) {
            container.innerHTML = `
                <div class="empty-search-message">
                    <p>Nenhum item encontrado para "${query}"</p>
                    <p>Tente outros termos ou volte ao menu principal</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredItems.map(item => `
            <div class="menu-item" data-id="${item.id}">
                <div class="menu-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="menu-item-content">
                    <h3>${item.name}</h3>
                    <p class="menu-item-description">${item.description}</p>
                    <div class="menu-item-footer">
                        <span class="menu-item-price">R$ ${item.price.toFixed(2)}</span>
                        <button class="btn-add-to-cart" onclick="menuManager.addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                            <span class="btn-icon">+</span>
                            Adicionar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// CSS para feedback visual
const menuStyles = `
.add-to-cart-feedback {
    position: fixed;
    top: 100px;
    right: 20px;
    background: #d4af37;
    color: #1a1a1a;
    padding: 12px 18px;
    border-radius: 6px;
    font-weight: bold;
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    font-size: 14px;
}

.add-to-cart-feedback.show {
    transform: translateX(0);
}

.empty-menu-message,
.empty-search-message {
    text-align: center;
    padding: 40px 20px;
    color: #888;
    font-style: italic;
}

.empty-search-message p:first-child {
    font-weight: bold;
    margin-bottom: 8px;
}
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = menuStyles;
document.head.appendChild(styleSheet);

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.menuManager = new MenuManager();
    console.log('📋 Sistema de menu inicializado');
});