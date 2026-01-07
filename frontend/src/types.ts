export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  speed: number;
  wallMode: 'solid' | 'wrap';
  soundEnabled: boolean;
}

export interface GameSettings {
  gridSize: number;
  cellSize: number;
  canvasWidth: number;
  canvasHeight: number;
  initialSpeed: number;
  wallMode: 'solid' | 'wrap';
  soundEnabled: boolean;
}

export interface ScoreEntry {
  name: string;
  score: number;
  date: string;
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export enum GameScreen {
  MENU = 'MENU',
  GAME = 'GAME',
  OPTIONS = 'OPTIONS',
  GAME_OVER = 'GAME_OVER',
  LEADERBOARD = 'LEADERBOARD',
  PAUSE = 'PAUSE'
}
