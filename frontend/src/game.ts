import { Position, GameState, GameSettings, Direction } from './types.js';

export class SnakeGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private settings: GameSettings;
  private state: GameState;
  private gameLoop: number | null = null;
  private lastMoveTime = 0;

  constructor(canvas: HTMLCanvasElement, settings: GameSettings) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.settings = settings;
    
    // Set canvas size
    this.canvas.width = settings.canvasWidth;
    this.canvas.height = settings.canvasHeight;
    
    this.state = this.createInitialState();
    this.setupRendering();
  }

  private createInitialState(): GameState {
    const centerX = Math.floor(this.settings.gridSize / 2);
    const centerY = Math.floor(this.settings.gridSize / 2);
    
    return {
      snake: [
        { x: centerX, y: centerY },
        { x: centerX - 1, y: centerY },
        { x: centerX - 2, y: centerY }
      ],
      food: this.generateFood([]),
      direction: Direction.RIGHT,
      nextDirection: Direction.RIGHT,
      score: 0,
      isGameOver: false,
      isPaused: false,
      speed: this.settings.initialSpeed,
      wallMode: this.settings.wallMode,
      soundEnabled: this.settings.soundEnabled
    };
  }

  private setupRendering() {
    this.ctx.imageSmoothingEnabled = false;
  }

  private generateFood(snake: Position[]): Position {
    let food: Position;
    do {
      food = {
        x: Math.floor(Math.random() * this.settings.gridSize),
        y: Math.floor(Math.random() * this.settings.gridSize)
      };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    return food;
  }

  changeDirection(newDirection: Direction) {
    // Prevent 180-degree turns
    const opposites = {
      [Direction.UP]: Direction.DOWN,
      [Direction.DOWN]: Direction.UP,
      [Direction.LEFT]: Direction.RIGHT,
      [Direction.RIGHT]: Direction.LEFT
    };

    if (opposites[this.state.direction] !== newDirection) {
      this.state.nextDirection = newDirection;
    }
  }

  start() {
    if (this.gameLoop) return;
    
    this.lastMoveTime = Date.now();
    this.gameLoop = requestAnimationFrame(() => this.update());
  }

  stop() {
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
  }

  pause() {
    this.state.isPaused = true;
    this.stop();
  }

  resume() {
    this.state.isPaused = false;
    this.start();
  }

  reset() {
    this.stop();
    this.state = this.createInitialState();
    this.render();
  }

  updateSettings(newSettings: Partial<GameSettings>) {
    Object.assign(this.settings, newSettings);
    this.state.speed = newSettings.initialSpeed || this.state.speed;
    this.state.wallMode = newSettings.wallMode || this.state.wallMode;
    this.state.soundEnabled = newSettings.soundEnabled ?? this.state.soundEnabled;
  }

  getState(): GameState {
    return { ...this.state };
  }

  private update() {
    const now = Date.now();
    const moveInterval = 1000 / this.state.speed;

    if (now - this.lastMoveTime >= moveInterval) {
      this.move();
      this.lastMoveTime = now;
    }

    this.render();

    if (!this.state.isGameOver && !this.state.isPaused) {
      this.gameLoop = requestAnimationFrame(() => this.update());
    }
  }

  private move() {
    if (this.state.isGameOver || this.state.isPaused) return;

    // Update direction
    this.state.direction = this.state.nextDirection;

    // Calculate new head position
    const head = { ...this.state.snake[0] };
    switch (this.state.direction) {
      case Direction.UP:
        head.y--;
        break;
      case Direction.DOWN:
        head.y++;
        break;
      case Direction.LEFT:
        head.x--;
        break;
      case Direction.RIGHT:
        head.x++;
        break;
    }

    // Handle wall collision
    if (this.state.wallMode === 'wrap') {
      head.x = (head.x + this.settings.gridSize) % this.settings.gridSize;
      head.y = (head.y + this.settings.gridSize) % this.settings.gridSize;
    } else {
      if (head.x < 0 || head.x >= this.settings.gridSize || 
          head.y < 0 || head.y >= this.settings.gridSize) {
        this.state.isGameOver = true;
        return;
      }
    }

    // Check self collision
    if (this.state.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.state.isGameOver = true;
      return;
    }

    // Add new head
    this.state.snake.unshift(head);

    // Check food collision
    if (head.x === this.state.food.x && head.y === this.state.food.y) {
      this.state.score += 10;
      this.state.food = this.generateFood(this.state.snake);
      
      // Increase speed slightly
      this.state.speed = Math.min(this.state.speed + 0.1, 15);
    } else {
      // Remove tail if no food eaten
      this.state.snake.pop();
    }
  }

  private render() {
    // Clear canvas
    this.ctx.fillStyle = '#1a2e1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid (subtle)
    this.ctx.strokeStyle = '#2a4a2a';
    this.ctx.lineWidth = 1;
    for (let x = 0; x <= this.settings.gridSize; x++) {
      const xPos = x * this.settings.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(xPos, 0);
      this.ctx.lineTo(xPos, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y <= this.settings.gridSize; y++) {
      const yPos = y * this.settings.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(0, yPos);
      this.ctx.lineTo(this.canvas.width, yPos);
      this.ctx.stroke();
    }

    // Draw snake
    this.state.snake.forEach((segment, index) => {
      const x = segment.x * this.settings.cellSize;
      const y = segment.y * this.settings.cellSize;
      
      if (index === 0) {
        // Head
        this.ctx.fillStyle = '#90EE90';
        this.ctx.fillRect(x + 1, y + 1, this.settings.cellSize - 2, this.settings.cellSize - 2);
        
        // Eyes
        this.ctx.fillStyle = '#000';
        const eyeSize = 2;
        const eyeOffset = 3;
        
        switch (this.state.direction) {
          case Direction.UP:
            this.ctx.fillRect(x + eyeOffset, y + 2, eyeSize, eyeSize);
            this.ctx.fillRect(x + this.settings.cellSize - eyeOffset - eyeSize, y + 2, eyeSize, eyeSize);
            break;
          case Direction.DOWN:
            this.ctx.fillRect(x + eyeOffset, y + this.settings.cellSize - 4, eyeSize, eyeSize);
            this.ctx.fillRect(x + this.settings.cellSize - eyeOffset - eyeSize, y + this.settings.cellSize - 4, eyeSize, eyeSize);
            break;
          case Direction.LEFT:
            this.ctx.fillRect(x + 2, y + eyeOffset, eyeSize, eyeSize);
            this.ctx.fillRect(x + 2, y + this.settings.cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
            break;
          case Direction.RIGHT:
            this.ctx.fillRect(x + this.settings.cellSize - 4, y + eyeOffset, eyeSize, eyeSize);
            this.ctx.fillRect(x + this.settings.cellSize - 4, y + this.settings.cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
            break;
        }
      } else {
        // Body
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(x + 1, y + 1, this.settings.cellSize - 2, this.settings.cellSize - 2);
      }
    });

    // Draw food
    const foodX = this.state.food.x * this.settings.cellSize;
    const foodY = this.state.food.y * this.settings.cellSize;
    this.ctx.fillStyle = '#FF4444';
    this.ctx.fillRect(foodX + 2, foodY + 2, this.settings.cellSize - 4, this.settings.cellSize - 4);
    
    // Food highlight
    this.ctx.fillStyle = '#FF8888';
    this.ctx.fillRect(foodX + 3, foodY + 3, this.settings.cellSize - 8, this.settings.cellSize - 8);
  }
}
