import Phaser from 'phaser';
import { BootScene } from './launcher/BootScene';
import { LauncherScene } from './launcher/LauncherScene';
import { TicTacToeMenuScene } from './games/tictactoe/scenes/MenuScene';
import { TicTacToeGameScene } from './games/tictactoe/scenes/GameScene';
import { TicTacToeGameOverScene } from './games/tictactoe/scenes/GameOverScene';
import { SnakeGameScene } from './games/snake/scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#08080f',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    BootScene,
    LauncherScene,
    TicTacToeMenuScene,
    TicTacToeGameScene,
    TicTacToeGameOverScene,
    SnakeGameScene,
  ],
};

new Phaser.Game(config);
