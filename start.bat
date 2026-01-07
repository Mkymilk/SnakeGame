@echo off
REM Retro Snake Game Start Script for Windows

echo 🐍 Starting Retro Snake Game...

REM Start backend
echo 🔧 Starting backend API...
start "Snake Game Backend" cmd /k "cd backend\SnakeGameApi && dotnet run"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🎨 Starting frontend...
start "Snake Game Frontend" cmd /k "cd frontend && npm run dev"

echo 🎉 Game is starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Two command windows will open for the backend and frontend.
echo Close both windows to stop the servers.
pause
