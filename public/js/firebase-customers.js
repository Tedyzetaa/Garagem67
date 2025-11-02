// frontend/js/firebase-customers.js - Sistema de Clientes Garagem67
class FirebaseCustomers {
    constructor() {
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            // Aguardar Firebase inicializar
            await this.waitForFirebase();
            this.initialized = true;
            console.log('✅ Firebase Customers inicializado');
        } catch (error) {
            console.error('❌ Erro ao inicializar Firebase Customers:', error);
        }
    }

    waitForFirebase() {
        return new Promise((resolve, reject) => {
            const checkFirebase = () => {
                if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
                    resolve();
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };
            checkFirebase();
        });
    }

    // 💾 Salvar/Atualizar cliente no Firestore
    async saveCustomer(customerData) {
        try {
            if (!this.initialized) {
                await this.init();
            }

            const user = firebase.auth().currentUser;
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const db = firebase.firestore();
            const customerRef = db.collection('customers').doc(user.uid);

            // Preparar dados do cliente
            const customerDoc = {
                // Dados pessoais
                nome: customerData.nome || '',
                email: customerData.email || user.email || '',
                telefone: customerData.telefone || '',
                cpf: customerData.cpf || '',
                
                // Endereço
                endereco: customerData.endereco || '',
                cidade: customerData.cidade || 'Ivinhema',
                estado: customerData.estado || 'MS',
                cep: customerData.cep || '',
                complemento: customerData.complemento || '',
                
                // Metadados
                user_id: user.uid,
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp(),
                last_sync: new Date().toISOString(),
                
                // Status
                ativo: true,
                origem: 'site_garagem67'
            };

            // Salvar no Firestore
            await customerRef.set(customerDoc, { merge: true });
            
            console.log('✅ Cliente salvo no Firestore:', customerDoc);
            return { success: true, customerId: user.uid };

        } catch (error) {
            console.error('❌ Erro ao salvar cliente no Firestore:', error);
            return { success: false, error: error.message };
        }
    }

    // 📥 Buscar cliente do Firestore
    async getCustomer() {
        try {
            if (!this.initialized) {
                await this.init();
            }

            const user = firebase.auth().currentUser;
            if (!user) {
                return { success: false, error: 'Usuário não autenticado' };
            }

            const db = firebase.firestore();
            const customerDoc = await db.collection('customers').doc(user.uid).get();

            if (customerDoc.exists) {
                const data = customerDoc.data();
                console.log('✅ Cliente encontrado no Firestore:', data);
                return { success: true, data: data };
            } else {
                console.log('ℹ️ Cliente não encontrado no Firestore');
                return { success: false, error: 'Cliente não encontrado' };
            }

        } catch (error) {
            console.error('❌ Erro ao buscar cliente do Firestore:', error);
            return { success: false, error: error.message };
        }
    }

    // 🔄 Sincronizar dados locais com Firestore
    async syncCustomerData() {
        try {
            // Buscar dados locais
            const localData = this.getLocalCustomerData();
            if (!localData) {
                console.log('ℹ️ Nenhum dado local para sincronizar');
                return { success: false, error: 'Nenhum dado local' };
            }

            // Salvar no Firestore
            const result = await this.saveCustomer(localData);
            
            if (result.success) {
                console.log('✅ Dados sincronizados com Firestore');
                return result;
            } else {
                throw new Error(result.error);
            }

        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
            return { success: false, error: error.message };
        }
    }

    // 💾 Buscar dados locais do localStorage
    getLocalCustomerData() {
        try {
            const userData = localStorage.getItem('garagem67_user_data');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('❌ Erro ao carregar dados locais:', error);
            return null;
        }
    }

    // 📊 Verificar se cliente existe no Firestore
    async checkCustomerExists() {
        try {
            const result = await this.getCustomer();
            return result.success;
        } catch (error) {
            return false;
        }
    }
}

// Inicializar globalmente
document.addEventListener('DOMContentLoaded', function() {
    window.firebaseCustomers = new FirebaseCustomers();
});
