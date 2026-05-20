# ARCHITECTURE — AI4Dev Lab 2026

## Stack

- **Phaser 3** + **TypeScript** + **Vite**
- Zero external dependencies beyond Phaser

## Canvas

- `800 × 600` px — `Scale.FIT` + `CENTER_BOTH`
- Background: `#08080f`

## Project Structure

```
src/
  launcher/
    BootScene.ts        ← preloads assets, reads URL hash, starts correct scene
    LauncherScene.ts    ← main portal, routes to games
    router.ts           ← URL hash routing (getStartScene / setRoute)
  games/
    tictactoe/
      types/index.ts    ← enums + interfaces (given, do not modify)
      logic/
        GameLogic.ts    ← pure logic, zero Phaser
        AIPlayer.ts     ← AI strategy, zero Phaser
      scenes/
        MenuScene.ts    ← key: "TicTacToeMenu"
        GameScene.ts    ← key: "TicTacToeGame"
        GameOverScene.ts ← key: "TicTacToeGameOver"
      objects/
        Cell.ts         ← single interactive cell
        Grid.ts         ← 3×3 grid of cells
    snake/
      types/index.ts
      logic/
        SnakeLogic.ts   ← pure logic, zero Phaser
      scenes/
        GameScene.ts    ← key: "SnakeGame"
      objects/
        SnakeRenderer.ts ← grid rendering
```

## Mandatory Rules

1. **Logic never imports Phaser** — pure TypeScript classes only
2. **Scenes never contain logic** — delegate to logic classes
3. **One file, one responsibility**
4. **No external assets** — everything drawn with `this.add.graphics()`
5. **Return to Launcher** via `this.scene.start('Launcher')` from any game
6. **No `as any`, no `@ts-ignore`** — fix types properly

## Scene Keys

| Scene | Key |
|---|---|
| Boot | `'Boot'` |
| Launcher | `'Launcher'` |
| TicTacToe menu | `'TicTacToeMenu'` |
| TicTacToe game | `'TicTacToeGame'` |
| TicTacToe game over | `'TicTacToeGameOver'` |
| Snake | `'SnakeGame'` |

## Scene Navigation

```
Boot → Launcher → TicTacToeMenu → TicTacToeGame → TicTacToeGameOver
                ↗                                              ↘
                ←←←←←←←←← back to Launcher ←←←←←←←←←←←←←←←←
                ↘
                  SnakeGame ←→ Launcher
```

## Scene Data Passing

Pass data between scenes via `this.scene.start(key, data)` and receive it in `init(data)`:

```typescript
// sender
this.scene.start('TicTacToeGame', { difficulty: Difficulty.Hard } satisfies SceneData);

// receiver
init(data: SceneData): void {
  this.difficulty = data?.difficulty ?? Difficulty.Easy;
}
```

Always guard `init()` against missing data with `??` fallbacks.

## Types (Tic Tac Toe)

```typescript
// Given in src/games/tictactoe/types/index.ts — do not redefine
enum Player { X = 'X', O = 'O' }
enum Difficulty { Easy = 'easy', Hard = 'hard' }
enum GameState { Playing = 'playing', WonX = 'wonX', WonO = 'wonO', Draw = 'draw' }

type CellValue = Player | null;
type Board = CellValue[][];          // 3×3, initialized as null

interface GameResult { state: GameState; winningCells: [number, number][] | null; }
interface SceneData   { difficulty: Difficulty; }
interface GameOverData { result: GameState; difficulty: Difficulty; }
```

## Types (Snake)

```typescript
// Given in src/games/snake/types/index.ts — do not redefine
interface Direction { x: -1 | 0 | 1; y: -1 | 0 | 1; }
interface Position  { x: number; y: number; }
enum GameState { Playing = 'playing', GameOver = 'gameover' }
```

## Phaser Patterns

```typescript
// Interactive element
obj.setInteractive({ useHandCursor: true });
obj.on('pointerdown', () => { /* handler */ });
obj.disableInteractive(); // call when done with clicks

// Drawing shapes
const gfx = this.add.graphics();
gfx.fillStyle(0xff6b6b, 1);
gfx.fillRect(x, y, w, h);
gfx.lineStyle(3, 0x00d4aa, 1);
gfx.strokeCircle(x, y, radius);

// Tweens
this.tweens.add({ targets: obj, alpha: 1, scaleX: 1.05, duration: 200, ease: 'Back.easeOut' });

// Scene transition with fade
this.cameras.main.fadeOut(300, 8, 8, 19);
this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('TargetScene', data));

// AI think delay
this.time.delayedCall(600, () => this.performAIMove());

// Real-time game loop (Snake)
this.time.addEvent({ delay: 150, callback: this.tick, callbackScope: this, loop: true });

// Safe audio (always wrap)
try { this.sound.play('sfx-win'); } catch { /* silent fail */ }
```
