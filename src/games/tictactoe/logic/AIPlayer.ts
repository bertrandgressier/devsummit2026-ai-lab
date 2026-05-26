import { Board, Difficulty } from '../types';

export class AIPlayer {
  getBestMove(
    _board: Board,
    _difficulty: Difficulty
  ): { row: number; col: number } {
    return { row: 0, col: 0 };
  }
}
