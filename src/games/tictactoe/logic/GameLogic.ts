import { Board, GameResult, GameState, Player } from '../types';

export class GameLogic {
  private _board: Board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  get board(): Board {
    return this._board;
  }

  makeMove(_row: number, _col: number, _player: Player): boolean {
    const row = _row;
    const col = _col;
    if (row < 0 || row > 2 || col < 0 || col > 2) return false;
    if (this._board[row][col] !== null) return false;
    this._board[row][col] = _player;
    return true;
  }

  evaluate(): GameResult {
    const lines: [number, number][][] = [
      // rows
      [ [0,0],[0,1],[0,2] ],
      [ [1,0],[1,1],[1,2] ],
      [ [2,0],[2,1],[2,2] ],
      // cols
      [ [0,0],[1,0],[2,0] ],
      [ [0,1],[1,1],[2,1] ],
      [ [0,2],[1,2],[2,2] ],
      // diags
      [ [0,0],[1,1],[2,2] ],
      [ [0,2],[1,1],[2,0] ],
    ];

    for (const line of lines) {
      const [a,bCell,c] = line;
      const v1 = this._board[a[0]][a[1]];
      const v2 = this._board[bCell[0]][bCell[1]];
      const v3 = this._board[c[0]][c[1]];
      if (v1 && v1 === v2 && v1 === v3) {
        const state = v1 === Player.X ? GameState.WonX : GameState.WonO;
        return { state, winningCells: line };
      }
    }

    // draw?
    const anyEmpty = this._board.some((row) => row.some((c) => c === null));
    if (!anyEmpty) return { state: GameState.Draw, winningCells: null };

    return { state: GameState.Playing, winningCells: null };
  }

  getEmptyCells(): [number, number][] {
    const res: [number, number][] = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (this._board[r][c] === null) res.push([r, c]);
      }
    }
    return res;
  }

  cloneBoard(): Board {
    return this._board.map((row) => [...row]);
  }

  setBoardState(board: Board): void {
    this._board = board.map((row) => [...row]);
  }

  reset(): void {
    this._board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  }
}
