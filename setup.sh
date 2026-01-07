#!/bin/bash

# Retro Snake Game Setup Script
echo "🐍 Setting up Retro Snake Game..."

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check .NET
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET SDK is not installed. Please install .NET 9 SDK from https://dotnet.microsoft.com/"
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Setup backend
echo "🔧 Setting up backend..."
cd backend/SnakeGameApi
dotnet restore
if [ $? -ne 0 ]; then
    echo "❌ Failed to restore backend dependencies"
    exit 1
fi

# Setup frontend
echo "🎨 Setting up frontend..."
cd ../../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "🎉 Setup complete!"
echo ""
echo "To start the game:"
echo "1. Start the backend: cd backend/SnakeGameApi && dotnet run"
echo "2. Start the frontend: cd frontend && npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Or use the start script: ./start.sh"
