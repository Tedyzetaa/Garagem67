// Gerenciador do Menu
class MenuManager {
    constructor(menuData) {
        this.menuData = menuData;
        this.currentCategory = 'bebidas';
        this.init();
    }

    init() {
        this.renderMenu();
        this.setupEventListeners();
    }

    renderMenu() {
        const container = document.getElementById('menu-items-container');
        if (!container) return;

        let html = '';
        
        // Renderizar cada categoria
        for (const [category, items] of Object.entries(this.menuData)) {
            const isActive = category === this.currentCategory ? 'active' : '';
            
            html += `
                <div id="${category}" class="menu-category ${isActive}">
                    ${items.map(item => this.renderMenuItem(item)).join('')}
                </div>
            `;
        }
        
        container.innerHTML = html;
    }

    renderMenuItem(item) {
        return `
            <div class="menu-item">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <span class="price">${app.formatPrice(item.price)}</span>
                </div>
                <div class="item-controls">
                    <div class="quantity-selector">
                        <button class="qty-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="qty-input" data-id="${item.id}" value="1" min="1" max="10">
                        <button class="qty-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="btn-add" 
                            data-id="${item.id}" 
                            data-name="${item.name}" 
                            data-price="${item.price}">
                        Adicionar
                    </button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Navegação entre categorias
        document.querySelectorAll('.menu-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchCategory(e.target.getAttribute('data-category'));
            });
        });

        // Controles de quantidade
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('qty-btn')) {
                this.handleQuantityChange(e.target);
            }
            
            if (e.target.classList.contains('btn-add')) {
                this.handleAddToCart(e.target);
            }
        });

        // Input de quantidade manual
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('qty-input')) {
                this.validateQuantityInput(e.target);
            }
        });
    }

    switchCategory(category) {
        this.currentCategory = category;
        
        // Atualizar abas
        document.querySelectorAll('.menu-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Atualizar categorias
        document.querySelectorAll('.menu-category').forEach(cat => {
            cat.classList.remove('active');
        });
        document.getElementById(category).classList.add('active');
    }

    handleQuantityChange(button) {
        const isPlus = button.classList.contains('plus');
        const id = button.getAttribute('data-id');
        const input = document.querySelector(`.qty-input[data-id="${id}"]`);
        
        if (!input) return;
        
        let value = parseInt(input.value) || 1;
        
        if (isPlus) {
            value = Math.min(10, value + 1);
        } else {
            value = Math.max(1, value - 1);
        }
        
        input.value = value;
        this.updateQuantityButtons(id, value);
    }

    validateQuantityInput(input) {
        let value = parseInt(input.value) || 1;
        value = Math.max(1, Math.min(10, value));
        input.value = value;
        
        const id = input.getAttribute('data-id');
        this.updateQuantityButtons(id, value);
    }

    updateQuantityButtons(id, value) {
        const minusBtn = document.querySelector(`.qty-btn.minus[data-id="${id}"]`);
        const plusBtn = document.querySelector(`.qty-btn.plus[data-id="${id}"]`);
        
        if (minusBtn) minusBtn.disabled = value <= 1;
        if (plusBtn) plusBtn.disabled = value >= 10;
    }

    handleAddToCart(button) {
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const quantityInput = document.querySelector(`.qty-input[data-id="${id}"]`);
        const quantity = parseInt(quantityInput?.value) || 1;
        
        // Disparar evento customizado para o carrinho
        const event = new CustomEvent('addToCart', {
            detail: { id, name, price, quantity }
        });
        document.dispatchEvent(event);
        
        // Resetar quantidade
        if (quantityInput) {
            quantityInput.value = 1;
            this.updateQuantityButtons(id, 1);
        }
        
        app.showNotification(`${name} (${quantity}x) adicionado ao carrinho!`);
    }
}