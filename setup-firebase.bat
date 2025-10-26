@echo off
echo Configurando Firebase no backend...

cd backend

echo Criando arquivo .env com configuracoes do Firebase...
(
echo PORT=3001
echo JWT_SECRET=garagem67_segredo_%RANDOM%%RANDOM%%RANDOM%
echo FIREBASE_API_KEY=AIzaSyBbgzZ21aPFHmeoeahk40eMllzEfCcI7BQ
echo FIREBASE_AUTH_DOMAIN=garagem67-c38cf.firebaseapp.com
echo FIREBASE_PROJECT_ID=garagem67-c38cf
echo FIREBASE_STORAGE_BUCKET=garagem67-c38cf.firebasestorage.app
echo FIREBASE_MESSAGING_SENDER_ID=579533283807
echo FIREBASE_APP_ID=1:579533283807:web:1ebfcdedd080914203646a
echo FIREBASE_MEASUREMENT_ID=G-RZL3MCEXC0
echo NODE_ENV=development
echo FRONTEND_URL=http://localhost:8000
echo WHATSAPP_NUMBER=5567999999999
) > .env

echo.
echo ✅ Firebase configurado com sucesso!
echo 📁 Arquivo: backend\.env
echo.
echo 🔥 Agora voce tem:
echo    - Autenticacao real com Google
echo    - Backend integrado com Firebase
echo    - JWT tokens para seguranca
echo.
pause