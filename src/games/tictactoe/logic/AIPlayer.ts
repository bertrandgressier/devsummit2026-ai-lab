import { Board, Difficulty, Player, Move, GameResult } from '../types';
import { GameLogic } from './GameLogic';

export class AIPlayer {
  getBestMove(board: Board, difficulty: Difficulty, aiPlayer: Player): Move {
    const logic = new GameLogic();
    logic.setBoardState(board);

    const empties = logic.getEmptyCells();
    if (empties.length === 0) return -1;

    if (difficulty === Difficulty.Easy) {
      return empties[Math.floor(Math.random() * empties.length)];
    }

    // Hard -> minimax
    const minimax = (boardState: Board, player: Player): { score: number; move: Move } => {
      logic.setBoardState(boardState);
      const evalRes = logic.evaluate();
      if (evalRes === GameResult.X_WINS) return { score: aiPlayer === Player.X ? 10 : -10, move: -1 };
      if (evalRes === GameResult.O_WINS) return { score: aiPlayer === Player.O ? 10 : -10, move: -1 };
      if (evalRes === GameResult.DRAW) return { score: 0, move: -1 };

      const moves = logic.getEmptyCells();
      let best = { score: player === aiPlayer ? -Infinity : Infinity, move: -1 };

      for (const m of moves) {
        const copy = [...boardState];
        copy[m] = player;
        const next = minimax(copy, player === Player.X ? Player.O : Player.X);
        if (player === aiPlayer) {
          if (next.score > best.score) best = { score: next.score, move: m };
        } else {
          if (next.score < best.score) best = { score: next.score, move: m };
        }
      }

      return best;
    };

    const result = minimax(board, aiPlayer);
    return result.move >= 0 ? result.move : empties[0];
  }
}
