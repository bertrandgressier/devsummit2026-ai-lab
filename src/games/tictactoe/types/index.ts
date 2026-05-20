export enum Player {
  X = 'X',
  O = 'O',
}

export enum Difficulty {
  Easy = 'easy',
  Hard = 'hard',
}

export enum GameState {
  Playing = 'playing',
  WonX = 'wonX',
  WonO = 'wonO',
  Draw = 'draw',
}

export type CellValue = Player | null;
export type Board = CellValue[][];

export interface GameResult {
  state: GameState;
  winningCells: [number, number][] | null;
}

export interface SceneData {
  difficulty: Difficulty;
}

export interface GameOverData {
  result: GameState;
  difficulty: Difficulty;
}
