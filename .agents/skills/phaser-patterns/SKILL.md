---
name: phaser-patterns
description: "Phaser 3 TypeScript coding patterns: scene lifecycle (create/init/update/shutdown), graphics API, interactive objects, tweens, keyboard input, real-time game loop, scene transitions, and anti-patterns. Load when implementing any Phaser scene, game object, or renderer."
---

## Always extend Phaser.Scene

```typescript
export class MyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MySceneKey' });
  }
}
```

## Scene lifecycle order

```
constructor → init(data) → preload() → create() → update()
```

- `init()` — receive data from previous scene, set defaults
- `create()` — build all objects, store references, register input
- `update()` — runs every frame, keep it lean (no heavy queries)

## Interactive objects

```typescript
// Text button
const btn = this.add.text(x, y, 'Click me', { fontFamily: 'monospace', fontSize: '18px', color: '#ffffff' })
  .setOrigin(0.5)
  .setInteractive({ useHandCursor: true });

btn.on('pointerover', () => btn.setColor('#00d4aa'));
btn.on('pointerout',  () => btn.setColor('#ffffff'));
btn.on('pointerdown', () => { /* action */ });

// Zone (invisible hit area over graphics)
const zone = this.add.zone(x, y, width, height).setInteractive({ useHandCursor: true });

// Disable when done
btn.disableInteractive();
```

## Drawing shapes

```typescript
const gfx = this.add.graphics();

gfx.fillStyle(0xff6b35, 1);          // color (0xRRGGBB), alpha
gfx.fillRect(x, y, width, height);
gfx.fillCircle(x, y, radius);
gfx.fillRoundedRect(x, y, w, h, 8); // 8px corner radius

gfx.lineStyle(2, 0x00d4aa, 1);       // width, color, alpha
gfx.strokeRect(x, y, width, height);

gfx.clear(); // always call before redraw in game loops
```

## Score and dynamic text

```typescript
// Create once in create(), store reference
private scoreText!: Phaser.GameObjects.Text;

create(): void {
  this.scoreText = this.add.text(16, 16, 'Score: 0', {
    fontFamily: 'monospace',
    fontSize: '20px',
    color: '#ffffff',
  }).setDepth(10); // render above game elements
}

// Update cheaply — never recreate the object
updateScore(value: number): void {
  this.scoreText.setText(`Score: ${value}`);
}
```

## Depth ordering

```typescript
// Higher depth = renders on top
gfx.setDepth(0);        // background
sprite.setDepth(1);     // game elements
uiText.setDepth(10);    // UI always on top
```

## Tweens

```typescript
this.tweens.add({
  targets: gameObject,
  alpha:    { from: 0, to: 1 },
  scaleX:   1.05,
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

## Real-time game loop

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

## Scene shutdown — always clean up

```typescript
// Stop timers and remove listeners when leaving a scene
shutdown(): void {
  this.tickEvent?.remove();
  this.input.keyboard?.removeAllListeners();
  this.tweens.killAll();
}
```

## Audio — always wrap in try/catch

```typescript
try {
  this.sound.play('sfx-click');
} catch {
  // silent fail — audio context not ready or asset missing
}
```

## Cache references in create(), never re-query in update()

```typescript
// ❌ Expensive — queries the scene graph every frame
update(): void {
  this.children.getByName('scoreText').setText(`${score}`);
}

// ✅ Store in create(), update cheaply
private scoreText!: Phaser.GameObjects.Text;
create(): void { this.scoreText = this.add.text(...); }
update(): void { this.scoreText.setText(`${score}`); }
```

## Common anti-patterns

```typescript
// ❌ Logic in scenes
class GameScene extends Phaser.Scene {
  private board: CellValue[][] = []; // belongs in GameLogic
}
// ✅ Delegate to logic class
class GameScene extends Phaser.Scene {
  private logic = new GameLogic();
}

// ❌ Uncaught audio crash
this.sound.play('sfx');
// ✅ Always wrap audio
try { this.sound.play('sfx'); } catch { /* silent */ }

// ❌ Type escape hatch
const data = init_data as any;
// ✅ Proper types with ?? fallback
init(data: SceneData): void {
  this.difficulty = data?.difficulty ?? Difficulty.Easy;
}
```
