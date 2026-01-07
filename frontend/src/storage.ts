import { ScoreEntry } from './types.js';

const API_BASE_URL = 'http://localhost:5102/api';

export class ApiClient {
  async getLeaderboard(limit = 10): Promise<ScoreEntry[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard?limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      return [];
    }
  }

  async submitScore(name: string, score: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, score }),
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to submit score:', error);
      return false;
    }
  }
}

export class LocalStorage {
  private static readonly HIGH_SCORE_KEY = 'snake-high-score';
  private static readonly SETTINGS_KEY = 'snake-settings';

  static getHighScore(): number {
    const stored = localStorage.getItem(this.HIGH_SCORE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  }

  static setHighScore(score: number): void {
    localStorage.setItem(this.HIGH_SCORE_KEY, score.toString());
  }

  static getSettings() {
    const stored = localStorage.getItem(this.SETTINGS_KEY);
    return stored ? JSON.parse(stored) : {
      speed: 8,
      wallMode: 'solid',
      soundEnabled: true
    };
  }

  static setSettings(settings: any): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }
}
