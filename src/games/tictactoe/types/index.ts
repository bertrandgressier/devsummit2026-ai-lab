// Core tic-tac-toe types used by logic, AI and scenes
export enum Player {
  X = 'X',
  O = 'O',
  None = 'None',
}

export enum GameResult {
  X_WINS = 'X_WINS',
  O_WINS = 'O_WINS',
  DRAW = 'DRAW',
  ONGOING = 'ONGOING',
}

// Board is a flat 9-element array indexed 0..8
export type Board = Player[];

// Move is represented by a single index into the Board (0..8)
export type Move = number;

export enum Difficulty {
  Easy = 'easy',
  Hard = 'hard',
}

// Scene and data shapes used by Phaser scenes (kept for compatibility)
export interface SceneData {
  difficulty: Difficulty;
}

export interface GameOverData {
  result: GameResult;
  difficulty: Difficulty;
}
