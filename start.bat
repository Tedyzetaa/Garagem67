@echo off
echo 🚀 Iniciando Garagem 67...

REM Ativar ambiente conda
call conda activate garagem67

REM Iniciar backend na pasta backend
echo Iniciando Backend...
cd backend
start "Backend Garagem67" cmd /k "npm start"

REM Voltar para raiz e iniciar frontend
cd ..
echo Iniciando Frontend...
timeout /t 3 /nobreak > nul
start "Frontend Garagem67" cmd /k "python -m http.server 8000"

echo.
echo ✅ Servidores iniciados!
echo 🌐 Frontend: http://localhost:8000
echo 🔧 Backend:  http://localhost:3001
echo.
pause