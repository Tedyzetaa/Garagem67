// OrderService - Gerenciador de Pedidos com Configuração Centralizada
class OrderService {
    constructor() {
        this.userData = null;
        this.init();
    }

    init() {
        this.loadUserData();
        console.log('📦 OrderService inicializado');
    }

    loadUserData() {
        try {
            const savedData = localStorage.getItem('garagem67_user_data');
            if (savedData) {
                this.userData = JSON.parse(savedData);
                console.log('📦 Dados do usuário carregados:', this.userData);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
        }
    }

    saveUserData(userData) {
        try {
            this.userData = { ...this.userData, ...userData };
            localStorage.setItem('garagem67_user_data', JSON.stringify(this.userData));
            console.log('💾 Dados salvos:', this.userData);
        } catch (error) {
            console.error('❌ Erro ao salvar dados:', error);
        }
    }

    fillAddressForm() {
        if (!this.userData) return;
        
        const fields = {
            'address-nome': 'nome',
            'address-telefone': 'telefone', 
            'address-endereco': 'endereco',
            'address-cidade': 'cidade',
            'address-estado': 'estado',
            'address-cep': 'cep',
            'address-complemento': 'complemento'
        };

        for (const [fieldId, dataKey] of Object.entries(fields)) {
            const element = document.getElementById(fieldId);
            if (element && this.userData[dataKey]) {
                element.value = this.userData[dataKey];
            }
        }
    }

    onUserLogin(user) {
        console.log('👤 Usuário logado no OrderService:', user.email);
        
        if (user && !this.userData) {
            const userData = {
                nome: user.displayName || '',
                email: user.email || '',
                telefone: user.phoneNumber || ''
            };
            this.saveUserData(userData);
        }
    }

    // Adicionar ao OrderService existente
async submitOrderWithFirebase(cartItems, total) {
    try {
        // 1. Salvar dados no Firestore
        const customerData = this.getUserData();
        if (window.firebaseCustomers && customerData) {
            const saveResult = await window.firebaseCustomers.saveCustomer(customerData);
            if (!saveResult.success) {
                console.warn('⚠️ Não foi possível salvar no Firestore, continuando com WhatsApp...');
            }
        }

        // 2. Continuar com o envio para WhatsApp (código existente)
        this.sendOrderToWhatsApp(cartItems, total);

    } catch (error) {
        console.error('❌ Erro no processo de pedido:', error);
        // Fallback: enviar apenas para WhatsApp
        this.sendOrderToWhatsApp(cartItems, total);
    }
}

    sendOrderToWhatsApp() {
        const cartItems = window.cartService?.getCartItems() || [];
        const total = window.cartService?.getTotal() || 0;

        if (cartItems.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        if (!this.userData) {
            alert('Dados do usuário não encontrados!');
            return;
        }

        console.log('📤 Enviando pedido para WhatsApp...');

        // ⭐ USA A CONFIGURAÇÃO GLOBAL ⭐
        const whatsappConfig = window.appConfig?.whatsappNumber ? window.appConfig : { whatsappNumber: '556799998888' };
        const phoneNumber = whatsappConfig.whatsappNumber;
        
        console.log('📞 Usando número do WhatsApp:', phoneNumber);

        // Formata mensagem para WhatsApp
        let message = `*🛵 NOVO PEDIDO - GARAGEM 67*%0A%0A`;
        message += `*Cliente:* ${this.userData.nome}%0A`;
        message += `*Telefone:* ${this.userData.telefone}%0A`;
        message += `*Email:* ${this.userData.email || 'Não informado'}%0A%0A`;
        
        message += `*📍 ENDEREÇO DE ENTREGA*%0A`;
        message += `${this.userData.endereco}%0A`;
        message += `${this.userData.cidade} - ${this.userData.estado}%0A`;
        message += `CEP: ${this.userData.cep}%0A`;
        if (this.userData.complemento) {
            message += `Complemento: ${this.userData.complemento}%0A`;
        }
        message += `%0A`;

        message += `*🛒 PEDIDO*%0A`;
        cartItems.forEach(item => {
            message += `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}%0A`;
        });
        
        message += `%0A`;
        message += `*💰 TOTAL: R$ ${total.toFixed(2)}*%0A%0A`;
        message += `*⏰ Horário do pedido:* ${new Date().toLocaleString('pt-BR')}%0A`;
        message += `*📱 Via: Site Garagem 67*`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

        // Abre WhatsApp e limpa carrinho
        window.open(whatsappUrl, '_blank');
        window.cartService?.clearCart();
        
        this.showOrderConfirmation();
    }

    showOrderConfirmation() {
        alert('✅ Pedido enviado com sucesso!\\n\\nAgora é só aguardar que entraremos em contato para confirmar seu pedido.');
    }

    // Verifica se usuário tem dados completos
    hasCompleteUserData() {
        return this.userData && 
               this.userData.nome && 
               this.userData.telefone && 
               this.userData.endereco;
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.orderService = new OrderService();
    console.log('📦 Serviço de pedidos inicializado');
});
