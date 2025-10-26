@echo off
chcp 65001 > nul
echo ====================================
echo    GARAGEM 67 - BAR E CONVENIENCIA
echo ====================================
echo Iniciando servidor local...
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado. Instale Python 3.9 ou superior.
    pause
    exit /b 1
)

REM Tentar ativar o ambiente conda (se existir)
call conda activate garagem67-bar >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Ambiente conda não encontrado. Criando novo ambiente...
    conda env create -f environment.yml
    if errorlevel 1 (
        echo ❌ Erro ao criar ambiente. Usando Python do sistema...
    ) else (
        call conda activate garagem67-bar
    )
)

echo.
echo ✅ Iniciando servidor...
python server.py

pause