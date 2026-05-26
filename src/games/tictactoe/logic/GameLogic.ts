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
    return false;
  }

  evaluate(): GameResult {
    return { state: GameState.Playing, winningCells: null };
  }

  getEmptyCells(): [number, number][] {
    return [];
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
