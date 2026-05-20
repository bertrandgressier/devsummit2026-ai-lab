import { Direction, GameState, Position } from '../types';

export class SnakeLogic {
  private _snake: Position[] = [{ x: 10, y: 10 }];
  private _food: Position = { x: 5, y: 5 };
  private _score = 0;

  get snake(): Position[] { return this._snake; }
  get food(): Position { return this._food; }
  get score(): number { return this._score; }

  setDirection(_dir: Direction): void {}

  tick(): GameState {
    return GameState.Playing;
  }

  reset(): void {
    this._snake = [{ x: 10, y: 10 }];
    this._score = 0;
  }
}
