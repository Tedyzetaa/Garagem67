const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Configuração otimizada para Render
const isProduction = process.env.NODE_ENV === 'production';

// Middleware otimizado
app.use(cors({
    origin: [
        'https://garagem67.vercel.app',
        'https://www.garagem67.com',
        'http://localhost:8000',
        'http://localhost:3000',
        'https://garagem67-frontend.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware para debug
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// Health check melhorado
app.get('/health', (req, res) => {
    res.status(200).json({
        status: '✅ ONLINE',
        service: 'Garagem 67 Backend',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        node_version: process.version,
        platform: process.platform,
        memory: process.memoryUsage(),
        uptime: process.uptime()
    });
});

// CONFIGURAÇÃO FIREBASE ADMIN - Render Optimized
let firebaseInitialized = false;

const initializeFirebase = () => {
    try {
        const serviceAccount = {
            type: "service_account",
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
            universe_domain: "googleapis.com"
        };

        // Validação das credenciais
        if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
            throw new Error('Credenciais do Firebase incompletas');
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
        });

        firebaseInitialized = true;
        console.log('✅ Firebase Admin inicializado com sucesso no Render');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar Firebase Admin:', error);
        // Não encerrar o processo, permitir que outras rotas funcionem
    }
};

initializeFirebase();

const JWT_SECRET = process.env.JWT_SECRET || 'garagem67_jwt_secret_fallback_2025';

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de acesso necessário' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Token inválido' });
    }
};

// Rota de autenticação com Firebase
app.post('/api/auth/firebase', async (req, res) => {
    try {
        if (!firebaseInitialized) {
            return res.status(503).json({ 
                success: false, 
                error: 'Serviço de autenticação temporariamente indisponível' 
            });
        }

        const { idToken } = req.body;
        
        if (!idToken) {
            return res.status(400).json({ error: 'Token de ID não fornecido' });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        const token = jwt.sign(
            { 
                userId: uid,
                email: email,
                name: name || email.split('@')[0]
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: uid,
                name: name || email.split('@')[0],
                email: email,
                picture: picture || 'https://via.placeholder.com/40'
            }
        });

    } catch (error) {
        console.error('Erro na autenticação Firebase:', error);
        res.status(401).json({ 
            success: false, 
            error: 'Falha na autenticação com Firebase' 
        });
    }
});

// Nova rota para pedidos externos (entregadores)
app.post('/api/external/orders', async (req, res) => {
    try {
        console.log('📦 Recebendo pedido externo:', req.body);
        
        const orderData = req.body;
        
        // Validação básica
        if (!orderData.customer || !orderData.items || !orderData.total) {
            return res.status(400).json({
                success: false,
                message: 'Dados do pedido incompletos'
            });
        }

        // Simular processamento do pedido
        const internal_id = `G67_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        
        const response = {
            success: true,
            message: 'Pedido recebido com sucesso',
            order: {
                internal_id: internal_id,
                external_id: orderData.external_id,
                status: 'pending',
                customer: orderData.customer,
                items: orderData.items,
                total: orderData.total,
                created_at: new Date().toISOString()
            },
            tracking_url: `https://entregador67.vercel.app/track/${internal_id}`
        };

        console.log('✅ Pedido processado:', response);
        res.json(response);

    } catch (error) {
        console.error('❌ Erro ao processar pedido externo:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno ao processar pedido'
        });
    }
});

// Rotas de gerenciamento de usuários
app.post('/api/auth/create-user', async (req, res) => {
    try {
        if (!firebaseInitialized) {
            return res.status(503).json({ 
                success: false, 
                error: 'Serviço indisponível' 
            });
        }

        const { email, password, name, phone } = req.body;
        
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
            phoneNumber: phone
        });

        res.json({
            success: true,
            user: {
                uid: userRecord.uid,
                email: userRecord.email,
                name: userRecord.displayName,
                phone: userRecord.phoneNumber
            }
        });

    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Rotas de verificação
app.post('/api/auth/verify', (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ error: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ success: true, user: decoded });

    } catch (error) {
        res.status(401).json({ success: false, error: 'Token inválido' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    res.json({ success: true, message: 'Logout realizado com sucesso' });
});

// Rota de informações do serviço
app.get('/api/info', (req, res) => {
    res.json({ 
        status: '✅ ONLINE',
        service: 'Garagem 67 Backend API',
        version: '1.4.0',
        environment: process.env.NODE_ENV || 'development',
        deploy: 'Render',
        timestamp: new Date().toISOString(),
        firebase: firebaseInitialized ? '✅ CONECTADO' : '❌ OFFLINE',
        endpoints: {
            auth: '/api/auth/firebase',
            orders: '/api/external/orders',
            health: '/health',
            info: '/api/info'
        }
    });
});

// Rota para configuração do Firebase frontend
app.get('/api/firebase-config', (req, res) => {
    res.json({
        apiKey: "AIzaSyBbgzZ21aPFHmeoeahk40eMllzEfCcI7BQ",
        authDomain: "garagem67-c38cf.firebaseapp.com",
        projectId: "garagem67-c38cf",
        storageBucket: "garagem67-c38cf.appspot.com",
        messagingSenderId: "579533283807",
        appId: "1:579533283807:web:c8299a4f8ea67b29c07c39d"
    });
});

// Rota protegida de exemplo
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ 
        message: '✅ Rota protegida acessada com sucesso',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Garagem 67 Backend API - Render',
        version: '1.4.0',
        status: '✅ ONLINE',
        environment: process.env.NODE_ENV || 'development',
        endpoints: {
            home: '/',
            health: '/health',
            info: '/api/info',
            auth: '/api/auth/firebase',
            orders: '/api/external/orders',
            firebaseConfig: '/api/firebase-config'
        },
        documentation: 'Backend para sistema Garagem 67 - Bar e Conveniência'
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        path: req.originalUrl,
        availableEndpoints: [
            'GET  /',
            'GET  /health',
            'GET  /api/info',
            'POST /api/auth/firebase',
            'POST /api/external/orders',
            'GET  /api/firebase-config'
        ]
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('❌ Erro no servidor:', error);
    res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: isProduction ? 'Algo deu errado' : error.message,
        timestamp: new Date().toISOString()
    });
});

// Inicialização do servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
🚀 GARAGEM 67 BACKEND - RENDER
📍 Porta: ${PORT}
🌐 Ambiente: ${process.env.NODE_ENV || 'development'}
🔥 Firebase: ${firebaseInitialized ? '✅ CONECTADO' : '❌ OFFLINE'}
📅 Iniciado em: ${new Date().toISOString()}
    
📋 Endpoints Principais:
   • GET  /                 → Informações da API
   • GET  /health           → Status do serviço
   • GET  /api/info         → Informações detalhadas
   • POST /api/auth/firebase → Autenticação Firebase
   • POST /api/external/orders → Pedidos externos
    
✅ Backend rodando com sucesso!
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Recebido SIGTERM, encerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Recebido SIGINT, encerrando servidor...');
    process.exit(0);
});
