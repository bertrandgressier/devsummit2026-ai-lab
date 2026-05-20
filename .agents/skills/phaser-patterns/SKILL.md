---
name: phaser-patterns
description: Phaser 3 game architecture and design patterns for TypeScript projects.
---
# Phaser Patterns Skill
This skill provides agents with knowledge of best practices for structuring Phaser 3 games using TypeScript. It covers project architecture, scene management, separation of concerns, and coding conventions to ensure maintainable and scalable game development.

## Always extend Phaser.Scene

```typescript
export class MyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MySceneKey' });
  }
}
```

## Interactive objects

```typescript
// Text
const btn = this.add.text(x, y, 'Click me', { fontFamily: 'monospace', fontSize: '18px', color: '#ffffff' })
  .setOrigin(0.5)
  .setInteractive({ useHandCursor: true });

btn.on('pointerover', () => btn.setColor('#00d4aa'));
btn.on('pointerout',  () => btn.setColor('#ffffff'));
btn.on('pointerdown', () => { /* action */ });

// Zone (invisible hit area over graphics)
const zone = this.add.zone(x, y, width, height).setInteractive({ useHandCursor: true });

// Disable when no longer needed
btn.disableInteractive();
```

## Drawing shapes

```typescript
const gfx = this.add.graphics();

gfx.fillStyle(0xff6b35, 1);          // color, alpha
gfx.fillRect(x, y, width, height);
gfx.fillCircle(x, y, radius);
gfx.fillRoundedRect(x, y, w, h, 8); // 8px corner radius

gfx.lineStyle(2, 0x00d4aa, 1);       // width, color, alpha
gfx.strokeRect(x, y, width, height);
gfx.strokeCircle(x, y, radius);

gfx.clear(); // clear before redraw in game loops
```

## Tweens

```typescript
this.tweens.add({
  targets: gameObject,
  alpha:    { from: 0, to: 1 },
  scaleX:   1.05,
  scaleY:   1.05,
  duration: 200,
  ease:     'Back.easeOut',
  yoyo:     false,
  repeat:   0,
});

// Chain tweens
this.tweens.chain({
  targets: obj,
  tweens: [
    { alpha: 0, duration: 150 },
    { alpha: 1, duration: 150 },
  ],
});
```

## Scene transitions with fade

```typescript
// Fade out then transition
this.cameras.main.fadeOut(300, 8, 8, 19); // duration, r, g, b
this.cameras.main.once('camerafadeoutcomplete', () => {
  this.scene.start('TargetScene', { key: 'value' });
});

// Fade in on entry
this.cameras.main.fadeIn(300, 8, 8, 19);
```

## Passing data between scenes

```typescript
// Sender
this.scene.start('GameScene', { difficulty: Difficulty.Hard } satisfies SceneData);

// Receiver — always use init(), not create()
init(data: SceneData): void {
  this.difficulty = data?.difficulty ?? Difficulty.Easy; // always guard with ??
}
```

## Audio — always wrap in try/catch

```typescript
// Never let audio crash the game
try {
  this.sound.play('sfx-click');
} catch {
  // silent fail — audio context not ready or asset missing
}
```

## AI delay UX

```typescript
// Show "thinking" state, then act after delay
this.showThinkingIndicator();
this.time.delayedCall(600, () => {
  this.hideThinkingIndicator();
  this.performAIMove();
});
```

## Real-time game loop (Snake pattern)

```typescript
private tickEvent!: Phaser.Time.TimerEvent;

create(): void {
  this.tickEvent = this.time.addEvent({
    delay: 150,
    callback: this.tick,
    callbackScope: this,
    loop: true,
  });
}

private tick(): void {
  const state = this.logic.tick();
  this.renderer.draw(this.logic.snake, this.logic.food);
  if (state === GameState.GameOver) {
    this.tickEvent.remove();
    this.endGame();
  }
}
```

## Keyboard input

```typescript
this.input.keyboard?.on('keydown', (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowUp':    this.handleUp(); break;
    case 'ArrowDown':  this.handleDown(); break;
    case 'ArrowLeft':  this.handleLeft(); break;
    case 'ArrowRight': this.handleRight(); break;
  }
});
```

## Common anti-patterns to avoid

```typescript
// ❌ Never store logic in scenes
class GameScene extends Phaser.Scene {
  private board: CellValue[][] = []; // wrong — belongs in GameLogic
}

// ✅ Delegate to logic class
class GameScene extends Phaser.Scene {
  private logic = new GameLogic();  // correct
}

// ❌ Never let crashes block game flow
this.sound.play('sfx');  // throws if audio context not ready

// ✅ Always wrap audio
try { this.sound.play('sfx'); } catch { /* silent */ }

// ❌ Never use as any
const data = init_data as any;

// ✅ Guard with proper types and ?? fallback
init(data: SceneData): void {
  this.difficulty = data?.difficulty ?? Difficulty.Easy;
}
```
