// menu.js - Sistema de cardápio interativo
class MenuManager {
    constructor() {
        this.categories = {
            bebidas: [
                {
                    id: "1",
                    name: "HEINEKEN LONG NECK",
                    description: "Cerveja premium holandesa",
                    price: 12.00,
                    category: "bebidas"
                },
                {
                    id: "2", 
                    name: "BUDWEISER LONG NECK",
                    description: "Cerveja americana premium",
                    price: 10.00,
                    category: "bebidas"
                },
                {
                    id: "3",
                    name: "CORONA EXTRA",
                    description: "Cerveja mexicana com limão",
                    price: 15.90,
                    category: "bebidas"
                },
                {
                    id: "4",
                    name: "BECKS",
                    description: "Cerveja alemã puro malte",
                    price: 14.90,
                    category: "bebidas"
                },
                {
                    id: "5",
                    name: "SPATEN",
                    description: "Cerveja alemã clássica",
                    price: 13.90,
                    category: "bebidas"
                },
                {
                    id: "6",
                    name: "STELLA ARTOIS",
                    description: "Cerveja belga premium",
                    price: 14.90,
                    category: "bebidas"
                }
            ],
            comidas: [
                {
                    id: "7",
                    name: "PORÇÃO DE BATATA FRITA",
                    description: "Batata frita crocante com ervas",
                    price: 25.00,
                    category: "comidas"
                },
                {
                    id: "8",
                    name: "PORÇÃO DE MANDIOCA",
                    description: "Mandioca frita com queijo coalho",
                    price: 28.00,
                    category: "comidas"
                },
                {
                    id: "9",
                    name: "PORÇÃO DE FRANGO A PASSARINHO",
                    description: "Frango empanado crocante",
                    price: 35.00,
                    category: "comidas"
                },
                {
                    id: "10",
                    name: "PORÇÃO DE CALABRESA ACEBOLADA",
                    description: "Calabresa grelhada com cebola",
                    price: 30.00,
                    category: "comidas"
                }
            ],
            drinks: [
                {
                    id: "11",
                    name: "CAIPIRINHA DE VODKA",
                    description: "Vodka, limão, açúcar e gelo",
                    price: 18.00,
                    category: "drinks"
                },
                {
                    id: "12",
                    name: "MOJITO",
                    description: "Rum, hortelã, limão e açúcar",
                    price: 22.00,
                    category: "drinks"
                },
                {
                    id: "13",
                    name: "COSMOPOLITAN",
                    description: "Vodka, licor de laranja e cranberry",
                    price: 25.00,
                    category: "drinks"
                },
                {
                    id: "14",
                    name: "NEGRONI",
                    description: "Gin, vermute e Campari",
                    price: 28.00,
                    category: "drinks"
                },
                {
                    id: "15",
                    name: "MARGARITA",
                    description: "Tequila, licor de laranja e limão",
                    price: 24.00,
                    category: "drinks"
                },
                {
                    id: "16",
                    name: "PIÑA COLADA",
                    description: "Rum, leite de coco e abacaxi",
                    price: 26.00,
                    category: "drinks"
                }
            ]
        };
        
        this.currentCategory = 'bebidas';
        this.itemQuantities = {}; // Controlar quantidades por item
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
            container.innerHTML = '<div class="empty-menu">Nenhum item disponível nesta categoria</div>';
            return;
        }

        container.innerHTML = items.map(item => {
            const quantity = this.getItemQuantity(item.id);
            return `
                <div class="menu-item" data-id="${item.id}">
                    <div class="item-info">
                        <h3 class="item-name">${item.name}</h3>
                        <p class="item-description">${item.description}</p>
                        <p class="item-price">R$ ${item.price.toFixed(2)}</p>
                    </div>
                    <div class="item-controls">
                        <div class="quantity-controls">
                            <button class="qty-btn minus" onclick="menuManager.decreaseQuantity('${item.id}')">-</button>
                            <span class="quantity">${quantity}</span>
                            <button class="qty-btn plus" onclick="menuManager.increaseQuantity('${item.id}')">+</button>
                        </div>
                        <button class="add-btn ${quantity > 0 ? 'active' : ''}" 
                                onclick="menuManager.addToCart('${item.id}')"
                                ${quantity === 0 ? 'disabled' : ''}>
                            ${quantity > 0 ? `Adicionar (${quantity})` : 'Adicionar'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        console.log(`📦 ${items.length} itens carregados na categoria ${category}`);
    }

    getItemQuantity(itemId) {
        return this.itemQuantities[itemId] || 0;
    }

    increaseQuantity(itemId) {
        const currentQty = this.getItemQuantity(itemId);
        if (currentQty < 10) {
            this.itemQuantities[itemId] = currentQty + 1;
            this.updateItemDisplay(itemId);
        }
    }

    decreaseQuantity(itemId) {
        const currentQty = this.getItemQuantity(itemId);
        if (currentQty > 0) {
            this.itemQuantities[itemId] = currentQty - 1;
            this.updateItemDisplay(itemId);
        }
    }

    updateItemDisplay(itemId) {
        const itemElement = document.querySelector(`.menu-item[data-id="${itemId}"]`);
        if (!itemElement) return;

        const quantity = this.getItemQuantity(itemId);
        const quantityDisplay = itemElement.querySelector('.quantity');
        const addButton = itemElement.querySelector('.add-btn');

        if (quantityDisplay) {
            quantityDisplay.textContent = quantity;
        }

        if (addButton) {
            if (quantity > 0) {
                addButton.textContent = `Adicionar (${quantity})`;
                addButton.classList.add('active');
                addButton.disabled = false;
            } else {
                addButton.textContent = 'Adicionar';
                addButton.classList.remove('active');
                addButton.disabled = true;
            }
        }
    }

    addToCart(itemId) {
        const item = this.findItemById(itemId);
        const quantity = this.getItemQuantity(itemId);

        if (!item || quantity === 0) {
            console.log('❌ Nenhuma quantidade selecionada para:', item?.name);
            return;
        }

        console.log('🛒 Adicionando ao carrinho:', item.name, 'x', quantity);
        
        // Disparar evento para o CartManager
        const addToCartEvent = new CustomEvent('addToCart', {
            detail: {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: quantity
            }
        });
        document.dispatchEvent(addToCartEvent);

        // Resetar quantidade após adicionar
        this.itemQuantities[itemId] = 0;
        this.updateItemDisplay(itemId);

        // Feedback visual
        this.showAddToCartFeedback(item.name, quantity);
    }

    findItemById(itemId) {
        for (const category of Object.values(this.categories)) {
            const item = category.find(item => item.id === itemId);
            if (item) return item;
        }
        return null;
    }

    showAddToCartFeedback(itemName, quantity) {
        // Criar elemento de feedback
        const feedback = document.createElement('div');
        feedback.className = 'add-to-cart-feedback';
        feedback.innerHTML = `
            <span>✅ ${quantity}x ${itemName} adicionado ao carrinho!</span>
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
}

// CSS para o menu
const menuStyles = `
.menu-item {
    background: #2a2a2a;
    border: 1px solid #d4af37;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
}

.menu-item:hover {
    border-color: #f1c40f;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
}

.item-info {
    flex: 1;
}

.item-name {
    color: #d4af37;
    font-size: 1.2em;
    margin: 0 0 8px 0;
    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.item-description {
    color: #cccccc;
    margin: 0 0 8px 0;
    font-size: 0.9em;
}

.item-price {
    color: #ffffff;
    font-size: 1.3em;
    font-weight: bold;
    margin: 0;
}

.item-controls {
    display: flex;
    align-items: center;
    gap: 15px;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.qty-btn {
    background: #d4af37;
    color: #1a1a1a;
    border: none;
    border-radius: 4px;
    width: 30px;
    height: 30px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.qty-btn:hover {
    background: #f1c40f;
    transform: scale(1.1);
}

.qty-btn:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
}

.quantity {
    color: #ffffff;
    font-weight: bold;
    min-width: 20px;
    text-align: center;
}

.add-btn {
    background: #333;
    color: #888;
    border: 1px solid #555;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: not-allowed;
    transition: all 0.3s ease;
    font-weight: bold;
}

.add-btn.active {
    background: #d4af37;
    color: #1a1a1a;
    border-color: #d4af37;
    cursor: pointer;
}

.add-btn.active:hover {
    background: #f1c40f;
    transform: scale(1.05);
}

.empty-menu {
    text-align: center;
    color: #888;
    font-style: italic;
    padding: 40px 20px;
    font-size: 1.1em;
}

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
}

.add-to-cart-feedback.show {
    transform: translateX(0);
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