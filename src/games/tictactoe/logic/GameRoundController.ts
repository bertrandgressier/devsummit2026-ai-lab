import { AIPlayer } from './AIPlayer';
import { GameLogic } from './GameLogic';
import { Difficulty, GameResult, Player } from '../types';

export type MoveCallback = (index: number, player: Player) => void;
export type ScoreCallback = (xScore: number, oScore: number) => void;
export type TurnCallback = (player: Player, active: boolean) => void;
export type GameOverCallback = (result: GameResult, winningCells: number[] | null) => void;
export type AiRequestCallback = (runAiMove: () => void) => void;

export class GameRoundController {
  private roundId = 0;
  private currentPlayer: Player = Player.X;
  private gameActive = false;
  private xScore = 0;
  private oScore = 0;

  constructor(
    private readonly logic: GameLogic,
    private readonly ai: AIPlayer,
    private readonly difficulty: Difficulty,
    private readonly onMove: MoveCallback,
    private readonly onScore: ScoreCallback,
    private readonly onTurn: TurnCallback,
    private readonly onGameOver: GameOverCallback,
    private readonly requestAiMove: AiRequestCallback,
  ) {
    this.logic.onMove((index, player) => this.onMove(index, player));
    this.logic.onGameOver((result, winningCells) => {
      this.gameActive = false;
      if (result === GameResult.X_WINS) this.xScore += 1;
      else if (result === GameResult.O_WINS) this.oScore += 1;
      this.onScore(this.xScore, this.oScore);
      this.onTurn(this.currentPlayer, false);
      this.onGameOver(result, winningCells);
    });
  }

  startRound(): void {
    this.roundId += 1;
    this.logic.reset();
    this.currentPlayer = Player.X;
    this.gameActive = true;
    this.onTurn(this.currentPlayer, true);
  }

  restartRound(): void {
    this.startRound();
  }

  handleHumanMove(index: number): void {
    if (!this.gameActive || this.currentPlayer !== Player.X) return;
    if (!this.logic.makeMove(index, Player.X)) return;
    if (!this.gameActive) return;

    this.currentPlayer = Player.O;
    this.onTurn(this.currentPlayer, true);

    const scheduledRoundId = this.roundId;
    this.requestAiMove(() => this.performAiMove(scheduledRoundId));
  }

  private performAiMove(roundId: number): void {
    if (!this.gameActive || roundId !== this.roundId || this.currentPlayer !== Player.O) return;

    const aiMove = this.ai.getBestMove(this.logic.cloneBoard(), this.difficulty, Player.O);
    if (aiMove >= 0) {
      this.logic.makeMove(aiMove, Player.O);
    }

    if (this.gameActive) {
      this.currentPlayer = Player.X;
      this.onTurn(this.currentPlayer, true);
    }
  }
}
