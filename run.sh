#!/bin/bash

# Clear screen
clear

echo ""
echo "    ╔════════════════════════════════════════╗"
echo "    ║        🎯 CUP GAME - Starting...       ║"
echo "    ╚════════════════════════════════════════╝"
echo ""

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo ""
    echo "❌ Node.js is not installed or not in PATH!"
    echo "Please install Node from https://nodejs.org/"
    echo "Or use your package manager (e.g., sudo apt install nodejs npm)"
    echo ""
    exit 1
fi

echo "Checking dependencies..."
npm install --no-audit --no-fund

echo ""
echo "Starting React dev server on http://localhost:5173..."
echo ""

# Open browser asynchronously
(sleep 3 && {
    echo "Opening your browser (Brave/Firefox)..."
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

# Start Vite server
npm run dev
