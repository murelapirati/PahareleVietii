@echo off
chcp 65001 > nul
cls
echo.
echo    ╔════════════════════════════════════════╗
echo    ║        🎯 CUP GAME - Starting...       ║
echo    ╚════════════════════════════════════════╝
echo.

REM Get the directory where this batch file is located
set "DIR=%~dp0"

REM Change to that directory
cd /d "%DIR%"

REM Check if node/npm is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ Node.js is not installed or not in PATH!
    echo Please install Node from https://nodejs.org/
    echo Make sure to check "Add Node to PATH" during installation.
    echo.
    pause
    exit /b 1
)

echo Checking dependencies...
call npm install --no-audit --no-fund

echo.
echo Starting React dev server on http://localhost:5173...
echo.

REM Open browser after a slight delay
timeout /t 3 /nobreak
echo Opening your browser (Brave or Firefox)...
start brave http://localhost:5173 || start firefox http://localhost:5173 || start http://localhost:5173

REM Start Vite server
call npm run dev

pause
