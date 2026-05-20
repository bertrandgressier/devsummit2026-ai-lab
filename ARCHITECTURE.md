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

