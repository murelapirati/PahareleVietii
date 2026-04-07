@echo off
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
if %ERRORLEVEL% EQU 0 goto :skip_node

REM Fallback if installed but PATH isn't updated
if exist "C:\Program Files\nodejs\node.exe" (
    set "PATH=%PATH%;C:\Program Files\nodejs\"
    goto :skip_node
)
if exist "C:\Program Files (x86)\nodejs\node.exe" (
    set "PATH=%PATH%;C:\Program Files (x86)\nodejs\"
    goto :skip_node
)

echo [!] Node.js is missing. Attempting automatic installation...
echo.

where winget >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Using Windows Package Manager ^(winget^)...
    winget install -e --id OpenJS.NodeJS --source winget --accept-source-agreements --accept-package-agreements
    goto :verify_install
)

echo [!] Winget not found. Using PowerShell to download Node.js installer...
powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi' -OutFile 'node_installer.msi'"
if exist node_installer.msi (
    echo Running installer... Please approve any administrator prompts.
    start /wait msiexec /i node_installer.msi /passive /norestart
    del node_installer.msi
)

:verify_install
if exist "C:\Program Files\nodejs\node.exe" (
    set "PATH=%PATH%;C:\Program Files\nodejs\"
    echo ✅ Node.js has been successfully installed!
    goto :skip_node
)
if exist "C:\Program Files (x86)\nodejs\node.exe" (
    set "PATH=%PATH%;C:\Program Files (x86)\nodejs\"
    echo ✅ Node.js has been successfully installed!
    goto :skip_node
)

echo [X] Could not verify installation automatically. 
echo Please install manually from nodejs.org
pause
exit /b 1

:skip_node
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
