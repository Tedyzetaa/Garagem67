// garagem67/js/order.js - OrderService ATUALIZADO com Firestore
class OrderService {
    constructor() {
        this.userData = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupAddressForm();
        console.log('📦 OrderService inicializado com Firestore');
    }

    setupAddressForm() {
        const addressForm = document.getElementById('address-form');
        if (addressForm) {
            addressForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddressFormSubmit();
            });
        }

        // 🆕 Preencher formulário quando modal abrir
        const addressModal = document.getElementById('address-modal');
        if (addressModal) {
            // Observar quando modal é aberto
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        if (addressModal.style.display === 'block') {
                            this.fillAddressFormWithExistingData();
                        }
                    }
                });
            });
            
            observer.observe(addressModal, { attributes: true });
        }
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

    // 🆕 Preencher formulário com dados existentes
    fillAddressFormWithExistingData() {
        if (!this.userData) return;
        
        const fields = {
            'address-nome': 'nome',
            'address-telefone': 'telefone',
            'address-cpf': 'cpf', // ⭐ NOVO CAMPO
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

    // 🆕 Manipular envio do formulário de endereço
    async handleAddressFormSubmit() {
        try {
            // 1. Coletar dados do formulário
            const formData = this.collectFormData();
            if (!formData) return;

            // 2. Validar dados
            if (!this.validateFormData(formData)) return;

            // 3. Salvar dados do cliente
            await this.saveCustomerData(formData);

            // 4. Enviar pedido para WhatsApp
            this.sendOrderToWhatsApp();

            // 5. Fechar modal
            this.closeAddressModal();

        } catch (error) {
            console.error('❌ Erro no processo de pedido:', error);
            alert('Erro ao processar pedido. Tente novamente.');
        }
    }

    // 🆕 Coletar dados do formulário
    collectFormData() {
        const formData = {
            nome: document.getElementById('address-nome')?.value || '',
            telefone: document.getElementById('address-telefone')?.value || '',
            cpf: document.getElementById('address-cpf')?.value || '', // ⭐ NOVO CAMPO
            endereco: document.getElementById('address-endereco')?.value || '',
            cidade: document.getElementById('address-cidade')?.value || 'Ivinhema',
            estado: document.getElementById('address-estado')?.value || 'MS',
            cep: document.getElementById('address-cep')?.value || '',
            complemento: document.getElementById('address-complemento')?.value || ''
        };

        return formData;
    }

    // 🆕 Validar dados do formulário
    validateFormData(formData) {
        const requiredFields = ['nome', 'telefone', 'cpf', 'endereco'];
        const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');

        if (missingFields.length > 0) {
            alert('Por favor, preencha todos os campos obrigatórios: Nome, Telefone, CPF e Endereço.');
            return false;
        }

        // Validar CPF básico (apenas se tem 11 dígitos)
        const cpfDigits = formData.cpf.replace(/\D/g, '');
        if (cpfDigits.length !== 11) {
            alert('Por favor, insira um CPF válido com 11 dígitos.');
            return false;
        }

        return true;
    }

    // 🆕 Salvar dados do cliente
    async saveCustomerData(formData) {
        try {
            // Salvar localmente
            this.saveUserData(formData);

            // 🆕 Salvar no Firestore (se disponível)
            if (window.firebaseCustomers) {
                const result = await window.firebaseCustomers.onAddressFormSubmit(formData);
                if (result.success) {
                    console.log('✅ Dados do cliente salvos com sucesso no Firestore');
                } else {
                    console.warn('⚠️ Dados salvos localmente, mas não no Firestore');
                }
            }

        } catch (error) {
            console.error('❌ Erro ao salvar dados do cliente:', error);
            // Não impedir o pedido se falhar o Firestore
        }
    }

    // 🆕 Fechar modal de endereço
    closeAddressModal() {
        const addressModal = document.getElementById('address-modal');
        if (addressModal) {
            addressModal.style.display = 'none';
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
        
        // Dados do cliente
        message += `*👤 DADOS DO CLIENTE*%0A`;
        message += `Nome: ${this.userData.nome}%0A`;
        message += `Telefone: ${this.userData.telefone}%0A`;
        message += `CPF: ${this.userData.cpf || 'Não informado'}%0A`;
        message += `Email: ${this.userData.email || 'Não informado'}%0A%0A`;
        
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
               this.userData.cpf && // ⭐ AGORA INCLUI CPF
               this.userData.endereco;
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.orderService = new OrderService();
    console.log('📦 Serviço de pedidos inicializado com Firestore');
});
