import { GameController } from './controller.js';

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GameController();
});

// Prevent zoom on double tap for mobile
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);
