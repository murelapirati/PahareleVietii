@echo off
setlocal enabledelayedexpansion
chcp 65001 > nul
cls
echo.
echo    ╔════════════════════════════════════════╗
echo    ║        🎯 CUP GAME - Starting...       ║
echo    ╚════════════════════════════════════════╝
echo.

REM Change to directory of script
cd /d "%~dp0"

REM 1. Check for Node.js
node -v >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [!] Node.js is missing. Attempting automatic installation...
    echo.
    
    REM Try winget first (Windows 10/11 standard)
    where winget >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        echo Using Windows Package Manager (winget)...
        winget install -e --id OpenJS.NodeJS --accept-source-agreements --accept-package-agreements
    ) else (
        echo [!] Winget not found. Using PowerShell to download Node.js installer...
        powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi' -OutFile 'node_installer.msi'"
        if exist node_installer.msi (
            echo Running installer... Please approve any administrator prompts.
            msiexec /i node_installer.msi /passive /norestart
            del node_installer.msi
        ) else (
            echo [X] Failed to download automatically. Please install manually from nodejs.org
            pause
            exit /b 1
        )
    )
    
    echo.
    echo ✅ Node.js has been installed! 
    echo ⚠️ NOTE: You need to RESTART this script so the system recognizes the new installation.
    echo Please press any key to close this window, then double-click run.bat again.
    pause
    exit /b 0
)

REM 2. Install Project Dependencies
echo [*] Checking and installing auto-dependencies...
call npm install --no-audit --no-fund

echo.
echo [*] Starting React server on http://localhost:5173...
echo.

REM 3. Open Browser
timeout /t 3 /nobreak >nul
echo [*] Launching your browser...
start brave http://localhost:5173 2>nul || start firefox http://localhost:5173 2>nul || start http://localhost:5173

REM 4. Run Game Server
call npm run dev

pause
