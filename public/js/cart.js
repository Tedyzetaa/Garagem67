// cart.js - Sistema completo de carrinho de compras
class CartManager {
    constructor() {
        this.cart = [];
        this.init();
    }

    init() {
        console.log('🛒 Inicializando CartManager...');
        this.loadCart();
        this.setupEventListeners();
        this.updateCartDisplay();
    }

    loadCart() {
        try {
            const savedCart = localStorage.getItem('garagem67_cart');
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
                console.log('📦 Carrinho carregado:', this.cart);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar carrinho:', error);
            this.cart = [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('garagem67_cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('❌ Erro ao salvar carrinho:', error);
        }
    }

    setupEventListeners() {
        console.log('🔧 Configurando event listeners...');
        
        // Eventos personalizados para adicionar itens
        document.addEventListener('addToCart', (event) => {
            console.log('🎯 Evento addToCart recebido:', event.detail);
            this.addItem(event.detail);
        });

        // Botão finalizar pedido
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            console.log('✅ Botão checkout-btn encontrado, adicionando listener...');
            checkoutBtn.addEventListener('click', () => {
                console.log('🎯🎯🎯 BOTÃO FINALIZAR PEDIDO CLICADO!');
                this.handleCheckout();
            });
        } else {
            console.warn('⚠️ Botão checkout-btn não encontrado');
        }

        // Botão limpar carrinho
        const clearCartBtn = document.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                this.clearCart();
            });
        }
    }

    addItem(item) {
        const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            if (existingItem.quantity < 10) {
                existingItem.quantity += item.quantity;
                console.log(`📈 ${item.name} quantidade atualizada para: ${existingItem.quantity}`);
            } else {
                console.log(`⚠️ Limite máximo atingido para ${item.name}`);
                return;
            }
        } else {
            this.cart.push({...item});
            console.log(`📢 ${item.name} (${item.quantity}x) adicionado ao carrinho!`);
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showAddToCartNotification(item.name, item.quantity);
    }

    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(itemId, newQuantity) {
        if (newQuantity < 1) {
            this.removeItem(itemId);
            return;
        }
        
        if (newQuantity > 10) {
            newQuantity = 10;
        }
        
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    clearCart() {
        if (this.cart.length === 0) {
            return;
        }

        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartDisplay();
            console.log('🗑️ Carrinho limpo!');
        }
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    updateCartDisplay() {
        const cartItemsElement = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (!cartItemsElement) return;

        if (this.cart.length === 0) {
            cartItemsElement.innerHTML = '<div class="empty-cart-message">Nenhum item adicionado ao carrinho</div>';
            if (cartTotalElement) cartTotalElement.textContent = 'R$ 0,00';
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        // Habilitar botão de checkout
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
        }

        // Atualizar total
        if (cartTotalElement) {
            cartTotalElement.textContent = `R$ ${this.getTotal().toFixed(2)}`;
        }

        // Renderizar itens
        cartItemsElement.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">R$ ${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button class="remove-btn" onclick="cartManager.removeItem('${item.id}')">×</button>
                </div>
            </div>
        `).join('');
    }

    showAddToCartNotification(itemName, quantity) {
        // Criar notificação visual
        const notification = document.createElement('div');
        notification.className = 'add-to-cart-notification';
        notification.innerHTML = `
            <span>✅ ${quantity}x ${itemName} adicionado ao carrinho!</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animação
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    handleCheckout() {
        console.log('🛒 Iniciando handleCheckout...');
        
        // Verificar se há itens no carrinho
        if (this.cart.length === 0) {
            alert('🛒 Seu carrinho está vazio! Adicione itens antes de finalizar o pedido.');
            return;
        }

        console.log('📋 Itens no carrinho:', this.cart);
        
        // Verificar se usuário está logado
        const user = firebase.auth().currentUser;
        console.log('👤 Status do usuário:', user ? 'Logado' : 'Não logado');
        
        if (!user) {
            console.log('🔐 Usuário não logado, abrindo modal de login...');
            this.openLoginModal();
            return;
        }

        // Usuário está logado, prosseguir para endereço/pedido
        console.log('✅ Usuário logado, verificando dados...');
        this.proceedToAddressModal();
    }

    openLoginModal() {
        console.log('🔓 Abrindo modal de login...');
        
        // Disparar evento para abrir modal de login
        const loginEvent = new CustomEvent('openLoginModal');
        document.dispatchEvent(loginEvent);
    }

    proceedToAddressModal() {
        console.log('🏠 Abrindo modal de endereço...');
        
        // Verificar se já tem dados salvos
        const userData = this.getUserData();
        console.log('📦 Dados do usuário:', userData);
        
        if (userData && userData.nome && userData.telefone && userData.endereco) {
            console.log('✅ Dados completos encontrados, indo direto para WhatsApp');
            this.finalizeOrder(userData);
        } else {
            console.log('📝 Dados incompletos, abrindo modal de endereço');
            this.openAddressModal();
        }
    }

    openAddressModal() {
        const addressModal = document.getElementById('address-modal');
        if (addressModal) {
            addressModal.style.display = 'block';
            
            // Preencher com dados existentes se disponíveis
            const userData = this.getUserData();
            if (userData) {
                if (userData.nome) document.getElementById('address-nome').value = userData.nome;
                if (userData.telefone) document.getElementById('address-telefone').value = userData.telefone;
                if (userData.endereco) document.getElementById('address-endereco').value = userData.endereco;
                if (userData.cidade) document.getElementById('address-cidade').value = userData.cidade;
                if (userData.cep) document.getElementById('address-cep').value = userData.cep;
                if (userData.complemento) document.getElementById('address-complemento').value = userData.complemento;
            }
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
        } catch (error) {
            console.error('❌ Erro ao salvar dados do usuário:', error);
        }
    }

    finalizeOrder(userData) {
        console.log('✅ Finalizando pedido...', userData);
        
        // Preparar dados do pedido
        const orderData = {
            userName: userData.nome,
            userPhone: userData.telefone,
            userAddress: `${userData.endereco}, ${userData.cidade} - ${userData.estado}${userData.complemento ? ` (${userData.complemento})` : ''}`,
            items: this.formatOrderItems(),
            total: this.getTotal().toFixed(2),
            timestamp: new Date().toISOString()
        };

        console.log('📦 Dados do pedido:', orderData);
        
        // Abrir WhatsApp
        this.openWhatsApp(orderData);
        
        // Limpar carrinho após pedido
        this.clearCart();
    }

    formatOrderItems() {
        return this.cart.map(item => 
            `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');
    }

    openWhatsApp(orderData) {
        try {
            const message = `🛒 *PEDIDO - GARAGEM 67*\n\n` +
                           `*Cliente:* ${orderData.userName || 'Não informado'}\n` +
                           `*Telefone:* ${orderData.userPhone || 'Não informado'}\n` +
                           `*Endereço:* ${orderData.userAddress || 'Não informado'}\n\n` +
                           `*Itens do Pedido:*\n${orderData.items}\n\n` +
                           `*Total: R$ ${orderData.total}*\n\n` +
                           `_Pedido gerado via site Garagem 67_`;

            const whatsappNumber = window.appConfig?.whatsappNumber || '5567998668032';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
            
        } catch (error) {
            console.error('❌ Erro ao abrir WhatsApp:', error);
            alert('Erro ao abrir WhatsApp. Por favor, copie o pedido e envie manualmente.');
        }
    }

    handleAddressSubmit(event) {
        event.preventDefault();
        
        // Coletar dados do formulário
        const userData = {
            nome: document.getElementById('address-nome').value,
            telefone: document.getElementById('address-telefone').value,
            endereco: document.getElementById('address-endereco').value,
            cidade: document.getElementById('address-cidade').value,
            estado: document.getElementById('address-estado').value,
            cep: document.getElementById('address-cep').value,
            complemento: document.getElementById('address-complemento').value
        };

        // Validar dados obrigatórios
        if (!userData.nome || !userData.telefone || !userData.endereco) {
            alert('Por favor, preencha todos os campos obrigatórios (Nome, Telefone e Endereço).');
            return;
        }

        // Salvar dados
        this.saveUserData(userData);
        
        // Fechar modal
        const addressModal = document.getElementById('address-modal');
        if (addressModal) {
            addressModal.style.display = 'none';
        }
        
        // Finalizar pedido
        this.finalizeOrder(userData);
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.cartManager = new CartManager();
    
    // Configurar submit do formulário de endereço
    const addressForm = document.getElementById('address-form');
    if (addressForm) {
        addressForm.addEventListener('submit', function(event) {
            window.cartManager.handleAddressSubmit(event);
        });
    }
});

// CSS para notificações
(function() {
    const cartStyles = `
    .add-to-cart-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: #d4af37;
        color: #1a1a1a;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .add-to-cart-notification.show {
        transform: translateX(0);
    }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = cartStyles;
    document.head.appendChild(styleSheet);
})();