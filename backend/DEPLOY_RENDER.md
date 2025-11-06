# 🚀 Deploy no Render - Garagem 67 Backend

## Configuração do Render

### 1. Criar Novo Web Service
- Acesse [Render Dashboard](https://dashboard.render.com)
- Clique em "New +" → "Web Service"
- Conecte com GitHub e selecione o repositório

### 2. Configurações do Serviço
- **Name**: `garagem67-backend`
- **Environment**: `Node`
- **Region**: `Oregon` (US West)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 3. Variáveis de Ambiente
Configure estas variáveis no painel do Render:

```env
NODE_ENV=production
PORT=10000
JWT_SECRET=garagem67_super_secret_jwt_2025
FRONTEND_URL=https://garagem67.vercel.app
FIREBASE_PROJECT_ID=garagem67-c38cf
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@garagem67-c38cf.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n[SUA_CHAVE_AQUI]\n-----END PRIVATE KEY-----
