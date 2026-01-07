// Test setup file
import { beforeAll } from 'vitest';

beforeAll(() => {
  // Mock Web Audio API
  global.AudioContext = class {
    createOscillator() {
      return {
        connect: () => {},
        type: 'square',
        frequency: { setValueAtTime: () => {} },
        start: () => {},
        stop: () => {}
      };
    }
    createGain() {
      return {
        connect: () => {},
        gain: { 
          setValueAtTime: () => {}, 
          exponentialRampToValueAtTime: () => {} 
        }
      };
    }
    get destination() {
      return {};
    }
    get currentTime() {
      return 0;
    }
  } as any;

  // Mock Canvas API
  HTMLCanvasElement.prototype.getContext = function(contextId: string) {
    if (contextId === '2d') {
      return {
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        imageSmoothingEnabled: true,
        fillRect: () => {},
        strokeRect: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        stroke: () => {},
        fill: () => {}
      } as any;
    }
    return null;
  };
});
