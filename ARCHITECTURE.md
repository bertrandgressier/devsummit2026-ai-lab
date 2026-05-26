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
    BootScene.ts       ← preloads assets, starts Launcher
    LauncherScene.ts   ← main portal, routes to games
  games/
    tictactoe/
      types/index.ts   ← enums, interfaces (given)
      logic/
        GameLogic.ts   ← pure logic, zero Phaser
        AIPlayer.ts    ← AI strategy, zero Phaser
      scenes/
        MenuScene.ts   ← key: "TicTacToeMenu"
        GameScene.ts   ← key: "TicTacToeGame"
        GameOverScene.ts ← key: "TicTacToeGameOver"
      objects/
        Cell.ts        ← single interactive cell
        Grid.ts        ← 3×3 grid of cells
    snake/
      types/index.ts
      logic/
        SnakeLogic.ts  ← pure logic, zero Phaser
      scenes/
        GameScene.ts   ← key: "SnakeGame"
      objects/
        SnakeRenderer.ts ← grid rendering
```

## Mandatory Rules

1. **Logic never imports Phaser** — pure TypeScript classes only
2. **Scenes never contain logic** — delegate to logic classes
3. **One file, one responsibility**
4. **No external assets** — everything drawn with `this.add.graphics()`
5. **Return to Launcher** via `this.scene.start('Launcher')` from any game

## Scene Navigation

```
Boot → Launcher → TicTacToeMenu → TicTacToeGame → TicTacToeGameOver
                ↗                                              ↘
                ←←←←←←←←← back to Launcher ←←←←←←←←←←←←←←←←
                ↘
                  SnakeGame ←→ Launcher
```

## Snake — Architecture Notes

## Key difference from Tic Tac Toe

Tic Tac Toe is **turn-based** — you wait for input. Snake is **real-time** — the game ticks at fixed intervals regardless of input.

## Game loop

```typescript
// In GameScene.create()
this.time.addEvent({
  delay: 150,           // ms per tick — lower = faster snake
  callback: this.tick,
  callbackScope: this,
  loop: true,
});

private tick(): void {
  const state = this.logic.tick();
  this.renderer.draw(this.logic.snake, this.logic.food);
  if (state === GameState.GameOver) {
    this.endGame();
  }
}
```

## Data model

```typescript
// Snake body — head is always snake[0]
snake: Position[] = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];

// Direction vector
direction: Direction = { x: 1, y: 0 };  // moving right

// Grid size (cells, not pixels)
const GRID_W = 20;
const GRID_H = 15;
```

## Tick logic (implement in SnakeLogic.ts)

```
1. Compute new head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }
2. Check collision:
   - Wall: newHead.x < 0 || newHead.x >= GRID_W || newHead.y < 0 || newHead.y >= GRID_H
   - Self: snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
   → if collision: return GameState.GameOver
3. Check food: newHead.x === food.x && newHead.y === food.y
   - If yes: prepend newHead (don't remove tail), spawn new food, increment score
   - If no: prepend newHead, remove last element (snake.pop())
4. Return GameState.Playing
```

## Input (in GameScene)

```typescript
// Prevent reversing direction (can't go from right to left directly)
this.input.keyboard?.on('keydown', (e: KeyboardEvent) => {
  const map: Record<string, Direction> = {
    ArrowUp:    { x: 0,  y: -1 },
    ArrowDown:  { x: 0,  y:  1 },
    ArrowLeft:  { x: -1, y:  0 },
    ArrowRight: { x: 1,  y:  0 },
  };
  const next = map[e.key];
  if (!next) return;
  // Prevent 180° reversal
  const cur = this.logic.direction;
  if (next.x === -cur.x && next.y === -cur.y) return;
  this.logic.setDirection(next);
});
```

## Rendering (in SnakeRenderer.ts)

```typescript
// Cell size in pixels
const CELL = 30;  // 800/20 = 40 wide, 600/15 = 40 tall — pick 30 for padding

draw(snake: Position[], food: Position): void {
  this.gfx.clear();
  // food
  this.gfx.fillStyle(0xff6b35, 1);
  this.gfx.fillRect(food.x * CELL + 1, food.y * CELL + 1, CELL - 2, CELL - 2);
  // snake body
  this.gfx.fillStyle(0x00d4aa, 1);
  for (const seg of snake) {
    this.gfx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
  }
  // head (different color)
  this.gfx.fillStyle(0xffffff, 1);
  this.gfx.fillRect(snake[0].x * CELL + 1, snake[0].y * CELL + 1, CELL - 2, CELL - 2);
}
```

## File responsibility split

| File | Contains | Does NOT contain |
|---|---|---|
| `SnakeLogic.ts` | tick(), setDirection(), collision, food spawn, score | Any graphics or Phaser |
| `SnakeRenderer.ts` | draw() with graphics | Game state, movement logic |
| `GameScene.ts` | time.addEvent, input listeners, score text | Movement logic |
