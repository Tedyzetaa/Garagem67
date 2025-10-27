// cart.js - Sistema completo de carrinho de compras com integração ao Entregadores67
class ExternalOrderService {
  constructor() {
    // ⭐ USA CONFIGURAÇÃO GLOBAL DO BACKEND
    this.apiUrl = window.appConfig?.backendUrl || 'https://entregador67-production.up.railway.app/api/external/orders';
    console.log('🔗 Conectando ao backend:', this.apiUrl);
  }

  async sendOrderToDeliverySystem(orderData) {
    try {
      console.log('📤 Enviando pedido para sistema de entregas...', orderData);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      // ⭐ MELHOR TRATAMENTO DE ERROS
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📨 Resposta do backend:', result);

      if (result.success) {
        console.log('✅ Pedido enviado para entregadores! ID:', result.order.internal_id);
        return {
          success: true,
          deliveryId: result.order.internal_id,
          externalId: result.order.external_id,
          message: result.message,
          trackingUrl: result.tracking_url
        };
      } else {
        console.warn('⚠️ Pedido não enviado para entregadores:', result.message);
        return {
          success: false,
          message: result.message || 'Erro desconhecido no backend'
        };
      }

    } catch (error) {
      console.error('❌ Erro ao enviar para entregadores:', error);
      return {
        success: false,
        message: `Erro de conexão: ${error.message}`
      };
    }
  }

  async checkOrderStatus(externalId) {
    try {
      const response = await fetch(`${this.apiUrl}/${externalId}`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      return result.success ? result.order : null;
    } catch (error) {
      console.error('❌ Erro ao verificar status:', error);
      return null;
    }
  }
}

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
                console.log('📦 Carrinho carregado:', this.cart.length, 'itens');
            } else {
                this.cart = [];
                console.log('🆕 Carrinho vazio - inicializando');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar carrinho:', error);
            this.cart = [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('garagem67_cart', JSON.stringify(this.cart));
            console.log('💾 Carrinho salvo:', this.cart.length, 'itens');
        } catch (error) {
            console.error('❌ Erro ao salvar carrinho:', error);
        }
    }

    setupEventListeners() {
        console.log('🔧 Configurando event listeners do carrinho...');
        
        // Evento personalizado para adicionar itens (do menu)
        document.addEventListener('addToCart', (event) => {
            console.log('🎯 Evento addToCart recebido:', event.detail);
            this.addItem(event.detail);
        });

        // Botão finalizar pedido
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            console.log('✅ Botão checkout-btn encontrado');
            checkoutBtn.addEventListener('click', () => {
                console.log('🎯🎯🎯 BOTÃO FINALIZAR PEDIDO CLICADO!');
                this.handleCheckout();
            });
        } else {
            console.error('❌ Botão checkout-btn NÃO encontrado no DOM');
            // Tenta encontrar novamente após um delay
            setTimeout(() => {
                const retryBtn = document.getElementById('checkout-btn');
                if (retryBtn) {
                    console.log('✅ Botão checkout-btn encontrado no retry');
                    retryBtn.addEventListener('click', () => this.handleCheckout());
                }
            }, 1000);
        }

        // Botão limpar carrinho
        const clearCartBtn = document.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                this.clearCart();
            });
        }

        // Fechar modal de endereço
        const closeModal = document.querySelector('#address-modal .close');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                document.getElementById('address-modal').style.display = 'none';
            });
        }

        console.log('✅ Event listeners do carrinho configurados');
    }

    addItem(item) {
        console.log('➕ Adicionando item ao carrinho:', item);
        
        // Verificar se o item já existe no carrinho
        const existingItemIndex = this.cart.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingItemIndex > -1) {
            // Item existe - atualizar quantidade
            const newQuantity = this.cart[existingItemIndex].quantity + item.quantity;
            if (newQuantity <= 10) {
                this.cart[existingItemIndex].quantity = newQuantity;
                console.log(`📈 ${item.name} quantidade atualizada para: ${newQuantity}`);
            } else {
                console.log(`⚠️ Limite máximo (10) atingido para ${item.name}`);
                this.showNotification(`Limite máximo de 10 unidades atingido para ${item.name}`, 'warning');
                return;
            }
        } else {
            // Novo item - adicionar ao carrinho
            if (item.quantity <= 10) {
                this.cart.push({
                    id: item.id,
                    name: item.name,
                    price: parseFloat(item.price),
                    quantity: parseInt(item.quantity),
                    image: item.image
                });
                console.log(`📢 ${item.name} (${item.quantity}x) adicionado ao carrinho!`);
            } else {
                console.log(`⚠️ Quantidade inicial muito alta para ${item.name}`);
                return;
            }
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showAddToCartNotification(item.name, item.quantity);
    }

    removeItem(itemId) {
        console.log('🗑️ Removendo item:', itemId);
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(itemId, newQuantity) {
        console.log('🔄 Atualizando quantidade:', itemId, 'para', newQuantity);
        
        if (newQuantity < 1) {
            this.removeItem(itemId);
            return;
        }
        
        if (newQuantity > 10) {
            newQuantity = 10;
            this.showNotification('Quantidade máxima é 10 unidades por item', 'warning');
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
            this.showNotification('Carrinho já está vazio', 'info');
            return;
        }

        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartDisplay();
            this.showNotification('Carrinho limpo com sucesso!', 'success');
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

        if (!cartItemsElement) {
            console.error('❌ Elemento cart-items não encontrado');
            return;
        }

        console.log('🔄 Atualizando display do carrinho:', this.cart.length, 'itens');

        if (this.cart.length === 0) {
            cartItemsElement.innerHTML = '<div class="empty-cart-message">🛒 Nenhum item adicionado ao carrinho</div>';
            if (cartTotalElement) cartTotalElement.textContent = 'R$ 0,00';
            if (checkoutBtn) {
                checkoutBtn.disabled = true;
                checkoutBtn.textContent = 'Finalizar Pedido';
            }
            return;
        }

        // Habilitar botão de checkout
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = `Finalizar Pedido (${this.getTotalItems()} itens)`;
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
                    <p class="cart-item-price">R$ ${item.price.toFixed(2)} cada</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" onclick="window.cartManager.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="window.cartManager.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button class="remove-btn" onclick="window.cartManager.removeItem('${item.id}')">×</button>
                </div>
                <div class="cart-item-total">
                    Total: R$ ${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `).join('');

        console.log('✅ Display do carrinho atualizado');
    }

    showAddToCartNotification(itemName, quantity) {
        this.showNotification(`✅ ${quantity}x ${itemName} adicionado ao carrinho!`, 'success');
    }

    showNotification(message, type = 'info') {
        // Criar notificação
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
        `;
        
        // Adicionar estilos se não existirem
        if (!document.querySelector('#cart-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'cart-notification-styles';
            styles.textContent = `
                .cart-notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    font-weight: bold;
                    z-index: 10000;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    max-width: 300px;
                }
                .cart-notification.success {
                    background: #27ae60;
                    color: white;
                }
                .cart-notification.warning {
                    background: #f39c12;
                    color: white;
                }
                .cart-notification.info {
                    background: #3498db;
                    color: white;
                }
                .cart-notification.error {
                    background: #e74c3c;
                    color: white;
                }
                .cart-notification.show {
                    transform: translateX(0);
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Animação de entrada
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
            this.showNotification('🛒 Seu carrinho está vazio! Adicione itens antes de finalizar o pedido.', 'warning');
            return;
        }

        console.log('📋 Itens no carrinho:', this.cart);
        
        // Verificar se usuário está logado
        const user = firebase.auth().currentUser;
        console.log('👤 Status do usuário:', user ? `Logado (${user.email})` : 'Não logado');
        
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
            console.log('📋 Abrindo modal de endereço...');
            addressModal.style.display = 'block';
            
            // Preencher com dados existentes se disponíveis
            const userData = this.getUserData();
            if (userData) {
                console.log('📝 Preenchendo formulário com dados existentes');
                if (userData.nome) document.getElementById('address-nome').value = userData.nome;
                if (userData.telefone) document.getElementById('address-telefone').value = userData.telefone;
                if (userData.endereco) document.getElementById('address-endereco').value = userData.endereco;
                if (userData.cidade) document.getElementById('address-cidade').value = userData.cidade;
                if (userData.cep) document.getElementById('address-cep').value = userData.cep;
                if (userData.complemento) document.getElementById('address-complemento').value = userData.complemento;
            }
        } else {
            console.error('❌ Modal de endereço não encontrado');
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

    async finalizeOrder(userData) {
        console.log('✅ Finalizando pedido...', userData);
        
        // ⭐ VALIDAÇÃO MELHORADA
        if (!this.cart || this.cart.length === 0) {
            this.showNotification('❌ Carrinho vazio!', 'error');
            return;
        }

        // Preparar dados para WhatsApp (fluxo original)
        const orderData = {
            userName: userData.nome,
            userPhone: userData.telefone,
            userAddress: `${userData.endereco}, ${userData.cidade} - ${userData.estado}${userData.complemento ? ` (${userData.complemento})` : ''}`,
            items: this.formatOrderItems(),
            total: this.getTotal().toFixed(2),
            timestamp: new Date().toISOString()
        };

        // Preparar dados para sistema de entregas
        const externalOrderData = {
            external_id: `garagem67_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            store_name: "Garagem 67 Bar e Conveniência",
            store_phone: "67998668032",
            customer: {
                name: userData.nome,
                phone: userData.telefone,
                address: `${userData.endereco}, ${userData.cidade} - ${userData.estado}`,
                complement: userData.complemento || '',
                city: userData.cidade,
                state: userData.estado
            },
            items: this.cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity
            })),
            total: this.getTotal(),
            description: this.formatOrderDescription(),
            notes: 'Pedido via site Garagem 67',
            metadata: {
                source: 'garagem67',
                cart_items: this.cart.length,
                user_email: userData.email || 'Não informado'
            }
        };

        console.log('📦 Dados do pedido para entregadores:', externalOrderData);

        try {
            // ⭐ TENTAR ENVIAR PARA SISTEMA DE ENTREGAS PRIMEIRO
            const externalService = new ExternalOrderService();
            const deliveryResult = await externalService.sendOrderToDeliverySystem(externalOrderData);

            // ⭐ SEMPRE ABRIR WHATSAPP (FLUXO PRINCIPAL)
            this.openWhatsApp(orderData);
            
            // ⭐ MOSTRAR CONFIRMAÇÃO APROPRIADA
            if (deliveryResult.success) {
                this.showDeliveryConfirmation(deliveryResult);
            } else {
                console.warn('⚠️ Pedido não enviado para entregadores, mas WhatsApp foi aberto');
                this.showNotification('✅ Pedido enviado para WhatsApp! Sistema de entregas offline.', 'warning');
            }

        } catch (error) {
            console.error('❌ Erro no processo de entrega:', error);
            // ⭐ EM CASO DE ERRO, APENAS ABRE WHATSAPP
            this.openWhatsApp(orderData);
            this.showNotification('✅ Pedido enviado para WhatsApp!', 'success');
        }

        // Limpar carrinho após pedido
        this.clearCart();
    }

    formatOrderItems() {
        return this.cart.map(item => 
            `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');
    }

    formatOrderDescription() {
        return this.cart.map(item => 
            `${item.quantity}x ${item.name}`
        ).join(', ');
    }

    openWhatsApp(orderData) {
        try {
            const message = `🛒 *PEDIDO - GARAGEM 67*\n\n` +
                           `*Cliente:* ${orderData.userName}\n` +
                           `*Telefone:* ${orderData.userPhone}\n` +
                           `*Endereço:* ${orderData.userAddress}\n\n` +
                           `*Itens do Pedido:*\n${orderData.items}\n\n` +
                           `*Total: R$ ${orderData.total}*\n\n` +
                           `_Pedido gerado via site Garagem 67_`;

            const whatsappNumber = window.appConfig?.whatsappNumber || '5567998668032';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            
            console.log('📤 Abrindo WhatsApp...', whatsappUrl);
            window.open(whatsappUrl, '_blank');
            
        } catch (error) {
            console.error('❌ Erro ao abrir WhatsApp:', error);
            this.showNotification('❌ Erro ao abrir WhatsApp. Copie o pedido e envie manualmente.', 'error');
        }
    }

    showDeliveryConfirmation(deliveryResult) {
        const confirmationEl = document.createElement('div');
        confirmationEl.className = 'delivery-confirmation';
        confirmationEl.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-header">
                    <h3>✅ PEDIDO NO SISTEMA DE ENTREGAS</h3>
                    <span class="close-confirmation">&times;</span>
                </div>
                <div class="confirmation-body">
                    <div class="delivery-info">
                        <p><strong>📦 Nº do Pedido:</strong> ${deliveryResult.deliveryId}</p>
                        <p><strong>🚚 Status:</strong> <span class="status-pendente">Aguardando entregador</span></p>
                        <p><strong>⏱️ Previsão:</strong> Em breve</p>
                        <p><strong>📍 Rastreamento:</strong> Disponível para entregadores</p>
                    </div>
                    <div class="confirmation-actions">
                        <button class="btn-track" onclick="window.open('https://entregador67.vercel.app', '_blank')">
                            📱 Acompanhar Entrega
                        </button>
                        <button class="btn-close">Fechar</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmationEl);
        
        // Event listeners para fechar
        confirmationEl.querySelector('.close-confirmation').addEventListener('click', () => {
            confirmationEl.remove();
        });
        
        confirmationEl.querySelector('.btn-close').addEventListener('click', () => {
            confirmationEl.remove();
        });
        
        // Fechar ao clicar fora
        confirmationEl.addEventListener('click', (e) => {
            if (e.target === confirmationEl) {
                confirmationEl.remove();
            }
        });
        
        // Mostrar animação
        setTimeout(() => confirmationEl.classList.add('show'), 100);
    }

    handleAddressSubmit(event) {
        event.preventDefault();
        console.log('📝 Enviando formulário de endereço...');
        
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

        console.log('📦 Dados coletados:', userData);

        // Validar dados obrigatórios
        if (!userData.nome || !userData.telefone || !userData.endereco) {
            this.showNotification('❌ Preencha todos os campos obrigatórios (Nome, Telefone e Endereço).', 'error');
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
    console.log('🚀 Inicializando CartManager...');
    window.cartManager = new CartManager();
    
    //