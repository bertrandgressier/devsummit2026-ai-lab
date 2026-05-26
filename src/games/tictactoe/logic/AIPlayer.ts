import { Board, Difficulty, Player, GameState } from '../types';
import { GameLogic } from './GameLogic';

export class AIPlayer {
  getBestMove(
    _board: Board,
    _difficulty: Difficulty
  ): { row: number; col: number } {
    const logic = new GameLogic();
    logic.setBoardState(_board);

    const empty = logic.getEmptyCells();
    if (empty.length === 0) return { row: 0, col: 0 };

    if (_difficulty === Difficulty.Easy) {
      // deterministic random-like: pick first empty cell (to be deterministic) or middle if available
      // prefer center
      for (const [r, c] of empty) {
        if (r === 1 && c === 1) return { row: 1, col: 1 };
      }
      return { row: empty[0][0], col: empty[0][1] };
    }

    // Hard: simple minimax for Player.O (AI plays O). We'll assume AI is O.
    const maximize = (board: Board, player: Player): number => {
      logic.setBoardState(board);
      const evalRes = logic.evaluate();
      if (evalRes.state === GameState.WonX) return -1;
      if (evalRes.state === GameState.WonO) return 1;
      if (evalRes.state === GameState.Draw) return 0;

      const empties = logic.getEmptyCells();
      if (player === Player.O) {
        let best = -Infinity;
        for (const [r, c] of empties) {
          const nb = board.map((row) => [...row]);
          nb[r][c] = Player.O;
          const score = maximize(nb, Player.X);
          best = Math.max(best, score);
        }
        return best;
      } else {
        let best = Infinity;
        for (const [r, c] of empties) {
          const nb = board.map((row) => [...row]);
          nb[r][c] = Player.X;
          const score = maximize(nb, Player.O);
          best = Math.min(best, score);
        }
        return best;
      }
    };

    let bestScore = -Infinity;
    let bestMove = empty[0];
    for (const [r, c] of empty) {
      const nb = _board.map((row) => [...row]);
      nb[r][c] = Player.O;
      const score = maximize(nb, Player.X);
      if (score > bestScore) {
        bestScore = score;
        bestMove = [r, c];
      }
    }

    return { row: bestMove[0], col: bestMove[1] };
  }
}
