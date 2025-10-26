// Gerenciador do Carrinho - Versão com Configuração Centralizada
class CartManager {
    constructor() {
        this.cart = [];
        this.init();
    }

    init() {
        console.log('🛒 Inicializando CartManager...');
        this.loadCartFromStorage();
        this.setupEventListeners();
        this.updateCartDisplay();
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('garagem67_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            console.log('📦 Carrinho carregado:', this.cart);
        }
    }

    saveCartToStorage() {
        localStorage.setItem('garagem67_cart', JSON.stringify(this.cart));
    }

    setupEventListeners() {
        console.log('🔧 Configurando event listeners...');
        
        // Evento para adicionar itens ao carrinho
        document.addEventListener('addToCart', (e) => {
            console.log('🎯 Evento addToCart recebido:', e.detail);
            this.addToCart(e.detail);
        });

        // Botão limpar carrinho
        const clearCartBtn = document.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                console.log('🗑️ Limpar carrinho clicado');
                this.clearCart();
            });
        } else {
            console.error('❌ Botão clear-cart não encontrado');
        }

        // BOTÃO FINALIZAR PEDIDO
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            console.log('✅ Botão checkout-btn encontrado, adicionando listener...');
            checkoutBtn.addEventListener('click', (e) => {
                console.log('🎯🎯🎯 BOTÃO FINALIZAR PEDIDO CLICADO!');
                e.preventDefault();
                e.stopPropagation();
                this.handleCheckout();
            });
            
            // Também adicionar via onclick como fallback
            checkoutBtn.onclick = (e) => {
                console.log('🎯🎯🎯 BOTÃO FINALIZAR PEDIDO CLICADO (onclick)!');
                e.preventDefault();
                e.stopPropagation();
                this.handleCheckout();
                return false;
            };
        } else {
            console.error('❌❌❌ Botão checkout-btn NÃO ENCONTRADO no DOM');
        }

        // Adicionar listener global para debug
        document.addEventListener('click', (e) => {
            if (e.target.id === 'checkout-btn' || e.target.closest('#checkout-btn')) {
                console.log('🔍 Click global capturado no checkout-btn');
            }
        });
    }

    // FLUXO PRINCIPAL DE CHECKOUT
    handleCheckout() {
        console.log('🛒 Iniciando handleCheckout...');
        
        // Verifica se há itens no carrinho
        if (this.cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        console.log('📋 Itens no carrinho:', this.cart);

        // Verifica se usuário está logado
        const user = firebase.auth().currentUser;
        if (!user) {
            console.log('🔐 Usuário não logado, abrindo modal de login...');
            alert('⚠️ Por favor, faça login para continuar com o pedido.');
            if (window.authService) {
                window.authService.openLoginModal();
            }
            return;
        }

        console.log('👤 Usuário logado:', user.email);
        
        // Verifica dados do usuário
        this.checkUserDataAndProceed(user);
    }

    // Verifica dados e procede
    async checkUserDataAndProceed(user) {
        try {
            console.log('📦 Verificando dados do usuário...');
            
            // Carrega dados salvos
            const savedUserData = localStorage.getItem('garagem67_user_data');
            let userData = savedUserData ? JSON.parse(savedUserData) : {};
            
            console.log('📄 Dados do usuário encontrados:', userData);

            // Verifica se tem dados completos
            const hasCompleteData = userData.nome && userData.telefone && userData.endereco;
            
            if (hasCompleteData) {
                console.log('✅ Dados completos, enviando direto para WhatsApp');
                this.sendOrderToWhatsApp(userData);
            } else {
                console.log('📝 Dados incompletos, abrindo modal de endereço');
                this.openAddressModal(user);
            }
            
        } catch (error) {
            console.error('❌ Erro ao verificar dados:', error);
            this.openAddressModal(user);
        }
    }

    // Abre modal de endereço
    openAddressModal(user = null) {
        console.log('📋 Abrindo modal de endereço...');
        
        const modal = document.getElementById('address-modal');
        if (!modal) {
            console.error('❌ Modal de endereço não encontrado');
            return;
        }

        // Preenche com dados existentes
        if (window.orderService) {
            window.orderService.fillAddressForm();
        }

        modal.style.display = 'block';
        
        // Configurar evento do formulário
        const addressForm = document.getElementById('address-form');
        if (addressForm) {
            // Remove event listeners antigos
            addressForm.replaceWith(addressForm.cloneNode(true));
            
            // Adiciona novo listener
            document.getElementById('address-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitAddressAndOrder();
            });
        }
    }

    // Envia pedido para WhatsApp
    sendOrderToWhatsApp(userData) {
        console.log('📤 Enviando pedido para WhatsApp...');
        
        // ⭐ USA A CONFIGURAÇÃO GLOBAL ⭐
        const whatsappConfig = window.appConfig?.whatsappNumber ? window.appConfig : { whatsappNumber: '556799998888' };
        const phoneNumber = whatsappConfig.whatsappNumber;
        
        console.log('📞 Usando número do WhatsApp:', phoneNumber);
        
        let message = `*🛵 NOVO PEDIDO - GARAGEM 67*%0A%0A`;
        message += `*Cliente:* ${userData.nome}%0A`;
        message += `*Telefone:* ${userData.telefone}%0A`;
        message += `*Email:* ${userData.email || 'Não informado'}%0A%0A`;
        
        message += `*📍 ENDEREÇO DE ENTREGA*%0A`;
        message += `${userData.endereco}%0A`;
        message += `${userData.cidade} - ${userData.estado}%0A`;
        message += `CEP: ${userData.cep}%0A`;
        if (userData.complemento) {
            message += `Complemento: ${userData.complemento}%0A`;
        }
        message += `%0A`;

        message += `*🛒 PEDIDO*%0A`;
        this.cart.forEach(item => {
            message += `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}%0A`;
        });
        
        message += `%0A`;
        message += `*💰 TOTAL: R$ ${this.calculateTotal().toFixed(2)}*%0A%0A`;
        message += `*⏰ Horário do pedido:* ${new Date().toLocaleString('pt-BR')}%0A`;
        message += `*📱 Via: Site Garagem 67*`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

        console.log('🔗 URL WhatsApp:', whatsappUrl);
        
        // Abre WhatsApp e limpa carrinho
        window.open(whatsappUrl, '_blank');
        this.clearCart();
        
        this.showOrderConfirmation();
    }

    submitAddressAndOrder() {
        console.log('✅ Confirmando endereço...');
        
        const submitBtn = document.querySelector('#address-modal .btn-primary');
        const originalText = submitBtn.textContent;
        
        // Feedback visual de loading
        submitBtn.textContent = 'Processando...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        // Pequeno delay para melhor UX
        setTimeout(() => {
            const addressData = {
                nome: document.getElementById('address-nome').value,
                telefone: document.getElementById('address-telefone').value,
                endereco: document.getElementById('address-endereco').value,
                cidade: document.getElementById('address-cidade').value,
                estado: document.getElementById('address-estado').value,
                cep: document.getElementById('address-cep').value,
                complemento: document.getElementById('address-complemento').value
            };

            // Validar campos
            if (!addressData.nome || !addressData.telefone || !addressData.endereco) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                
                // Restaurar botão
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                return;
            }

            // Salvar dados
            if (window.orderService) {
                window.orderService.saveUserData(addressData);
            } else {
                localStorage.setItem('garagem67_user_data', JSON.stringify(addressData));
            }

            // Fechar modal e enviar
            this.closeAddressModal();
            this.sendOrderToWhatsApp(addressData);
            
            // Restaurar botão
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            
        }, 1000);
    }

    closeAddressModal() {
        const modal = document.getElementById('address-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // ... (outros métodos do carrinho permanecem iguais)
    addToCart({ id, name, price, quantity }) {
        const existingItem = this.cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({ id, name, price, quantity });
        }
        
        this.updateCart();
        this.showNotification(`${name} (${quantity}x) adicionado ao carrinho!`);
    }

    removeFromCart(id) {
        const itemIndex = this.cart.findIndex(item => item.id === id);
        
        if (itemIndex !== -1) {
            const itemName = this.cart[itemIndex].name;
            this.cart.splice(itemIndex, 1);
            this.updateCart();
            this.showNotification(`${itemName} removido do carrinho!`);
        }
    }

    updateCartItemQuantity(id, change) {
        const item = this.cart.find(item => item.id === id);
        
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                this.removeFromCart(id);
            } else {
                this.updateCart();
            }
        }
    }

    clearCart() {
        if (this.cart.length > 0) {
            if (confirm('Tem certeza que deseja limpar o carrinho?')) {
                this.cart = [];
                this.updateCart();
                this.showNotification('Carrinho limpo!');
            }
        } else {
            this.showNotification('O carrinho já está vazio!');
        }
    }

    updateCart() {
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.updateCheckoutButton();
    }

    updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        
        if (!cartItemsContainer || !cartTotalElement) return;
        
        cartItemsContainer.innerHTML = '';
        
        let total = 0;
        
        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">Nenhum item adicionado ao carrinho</div>';
        } else {
            this.cart.forEach(item => {
                total += item.price * item.quantity;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${this.formatPrice(item.price)}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase" data-id="${item.id}">+</button>
                        <button class="remove" data-id="${item.id}" style="margin-left: 10px;">×</button>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItemElement);
            });
            
            this.setupCartItemControls();
        }
        
        cartTotalElement.textContent = this.formatPrice(total);
    }

    setupCartItemControls() {
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.updateCartItemQuantity(id, -1);
            });
        });
        
        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.updateCartItemQuantity(id, 1);
            });
        });
        
        document.querySelectorAll('.remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.removeFromCart(id);
            });
        });
    }

    updateCheckoutButton() {
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
        }
    }

    calculateTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    showOrderConfirmation() {
        alert('✅ Pedido enviado com sucesso!\\n\\nAgora é só aguardar que entraremos em contato para confirmar seu pedido.');
    }

    showNotification(message) {
        console.log('📢 ' + message);
    }

    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }

    getCartItems() {
        return this.cart;
    }

    getTotal() {
        return this.calculateTotal();
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.cartService = new CartManager();
    console.log('🛒 Serviço de carrinho inicializado');
});