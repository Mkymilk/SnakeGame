import { describe, it, expect, beforeEach } from 'vitest';
import { SnakeGame } from '../game.js';
import { Direction, GameSettings } from '../types.js';

describe('SnakeGame', () => {
  let canvas: HTMLCanvasElement;
  let settings: GameSettings;
  let game: SnakeGame;

  beforeEach(() => {
    // Create a mock canvas
    canvas = document.createElement('canvas');
    settings = {
      gridSize: 20,
      cellSize: 20,
      canvasWidth: 400,
      canvasHeight: 400,
      initialSpeed: 8,
      wallMode: 'solid',
      soundEnabled: true
    };
    game = new SnakeGame(canvas, settings);
  });

  it('should initialize with correct initial state', () => {
    const state = game.getState();
    
    expect(state.snake).toHaveLength(3);
    expect(state.direction).toBe(Direction.RIGHT);
    expect(state.score).toBe(0);
    expect(state.isGameOver).toBe(false);
    expect(state.isPaused).toBe(false);
  });

  it('should change direction correctly', () => {
    game.changeDirection(Direction.UP);
    const state = game.getState();
    expect(state.nextDirection).toBe(Direction.UP);
  });

  it('should not allow 180-degree direction changes', () => {
    // Initially moving right, try to go left
    game.changeDirection(Direction.LEFT);
    const state = game.getState();
    expect(state.nextDirection).toBe(Direction.RIGHT); // Should remain right
  });

  it('should reset game state correctly', () => {
    // Change some state
    game.changeDirection(Direction.UP);
    
    // Reset
    game.reset();
    
    const state = game.getState();
    expect(state.snake).toHaveLength(3);
    expect(state.direction).toBe(Direction.RIGHT);
    expect(state.score).toBe(0);
    expect(state.isGameOver).toBe(false);
  });

  it('should handle wrap mode correctly', () => {
    settings.wallMode = 'wrap';
    game.updateSettings(settings);
    
    const state = game.getState();
    expect(state.wallMode).toBe('wrap');
  });
});
