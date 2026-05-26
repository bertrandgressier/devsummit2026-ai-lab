const HASH_TO_SCENE: Record<string, string> = {
  launcher: 'Launcher',
  tictactoe: 'TicTacToeMenu',
  tetris: 'TetrisMenu',
  snake: 'SnakeGame',
};

export function getStartScene(): string {
  const hash = window.location.hash.replace('#', '').toLowerCase().trim();
  return HASH_TO_SCENE[hash] ?? 'Launcher';
}

export function setRoute(hash: string): void {
  const next = `#${hash}`;
  if (window.location.hash !== next) {
    window.history.replaceState(null, '', next);
  }
}
