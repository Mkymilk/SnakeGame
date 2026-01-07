# Retro Snake Game 🐍

A nostalgic Snake game inspired by the classic Nokia N72 UI and feel. This web application features a TypeScript frontend with HTML5 Canvas rendering and a C# ASP.NET Core backend for global high score management.

![Snake Game Preview](docs/preview.png)

## 🎮 Features

### Game Features
- **Classic Snake Gameplay**: Grid-based movement with traditional snake mechanics
- **Retro Nokia-Inspired UI**: Pixel-art aesthetic with authentic retro styling
- **Multiple Control Options**: 
  - Keyboard: Arrow keys and WASD
  - Mobile: Touch controls with on-screen directional buttons
- **Game Modes**: 
  - Solid walls (classic mode)
  - Wrap-around walls (alternative mode)
- **Audio**: Retro beep sound effects (toggleable)
- **Progressive Difficulty**: Snake speed increases as score grows

### Technical Features
- **Local High Score**: Persistent local storage
- **Global Leaderboard**: Backend-powered global high scores
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animation**: 60 FPS rendering with configurable game tick rate
- **Pause/Resume**: Full game state management

## 🏗️ Architecture

### Frontend (TypeScript)
- **Framework**: Vanilla TypeScript with HTML5 Canvas
- **Build Tool**: Vite for fast development and optimized builds
- **Testing**: Vitest for unit tests
- **Styling**: Pure CSS with Nokia-inspired design

### Backend (C# ASP.NET Core)
- **Framework**: ASP.NET Core Web API (.NET 9)
- **Database**: SQLite with Entity Framework Core
- **CORS**: Configured for frontend origins
- **Validation**: Input validation and rate limiting considerations

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **.NET 9 SDK**
- **Git**
remark **extract file backend.rar before step 1**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Snake
```

### 2. Backend Setup
```bash
cd backend/SnakeGameApi

# Restore dependencies
dotnet restore

# Run the API server
dotnet run
```
The backend will start on `https://localhost:5001` and `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
The frontend will start on `http://localhost:3000`

### 4. Play the Game!
Open your browser to `http://localhost:3000` and enjoy!

## 🎯 Game Controls

### Keyboard Controls
| Key | Action |
|-----|--------|
| ↑ ↓ ← → | Move snake |
| W A S D | Alternative movement |
| SPACE | Pause/Resume |
| ENTER | Start game (from menu) |
| ESC | Return to menu |

### Mobile Controls
- **Touch Controls**: On-screen directional buttons
- **Tap Pause**: Pause button during gameplay

## 🔧 Development

### Frontend Development
```bash
cd frontend

# Development server with hot reload
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development
```bash
cd backend/SnakeGameApi

# Run in development mode
dotnet run

# Run with hot reload
dotnet watch run

# Build for production
dotnet build --configuration Release

# Run tests (if available)
dotnet test
```

### Project Structure
```
Snake/
├── frontend/
│   ├── src/
│   │   ├── game.ts          # Core game logic
│   │   ├── controller.ts    # Game controller and UI
│   │   ├── sound.ts         # Audio management
│   │   ├── storage.ts       # Local storage and API client
│   │   ├── types.ts         # TypeScript interfaces
│   │   ├── styles.css       # Retro styling
│   │   ├── main.ts          # Entry point
│   │   └── tests/           # Unit tests
│   ├── index.html           # Main HTML file
│   ├── package.json         # Dependencies and scripts
│   ├── tsconfig.json        # TypeScript configuration
│   └── vite.config.ts       # Vite configuration
├── backend/
│   └── SnakeGameApi/
│       ├── Controllers/     # API controllers
│       ├── Models/          # Data models
│       ├── Services/        # Business logic
│       ├── Data/            # Database context
│       ├── Program.cs       # Application entry point
│       └── SnakeGameApi.csproj
└── README.md
```

## 🌐 API Endpoints

### GET /api/leaderboard
Get top scores from the global leaderboard.

**Parameters:**
- `limit` (optional): Number of scores to return (1-100, default: 10)

**Response:**
```json
[
  {
    "name": "Player1",
    "score": 1250,
    "date": "2025-01-15 14:30:22"
  }
]
```

### POST /api/leaderboard
Submit a new score to the global leaderboard.

**Request Body:**
```json
{
  "name": "Player1",
  "score": 1250
}
```

**Response:** `201 Created` on success

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T14:30:22Z"
}
```

## 🏭 Production Deployment

### Frontend Deployment

#### Static Hosting (Netlify, Vercel, etc.)
```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

#### Docker
```dockerfile
FROM nginx:alpine
COPY frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Deployment

#### Self-Contained Deployment
```bash
cd backend/SnakeGameApi
dotnet publish -c Release -r win-x64 --self-contained
```

#### Docker
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY backend/SnakeGameApi/bin/Release/net9.0/publish/ .
EXPOSE 80
ENTRYPOINT ["dotnet", "SnakeGameApi.dll"]
```

#### Environment Variables
- `ASPNETCORE_ENVIRONMENT`: Set to `Production`
- `ConnectionStrings__DefaultConnection`: Database connection string
- `ASPNETCORE_URLS`: Binding URLs (e.g., `http://+:80`)

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test
```

Tests cover:
- Snake movement logic
- Collision detection
- Direction changes and validation
- Game state management

### Backend Tests
Currently using manual testing. Future enhancements could include:
- Unit tests for controller logic
- Integration tests for API endpoints
- Database operation tests

## 🎨 Customization

### Visual Themes
The game includes retro Nokia styling by default. To customize:

1. **Colors**: Edit CSS variables in `src/styles.css`
2. **Grid Size**: Modify `gridSize` in game settings
3. **Snake Appearance**: Update rendering logic in `game.ts`

### Game Parameters
Key configurable parameters in `controller.ts`:
- `gridSize`: Game grid dimensions (default: 20x20)
- `initialSpeed`: Starting game speed (default: 8 ticks/second)
- `cellSize`: Pixel size of each grid cell (default: 20px)

### Sound Effects
Customize beep sounds in `sound.ts`:
- Modify frequencies and durations
- Add new sound effects
- Change waveform types

## 🐛 Troubleshooting

### Common Issues

#### Frontend won't start
- Ensure Node.js 18+ is installed
- Delete `node_modules` and run `npm install` again
- Check for port conflicts (default: 3000)

#### Backend API errors
- Verify .NET 9 SDK is installed
- Check if port 5000/5001 is available
- Ensure SQLite database permissions

#### CORS errors
- Verify frontend is running on `http://localhost:3000`
- Check backend CORS configuration in `Program.cs`
- Use correct API base URL in frontend

#### Game performance issues
- Reduce game speed in options
- Check browser developer tools for errors
- Ensure hardware acceleration is enabled

### Debug Mode
Enable debug mode by setting `NODE_ENV=development` for additional logging.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript/C# coding standards
- Add unit tests for new features
- Update documentation for API changes
- Test on both desktop and mobile browsers

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements

### Potential Features
- **Multiplayer**: Real-time multiplayer using SignalR
- **Power-ups**: Special food items with unique effects
- **Themes**: Multiple visual themes and skins
- **Achievements**: Achievement system with unlockables
- **Social Sharing**: Share scores on social media
- **PWA**: Progressive Web App with offline support
- **Analytics**: Game analytics and statistics

### Technical Improvements
- **Database Migration**: Move from in-memory to persistent SQLite
- **Caching**: Redis caching for leaderboards
- **Rate Limiting**: Advanced rate limiting and abuse prevention
- **WebSockets**: Real-time leaderboard updates
- **Mobile App**: Native mobile app versions

## 🙏 Acknowledgments

- Inspired by the classic Nokia Snake game
- Retro font from Google Fonts (Orbitron)
- Snake game mechanics based on traditional implementations
- Modern web technologies for enhanced user experience

---

**Have fun playing! 🎮🐍**

