#!/bin/bash

clear
echo ""
echo "    ╔════════════════════════════════════════╗"
echo "    ║        🎯 CUP GAME - Starting...       ║"
echo "    ╚════════════════════════════════════════╝"
echo ""

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# 1. Check & Auto-Install Node.js 
if ! command -v node &> /dev/null; then
    echo "[!] Node.js not found. Attempting automatic installation..."
    
    if command -v apt &> /dev/null; then
        echo "Detected Debian/Ubuntu. Installing via APT..."
        sudo apt update
        sudo apt install -y nodejs npm
    elif command -v brew &> /dev/null; then
        echo "Detected MacOS/LinuxBrew. Installing via Homebrew..."
        brew install node
    elif command -v pacman &> /dev/null; then
        echo "Detected Arch Linux. Installing via Pacman..."
        sudo pacman -S --noconfirm nodejs npm
    elif command -v dnf &> /dev/null; then
        echo "Detected Fedora/RHEL. Installing via DNF..."
        sudo dnf install -y nodejs npm
    else
        echo "❌ Could not determine package manager to install Node.js."
        echo "Please install Node manually from https://nodejs.org/"
        exit 1
    fi
    
    # Verify installation succeeded
    if ! command -v node &> /dev/null; then
        echo "❌ Automatic installation failed. Please install Node manually."
        exit 1
    fi
    echo "✅ Node.js installed successfully!"
    echo ""
fi

# 2. Check and install dependencies
echo "[*] Checking project dependencies..."
npm install --no-audit --no-fund

echo ""
echo "[*] Starting React dev server on http://localhost:5173..."
echo ""

# 3. Open browser asynchronously
(sleep 3 && {
    echo "[*] Launching your browser..."
    if command -v brave-browser > /dev/null; then
        brave-browser http://localhost:5173
    elif command -v brave > /dev/null; then
        brave http://localhost:5173
    elif command -v firefox > /dev/null; then
        firefox http://localhost:5173
    elif command -v xdg-open > /dev/null; then
        xdg-open http://localhost:5173
    elif command -v open > /dev/null; then
        open http://localhost:5173
    else
        echo "Please open http://localhost:5173 in your browser"
    fi
}) &

# 4. Start Vite server
npm run dev
