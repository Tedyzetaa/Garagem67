const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'https://garagem67.vercel.app',
        'http://localhost:8000',
        'http://localhost:3000'
    ],
    credentials: true
}));
app.use(express.json());

// **CONFIGURAÇÃO DO FIREBASE ADMIN COM VARIÁVEIS DE AMBIENTE**
const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID || "garagem67-c38cf",
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "c8299a4f8ea67b29c07c39daeb67a8bc49eb9a29",
    private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDXS7EH/QyQe5js
7m0MaP1Tjjp0Eyb/5IYnxQbqi5rwFK4ZStX5NpJjRRBmCCq7D2b2GNN6yDKBTMWT
5KA01i9bujhDfFky4fUhB1dvRyUwsWE6ux/Bhfy8kP17bq6VstIR9qAg2iIzhYeO
dPxskqPobYUpJe2Om/Ps/HXqBiVULtqVpHx28vT1wP444tG8fZZaAuxuHsIvNby3
gvU/xcnkso8gHAcsX9gnxR9Xf32J/QKBMZ1v1jU+TaoppjvICRrhltBeKnf3EdrS
IJmk8DJkjkugWQgfqf/hClutwwShaiIRBRRbux3Jolyr1nYJqjMsWThehcaRzWK1
9vZpTeNdAgMBAAECggEAC4zWFZo2iUN25T0hpgu1jXzrogxgqFPzpjYMhIWSqBnK
lkpHbPGHzHdpJWQqRginQCwoSlBrtI1FwJpVxZ05A12Gml4/2yTiqvqIbwyc0D4v
5mqhY0Hjg3VELWdMdUpXjpr8emQMIiyiJLBzgK/5nE+l2Bret1V4B7PVRUW+TRlb
hWdcaNCEFTjF16Q8yJ+/em2J0JAkrfWA8UfAz/Qyybwv3NREMWoQmdOSYPzMoK27
B431Oe6fptwCNxO9unyp+MTaWvUXYQQb1LvpJz3wb40gWoqo66NSmcgwB2OfIYMM
U873vG0GaxRL5JdZ27leF30NpDH5D1CjxmwE4Mz6iQKBgQDzXx0DZQ2s93y6wACq
suM0hdAo0/F1wovA31t8mfJO2NJbkR+QcvYH1/7+nRwUfrlaswyqlb24qcJjEWK4
Zcju0vAIINSpNHap5EHBmKykZSaxb7M1qO1nFKxkUn8JV+9y354RQ7yuiUlFtKwe
PbY6yrJ1DQ4xus8PrWXohjx3NQKBgQDid6AaXAFVVj1j7BDWGWH4SaFaf0g6Lwov
+BFg2PajHar+QMuRroofcQ31unp+0oetRQdS+8tM0rOS1kZztOM/xqERzi4IteOr
C8EVkyi6k815DGebdQawkFASrfmMX3Ye/NXJLHWQ4HB23FQibq7UqNnJ2N1GVwZB
F8+3nLS4iQKBgAddJmSW5y4HoweHjb2cghFxxxWlLBYzF8VzPLJteg52sw7AOmNF
hzo/h+CuYk4gc31SE50JwN7YjCAxQ3pu4gCP82FblPO1ua10UaUI+JhU0zHlPlfu
T5ih4IF8mYlv1rf0GjVNhmUFlGj+iYK0vVHUFkhCZ96LV36S8ZVyklvNAoGAATPZ
acprR2S51rn+LOTdnE/nx289lvGBAFg032rHhH431jnJ2vAuU5RqGo/u7pV3mvfu
3gXwQmwr/++bWCnxuvj3Cf0qSWmN1+6sC81IPhVi1e227yBj9LQPeMnrtU8cdXWq
PPM7fJV0g20QFU65Ju/umB/KrQDxS48wzyzJ2OECgYBTVF9T6G4jjrIqZDXHIvN/
gkYFf5b5Fr332RulsNFrLHAhAi9In56vr7604ztcq9hSwXk8c+nxv9HFQH3kOMA0
CwZ/cRLCQMJzl7B3gW5d35f2UnW/8aHQDs5V1NeKb2cVjYKELScBDWUnFfP389aK
16fcVeKr9myCiVNWfzl6qA==
-----END PRIVATE KEY-----`,
    client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@garagem67-c38cf.iam.gserviceaccount.com",
    client_id: process.env.FIREBASE_CLIENT_ID || "105355846483629887329",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40garagem67-c38cf.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
};

// Verificar se todas as credenciais necessárias estão presentes
if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
    console.error('❌ Credenciais do Firebase Admin incompletas!');
    console.log('Certifique-se de que FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY estão definidos');
    process.exit(1);
}

try {
    // Inicializar Firebase Admin
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });
    console.log('✅ Firebase Admin inicializado com sucesso');
    console.log(`📁 Projeto: ${serviceAccount.project_id}`);
    console.log(`📧 Client Email: ${serviceAccount.client_email}`);
} catch (error) {
    console.error('❌ Erro ao inicializar Firebase Admin:', error);
    process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET || 'garagem67_jwt_secret_fallback_2025';

// Rota para autenticação com Firebase Token
app.post('/api/auth/firebase', async (req, res) => {
    try {
        const { idToken } = req.body;
        
        if (!idToken) {
            return res.status(400).json({ error: 'Token de ID não fornecido' });
        }

        // Verificar token do Firebase
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        // Criar JWT token para nossa API
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

// Rota para criar usuário personalizado (se necessário)
app.post('/api/auth/create-user', async (req, res) => {
    try {
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

// Rota para verificar token
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

// Rota para logout
app.post('/api/auth/logout', (req, res) => {
    res.json({ success: true, message: 'Logout realizado com sucesso' });
});

// Rota de saúde da API
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Garagem 67 Backend',
        auth: 'Firebase',
        project: serviceAccount.project_id,
        environment: process.env.NODE_ENV || 'development'
    });
});

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

// Rota protegida de exemplo
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ 
        message: 'Esta é uma rota protegida',
        user: req.user
    });
});

// Rota para obter configuração do Firebase para o frontend
app.get('/api/firebase-config', (req, res) => {
    res.json({
        apiKey: "AIzaSyBbgzZ21aPFHmeoeahk40eMllzEfCcI7BQ",
        authDomain: "garagem67-c38cf.firebaseapp.com",
        projectId: "garagem67-c38cf",
        storageBucket: "garagem67-c38cf.appspot.com",
        messagingSenderId: "579533283807",
        appId: process.env.FIREBASE_APP_ID || "1:579533283807:web:your_app_id_here",
        measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-YOUR_MEASUREMENT_ID"
    });
});

// Rota para testar conexão com Firebase
app.get('/api/test-firebase', async (req, res) => {
    try {
        // Listar alguns usuários para testar a conexão
        const listUsersResult = await admin.auth().listUsers(2);
        
        res.json({
            success: true,
            message: 'Conexão com Firebase estabelecida com sucesso',
            usersCount: listUsersResult.users.length,
            project: serviceAccount.project_id
        });
    } catch (error) {
        console.error('Erro ao testar Firebase:', error);
        res.status(500).json({
            success: false,
            error: 'Falha na conexão com Firebase',
            details: error.message
        });
    }
});

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Garagem 67 Backend API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth/firebase',
            firebaseConfig: '/api/firebase-config',
            test: '/api/test-firebase'
        },
        documentation: 'Consulte o README para mais informações'
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        path: req.originalUrl,
        availableEndpoints: [
            'GET  /',
            'GET  /api/health',
            'POST /api/auth/firebase',
            'GET  /api/firebase-config',
            'GET  /api/test-firebase'
        ]
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Erro no servidor:', error);
    res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'production' ? 'Algo deu errado' : error.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
    console.log(`🔥 Autenticação: Firebase - ${serviceAccount.project_id}`);
    console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'https://garagem67.vercel.app'}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🔗 Test Firebase: http://localhost:${PORT}/api/test-firebase`);
    console.log(`🔗 API Root: http://localhost:${PORT}/`);
});