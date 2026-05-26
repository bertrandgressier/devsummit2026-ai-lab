import Phaser from 'phaser';
import { BootScene } from './launcher/BootScene';
import { LauncherScene } from './launcher/LauncherScene';
import { TicTacToeMenuScene } from './games/tictactoe/scenes/MenuScene';
import { TicTacToeGameScene } from './games/tictactoe/scenes/GameScene';
import { TicTacToeGameOverScene } from './games/tictactoe/scenes/GameOverScene';
import { SnakeGameScene } from './games/snake/scenes/GameScene';
import TetrisMenu from './games/tetris/scenes/MenuScene';
import TetrisGame from './games/tetris/scenes/GameScene';
import TetrisGameOver from './games/tetris/scenes/GameOverScene';

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
    TetrisMenu,
    TetrisGame,
    TetrisGameOver,
  ],
};

new Phaser.Game(config);
