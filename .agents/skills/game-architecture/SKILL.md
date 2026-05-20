---
name: game-architecture
description: Project structure, mandatory rules, scene navigation, types, and scene data contracts for the AI4Dev lab (Phaser 3 + TypeScript + Vite).
---

# Game Architecture — AI4Dev Lab

## Stack

- **Phaser 3** + **TypeScript** + **Vite**
- Canvas: 800×600px, `Scale.FIT` + `CENTER_BOTH`, background `#08080f`
- Zero external dependencies beyond Phaser

## Project structure

```
src/
  launcher/
    BootScene.ts       ← preloads assets, starts correct scene (given — do not modify)
    LauncherScene.ts   ← main portal with game cards (given — do not modify)
    router.ts          ← URL hash routing (given — do not modify)
  games/
    tictactoe/
      types/index.ts   ← enums + interfaces (given — do not modify)
      logic/
        GameLogic.ts   ← board state, move validation, win detection
        AIPlayer.ts    ← AI move selection
      objects/
        Cell.ts        ← single interactive cell
        Grid.ts        ← 3×3 grid of cells
      scenes/
        MenuScene.ts   ← key: "TicTacToeMenu"
        GameScene.ts   ← key: "TicTacToeGame"
        GameOverScene.ts ← key: "TicTacToeGameOver"
    snake/
      types/index.ts   ← types (given — do not modify)
      logic/
        SnakeLogic.ts  ← tick, collision, food, score
      objects/
        SnakeRenderer.ts ← grid drawing
      scenes/
        GameScene.ts   ← key: "SnakeGame"
```

## Mandatory rules (enforced by QA)

1. Logic files (`logic/`) never import Phaser — pure TypeScript only
2. Scene files (`scenes/`) never contain game logic — delegate to logic classes
3. One file, one responsibility
4. No external assets — everything with `this.add.graphics()`
5. Return to Launcher via `this.scene.start('Launcher')` from any game screen
6. No `as any`, no `@ts-ignore` — fix types properly

## Scene navigation

```
Boot → Launcher → TicTacToeMenu → TicTacToeGame → TicTacToeGameOver
                ↗                                              ↘
                ←←←←←←←←← back to Launcher ←←←←←←←←←←←←←←←←
                ↘
                  SnakeGame ←→ Launcher
```

## Scene keys

| Scene | Key |
|---|---|
| Launcher | `'Launcher'` |
| TicTacToe menu | `'TicTacToeMenu'` |
| TicTacToe game | `'TicTacToeGame'` |
| TicTacToe game over | `'TicTacToeGameOver'` |
| Snake | `'SnakeGame'` |

## Passing data between scenes

```typescript
// Sender
this.scene.start('TicTacToeGame', { difficulty: Difficulty.Hard } satisfies SceneData);

// Receiver — always use init(), never create()
init(data: SceneData): void {
  this.difficulty = data?.difficulty ?? Difficulty.Easy; // always guard with ??
}
```

## Tic Tac Toe types (in `src/games/tictactoe/types/index.ts`)

```typescript
enum Player    { X = 'X', O = 'O' }
enum Difficulty { Easy = 'easy', Hard = 'hard' }
enum GameState  { Playing = 'playing', WonX = 'wonX', WonO = 'wonO', Draw = 'draw' }

type CellValue = Player | null;
type Board = CellValue[][];  // 3×3, null = empty

interface GameResult  { state: GameState; winningCells: [number, number][] | null; }
interface SceneData   { difficulty: Difficulty; }
interface GameOverData { result: GameState; difficulty: Difficulty; }
```

## Snake types (in `src/games/snake/types/index.ts`)

```typescript
type Direction = { x: number; y: number };
type Position  = { x: number; y: number };
enum GameState { Playing = 'playing', GameOver = 'gameOver' }
```
