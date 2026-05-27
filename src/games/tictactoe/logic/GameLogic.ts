import { Board, GameResult, Player } from '../types';

export class GameLogic {
  private _board: Board = [
    Player.None,
    Player.None,
    Player.None,
    Player.None,
    Player.None,
    Player.None,
    Player.None,
    Player.None,
    Player.None,
  ];

  get board(): Board {
    return this._board;
  }

  private _winningCells: number[] | null = null;

  private moveCallbacks: Array<(index: number, player: Player) => void> = [];
  private gameOverCallbacks: Array<(result: GameResult, winningCells: number[] | null) => void> = [];

  // index is 0..8
  makeMove(index: number, player: Player): boolean {
    if (index < 0 || index > 8) return false;
    if (this._board[index] !== Player.None) return false;
    this._board[index] = player;

    // notify move
    for (const cb of this.moveCallbacks) cb(index, player);

    const result = this.evaluate();
    if (result !== GameResult.ONGOING) {
      for (const cb of this.gameOverCallbacks) cb(result, this._winningCells);
    }

    return true;
  }

  evaluate(): GameResult {
    const b = this._board;
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, bidx, c] of lines) {
      const v1 = b[a];
      const v2 = b[bidx];
      const v3 = b[c];
      if (v1 !== Player.None && v1 === v2 && v2 === v3) {
        this._winningCells = [a, bidx, c];
        return v1 === Player.X ? GameResult.X_WINS : GameResult.O_WINS;
      }
    }

    const isDraw = this._board.every((v) => v !== Player.None);
    if (isDraw) {
      this._winningCells = [];
      return GameResult.DRAW;
    }

    this._winningCells = null;
    return GameResult.ONGOING;
  }

  getEmptyCells(): number[] {
    const res: number[] = [];
    for (let i = 0; i < this._board.length; i++) {
      if (this._board[i] === Player.None) res.push(i);
    }
    return res;
  }

  cloneBoard(): Board {
    return [...this._board];
  }

  setBoardState(board: Board): void {
    this._board = [...board];
  }

  reset(): void {
    this._board = [
      Player.None,
      Player.None,
      Player.None,
      Player.None,
      Player.None,
      Player.None,
      Player.None,
      Player.None,
      Player.None,
    ];
  }

  getWinningCells(): number[] | null {
    return this._winningCells ? [...this._winningCells] : null;
  }

  onMove(cb: (index: number, player: Player) => void): void {
    this.moveCallbacks.push(cb);
  }

  onGameOver(cb: (result: GameResult, winningCells: number[] | null) => void): void {
    this.gameOverCallbacks.push(cb);
  }
}
