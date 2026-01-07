import { SnakeGame } from './game.js';
import { SoundManager } from './sound.js';
import { ApiClient, LocalStorage } from './storage.js';
import { Direction, GameScreen, GameSettings, ScoreEntry } from './types.js';

export class GameController {
  private game!: SnakeGame;
  private soundManager: SoundManager;
  private apiClient: ApiClient;
  private currentScreen: GameScreen = GameScreen.MENU;
  private settings: GameSettings;
  private highScore: number;

  // UI Elements
  private elements!: { [key: string]: HTMLElement };

  constructor() {
    this.soundManager = new SoundManager();
    this.apiClient = new ApiClient();
    
    // Load settings
    const savedSettings = LocalStorage.getSettings();
    this.settings = {
      gridSize: 20,
      cellSize: 20,
      canvasWidth: 400,
      canvasHeight: 400,
      initialSpeed: savedSettings.speed || 8,
      wallMode: savedSettings.wallMode || 'solid',
      soundEnabled: savedSettings.soundEnabled ?? true
    };

    this.highScore = LocalStorage.getHighScore();
    
    this.initializeElements();
    this.initializeGame();
    this.setupEventListeners();
    this.updateUI();
    this.showScreen(GameScreen.MENU);
  }

  private initializeElements() {
    this.elements = {
      canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
      score: document.getElementById('score')!,
      highScore: document.getElementById('high-score')!,
      menuScreen: document.getElementById('menu-screen')!,
      optionsScreen: document.getElementById('options-screen')!,
      gameOverScreen: document.getElementById('game-over-screen')!,
      leaderboardScreen: document.getElementById('leaderboard-screen')!,
      pauseScreen: document.getElementById('pause-screen')!,
      playBtn: document.getElementById('play-btn')!,
      optionsBtn: document.getElementById('options-btn')!,
      leaderboardBtn: document.getElementById('leaderboard-btn')!,
      backBtn: document.getElementById('back-btn')!,
      leaderboardBackBtn: document.getElementById('leaderboard-back-btn')!,
      speedSelect: document.getElementById('speed-select')!,
      wallsSelect: document.getElementById('walls-select')!,
      soundToggle: document.getElementById('sound-toggle')!,
      finalScore: document.getElementById('final-score')!,
      highScoreMsg: document.getElementById('high-score-msg')!,
      playerName: document.getElementById('player-name')!,
      submitScoreBtn: document.getElementById('submit-score-btn')!,
      playAgainBtn: document.getElementById('play-again-btn')!,
      mainMenuBtn: document.getElementById('main-menu-btn')!,
      leaderboardList: document.getElementById('leaderboard-list')!,
      pauseBtn: document.getElementById('pause-btn')!,
      upBtn: document.getElementById('up-btn')!,
      downBtn: document.getElementById('down-btn')!,
      leftBtn: document.getElementById('left-btn')!,
      rightBtn: document.getElementById('right-btn')!
    };
  }

  private initializeGame() {
    this.game = new SnakeGame(this.elements.canvas as HTMLCanvasElement, this.settings);
    this.soundManager.setEnabled(this.settings.soundEnabled);
  }

  private setupEventListeners() {
    // Menu buttons
    this.elements.playBtn.addEventListener('click', () => this.startGame());
    this.elements.optionsBtn.addEventListener('click', () => this.showOptions());
    this.elements.leaderboardBtn.addEventListener('click', () => this.showLeaderboard());
    this.elements.backBtn.addEventListener('click', () => this.showScreen(GameScreen.MENU));
    this.elements.leaderboardBackBtn.addEventListener('click', () => this.showScreen(GameScreen.MENU));

    // Game over buttons
    this.elements.playAgainBtn.addEventListener('click', () => this.startGame());
    this.elements.mainMenuBtn.addEventListener('click', () => this.showScreen(GameScreen.MENU));
    this.elements.submitScoreBtn.addEventListener('click', () => this.submitScore());

    // Control buttons
    this.elements.pauseBtn.addEventListener('click', () => this.togglePause());
    this.elements.upBtn.addEventListener('click', () => this.changeDirection(Direction.UP));
    this.elements.downBtn.addEventListener('click', () => this.changeDirection(Direction.DOWN));
    this.elements.leftBtn.addEventListener('click', () => this.changeDirection(Direction.LEFT));
    this.elements.rightBtn.addEventListener('click', () => this.changeDirection(Direction.RIGHT));

    // Settings
    this.elements.speedSelect.addEventListener('change', () => this.updateSettings());
    this.elements.wallsSelect.addEventListener('change', () => this.updateSettings());
    this.elements.soundToggle.addEventListener('change', () => this.updateSettings());

    // Keyboard controls
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));

    // Prevent context menu on touch controls
    document.querySelectorAll('.control-btn').forEach(btn => {
      btn.addEventListener('contextmenu', (e) => e.preventDefault());
    });
  }

  private handleKeyPress(e: KeyboardEvent) {
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        e.preventDefault();
        this.changeDirection(Direction.UP);
        break;
      case 'ArrowDown':
      case 'KeyS':
        e.preventDefault();
        this.changeDirection(Direction.DOWN);
        break;
      case 'ArrowLeft':
      case 'KeyA':
        e.preventDefault();
        this.changeDirection(Direction.LEFT);
        break;
      case 'ArrowRight':
      case 'KeyD':
        e.preventDefault();
        this.changeDirection(Direction.RIGHT);
        break;
      case 'Space':
        e.preventDefault();
        if (this.currentScreen === GameScreen.GAME || this.currentScreen === GameScreen.PAUSE) {
          this.togglePause();
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (this.currentScreen === GameScreen.MENU) {
          this.startGame();
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (this.currentScreen === GameScreen.GAME) {
          this.togglePause();
        } else if (this.currentScreen !== GameScreen.MENU) {
          this.showScreen(GameScreen.MENU);
        }
        break;
    }
  }

  private changeDirection(direction: Direction) {
    if (this.currentScreen === GameScreen.GAME) {
      this.game.changeDirection(direction);
      this.soundManager.playMove();
    }
  }

  private startGame() {
    this.soundManager.playMenuSelect();
    this.game.reset();
    this.game.start();
    this.showScreen(GameScreen.GAME);
    this.gameLoop();
  }

  private async gameLoop() {
    if (this.currentScreen !== GameScreen.GAME) return;

    const state = this.game.getState();
    
    if (state.isGameOver) {
      this.handleGameOver(state.score);
      return;
    }

    this.updateScore(state.score);
    
    // Continue game loop
    setTimeout(() => this.gameLoop(), 50);
  }

  private handleGameOver(score: number) {
    this.soundManager.playGameOver();
    
    // Update high score
    if (score > this.highScore) {
      this.highScore = score;
      LocalStorage.setHighScore(this.highScore);
      this.elements.highScoreMsg.style.display = 'block';
      this.elements.playerName.style.display = 'block';
      this.elements.submitScoreBtn.style.display = 'block';
    } else {
      this.elements.highScoreMsg.style.display = 'none';
      this.elements.playerName.style.display = 'none';
      this.elements.submitScoreBtn.style.display = 'none';
    }

    this.elements.finalScore.textContent = `Score: ${score}`;
    this.updateUI();
    this.showScreen(GameScreen.GAME_OVER);
  }

  private async submitScore() {
    const name = (this.elements.playerName as HTMLInputElement).value.trim();
    if (!name) return;

    const score = this.game.getState().score;
    const success = await this.apiClient.submitScore(name, score);
    
    if (success) {
      this.elements.submitScoreBtn.textContent = 'SUBMITTED!';
      (this.elements.submitScoreBtn as HTMLButtonElement).disabled = true;
      this.soundManager.playMenuSelect();
    } else {
      this.elements.submitScoreBtn.textContent = 'FAILED';
      setTimeout(() => {
        this.elements.submitScoreBtn.textContent = 'SUBMIT';
      }, 2000);
    }
  }

  private togglePause() {
    if (this.currentScreen === GameScreen.GAME) {
      this.game.pause();
      this.showScreen(GameScreen.PAUSE);
    } else if (this.currentScreen === GameScreen.PAUSE) {
      this.game.resume();
      this.showScreen(GameScreen.GAME);
      this.gameLoop();
    }
  }

  private showOptions() {
    this.soundManager.playMenuSelect();
    
    // Update UI with current settings
    (this.elements.speedSelect as HTMLSelectElement).value = this.settings.initialSpeed.toString();
    (this.elements.wallsSelect as HTMLSelectElement).value = this.settings.wallMode;
    (this.elements.soundToggle as HTMLInputElement).checked = this.settings.soundEnabled;
    
    this.showScreen(GameScreen.OPTIONS);
  }

  private updateSettings() {
    this.settings.initialSpeed = parseInt((this.elements.speedSelect as HTMLSelectElement).value);
    this.settings.wallMode = (this.elements.wallsSelect as HTMLSelectElement).value as 'solid' | 'wrap';
    this.settings.soundEnabled = (this.elements.soundToggle as HTMLInputElement).checked;

    this.game.updateSettings(this.settings);
    this.soundManager.setEnabled(this.settings.soundEnabled);

    // Save settings
    LocalStorage.setSettings({
      speed: this.settings.initialSpeed,
      wallMode: this.settings.wallMode,
      soundEnabled: this.settings.soundEnabled
    });

    this.soundManager.playMenuSelect();
  }

  private async showLeaderboard() {
    this.soundManager.playMenuSelect();
    this.elements.leaderboardList.innerHTML = '<div>Loading...</div>';
    this.showScreen(GameScreen.LEADERBOARD);

    const scores = await this.apiClient.getLeaderboard();
    this.renderLeaderboard(scores);
  }

  private renderLeaderboard(scores: ScoreEntry[]) {
    if (scores.length === 0) {
      this.elements.leaderboardList.innerHTML = '<div>No scores yet!</div>';
      return;
    }

    const html = scores.map((entry, index) => `
      <div class="leaderboard-entry">
        <span class="leaderboard-rank">${index + 1}.</span>
        <span class="leaderboard-name">${entry.name}</span>
        <span class="leaderboard-score">${entry.score}</span>
      </div>
    `).join('');

    this.elements.leaderboardList.innerHTML = html;
  }

  private showScreen(screen: GameScreen) {
    this.currentScreen = screen;

    // Hide all screens
    this.elements.menuScreen.style.display = 'none';
    this.elements.optionsScreen.style.display = 'none';
    this.elements.gameOverScreen.style.display = 'none';
    this.elements.leaderboardScreen.style.display = 'none';
    this.elements.pauseScreen.style.display = 'none';

    // Show target screen
    switch (screen) {
      case GameScreen.MENU:
        this.elements.menuScreen.style.display = 'flex';
        break;
      case GameScreen.OPTIONS:
        this.elements.optionsScreen.style.display = 'flex';
        break;
      case GameScreen.GAME_OVER:
        this.elements.gameOverScreen.style.display = 'flex';
        break;
      case GameScreen.LEADERBOARD:
        this.elements.leaderboardScreen.style.display = 'flex';
        break;
      case GameScreen.PAUSE:
        this.elements.pauseScreen.style.display = 'flex';
        break;
      case GameScreen.GAME:
        // Game screen shows canvas directly
        break;
    }
  }

  private updateScore(score: number) {
    this.elements.score.textContent = score.toString();
  }

  private updateUI() {
    this.elements.highScore.textContent = this.highScore.toString();
  }
}
