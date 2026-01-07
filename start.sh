#!/bin/bash

# Retro Snake Game Start Script
echo "🐍 Starting Retro Snake Game..."

# Start backend in background
echo "🔧 Starting backend API..."
cd backend/SnakeGameApi
dotnet run &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend..."
cd ../../frontend
npm run dev &
FRONTEND_PID=$!

echo "🎉 Game is starting!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for interrupt
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
