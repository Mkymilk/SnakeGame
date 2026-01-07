@echo off
REM Retro Snake Game Setup Script for Windows

echo 🐍 Setting up Retro Snake Game...

REM Check prerequisites
echo Checking prerequisites...

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check .NET
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ .NET SDK is not installed. Please install .NET 9 SDK from https://dotnet.microsoft.com/
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

REM Setup backend
echo 🔧 Setting up backend...
cd backend\SnakeGameApi
dotnet restore
if %errorlevel% neq 0 (
    echo ❌ Failed to restore backend dependencies
    pause
    exit /b 1
)

REM Setup frontend
echo 🎨 Setting up frontend...
cd ..\..\frontend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

cd ..

echo 🎉 Setup complete!
echo.
echo To start the game:
echo 1. Start the backend: cd backend\SnakeGameApi ^&^& dotnet run
echo 2. Start the frontend: cd frontend ^&^& npm run dev
echo 3. Open http://localhost:3000 in your browser
echo.
echo Or use the start script: start.bat
pause
