import { Board, CellValue, Difficulty, GameResult, GameState, Player } from '../types';

export class GameLogic {
  createBoard(): Board {
    return Array.from({ length: 3 }, () => Array(3).fill(null) as CellValue[]);
  }

  makeMove(board: Board, row: number, col: number, player: Player): Board {
    const next = board.map(r => [...r]) as Board;
    next[row][col] = player;
    return next;
  }

  checkWinner(board: Board): Player | null {
    const lines: [number, number][][] = [
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      const va = board[a[0]][a[1]];
      const vb = board[b[0]][b[1]];
      const vc = board[c[0]][c[1]];
      if (va !== null && va === vb && va === vc) {
        return va as Player;
      }
    }
    return null;
  }

  getWinningCells(board: Board): [number, number][] | null {
    const lines: [number, number][][] = [
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (
        board[a[0]][a[1]] !== null &&
        board[a[0]][a[1]] === board[b[0]][b[1]] &&
        board[a[0]][a[1]] === board[c[0]][c[1]]
      ) {
        return line as [number, number][];
      }
    }
    return null;
  }

  isDraw(board: Board): boolean {
    return board.every(row => row.every(cell => cell !== null)) && this.checkWinner(board) === null;
  }

  getEmptyCells(board: Board): Array<{ row: number; col: number }> {
    const cells: Array<{ row: number; col: number }> = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === null) cells.push({ row, col });
      }
    }
    return cells;
  }

  evaluate(board: Board): GameResult {
    const winner = this.checkWinner(board);
    if (winner === Player.X) return { state: GameState.WonX, winningCells: this.getWinningCells(board) };
    if (winner === Player.O) return { state: GameState.WonO, winningCells: this.getWinningCells(board) };
    if (this.isDraw(board)) return { state: GameState.Draw, winningCells: null };
    return { state: GameState.Playing, winningCells: null };
  }
}

export class AIPlayer {
  private logic = new GameLogic();

  getMove(board: Board, difficulty: Difficulty): { row: number; col: number } {
    if (difficulty === Difficulty.Easy) return this.randomMove(board);
    return this.bestMove(board);
  }

  private randomMove(board: Board): { row: number; col: number } {
    const empty = this.logic.getEmptyCells(board);
    return empty[Math.floor(Math.random() * empty.length)];
  }

  private bestMove(board: Board): { row: number; col: number } {
    let best = -Infinity;
    let move = { row: 0, col: 0 };
    for (const cell of this.logic.getEmptyCells(board)) {
      const next = this.logic.makeMove(board, cell.row, cell.col, Player.O);
      const score = this.minimax(next, false);
      if (score > best) {
        best = score;
        move = cell;
      }
    }
    return move;
  }

  private minimax(board: Board, isMaximizing: boolean): number {
    const winner = this.logic.checkWinner(board);
    if (winner === Player.O) return 10;
    if (winner === Player.X) return -10;
    if (this.logic.isDraw(board)) return 0;

    if (isMaximizing) {
      let best = -Infinity;
      for (const cell of this.logic.getEmptyCells(board)) {
        const next = this.logic.makeMove(board, cell.row, cell.col, Player.O);
        best = Math.max(best, this.minimax(next, false));
      }
      return best;
    } else {
      let best = Infinity;
      for (const cell of this.logic.getEmptyCells(board)) {
        const next = this.logic.makeMove(board, cell.row, cell.col, Player.X);
        best = Math.min(best, this.minimax(next, true));
      }
      return best;
    }
  }
}
