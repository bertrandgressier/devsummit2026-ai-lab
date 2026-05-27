# DESIGN — Tic Tac Toe

## Palette
- Background: `0x08080F` / `#08080F`
- Primary: `0x00FFD1` / `#00FFD1`   # neon teal (O symbol, accents)
- Secondary: `0x007F67` / `#007F67` # deep teal (grid lines, subtle panels)
- Accent: `0xFF6B6B` / `#FF6B6B`    # neon coral (X symbol, highlights)
- Text main: `#E6FFF9`
- Text dim: `#7FBAB0`

## Typography
- Title: 48px, "Orbitron, 'Segoe UI', Roboto, sans-serif", `#E6FFF9`
- Body: 20px, "'Segoe UI', Roboto, Arial, sans-serif", `#E6FFF9`
- Button: 22px, "'Segoe UI', Roboto, Arial, sans-serif", `#E6FFF9`

## Layout
- Canvas: width=800, height=600
- Header bar: x=0, y=0, width=800, height=72, fill=`0x071014`
- Title text: x=400, y=36, align="center"
- Left score panel: x=24, y=12, width=160, height=48, fill=`0x061C1A`, stroke=`0x00FFD1`, strokeThickness=2
- Right score panel: x=616, y=12, width=160, height=48, fill=`0x061C1A`, stroke=`0xFF6B6B`, strokeThickness=2
- Game board container: x=190, y=90, width=420, height=420 (square board centered)
- Grid (3×3): origin at board x=190,y=90, total width=420, total height=420
- Grid cell size: width=140, height=140 (GridCellSize=140)
- Grid lines: 2 vertical and 2 horizontal strokes; strokeColor=`0x007F67`, strokeThickness=8
  - Vertical lines x positions: 190 + 140 = 330, and 190 + 280 = 470; y start=90, y end=510
  - Horizontal lines y positions: 90 + 140 = 230, and 90 + 280 = 370; x start=190, x end=610
- Cell centers (row, col index 0..2): centerX = 190 + col*140 + 70, centerY = 90 + row*140 + 70
- X symbol (per cell): two crossed lines, strokeColor=`0xFF6B6B`, strokeThickness=12, lineCap="round"
  - Draw line A from (centerX - 50, centerY - 50) to (centerX + 50, centerY + 50)
  - Draw line B from (centerX + 50, centerY - 50) to (centerX - 50, centerY + 50)
- O symbol (per cell): circle outline, strokeColor=`0x00FFD1`, strokeThickness=12
  - center at (centerX, centerY), radius=50
- Win line (overlay): strokeColor=`0xFF6B6B`, strokeThickness=10, rounded caps
  - Horizontal win line positions (row r): from x=190 + 10 to x=610 - 10 at y = centerY of that row
  - Vertical win line positions (col c): from y=90 + 10 to y=510 - 10 at x = centerX of that column
  - Diagonal TL→BR: from (190 + 10, 90 + 10) to (610 - 10, 510 - 10)
  - Diagonal BL→TR: from (190 + 10, 510 - 10) to (610 - 10, 90 + 10)

- New Game button: x=228, y=530, width=160, height=48, radius=8
- Back button: x=412, y=530, width=160, height=48, radius=8
- Button label alignment: centered at button center

## Animations
- Symbol placement (X or O): scale from 0.60 to 1.00 over 260ms, ease=`Back.Out`
- Symbol pop opacity: alpha from 0.0 to 1.0 over 160ms, ease=`Linear`
- Win line draw: stroke length animated from 0% to 100% over 500ms, ease=`Linear`
- Header title entrance: y offset from 12px above to final (y=36) over 480ms, ease=`Sine.Out`
- Button hover pulse: scale to 1.02 over 180ms, ease=`Sine.Out`, yoyo=true, repeat=-1 (loop) while hovered

## Interactive states
- Button default: fill=`0x071014`, stroke=`0x00FFD1`, strokeThickness=2, labelColor=`#E6FFF9`
- Button hover: fill=`0x062C28`, stroke=`0x00FFD1`, strokeThickness=3, labelColor=`#E6FFF9`
- Button pressed: scale=0.95, duration=80ms

## Implementation notes
- GridCellSize: 140
- BoardX: 190, BoardY: 90, BoardSize: 420
- Cell symbol inner margin: 20 (symbol radius = GridCellSize/2 - 20 = 50)
- SymbolStrokeWidth: 12
- GridLineThickness: 8
- HeaderHeight: 72
- ScorePanel: width=160, height=48
- ButtonSize: width=160, height=48, radius=8
- WinLinePadding: 10 (offset from board bounds when drawing win line endpoints)
- Draw order (from bottom to top): background rect -> decorative header -> grid lines -> symbols -> win line overlay -> UI buttons and text
- All shapes must be drawn with this.add.graphics() only; do not use images or external assets
- Text color strings must use the hex text colors specified above (e.g., `#E6FFF9` and `#7FBAB0`)
- Use exact coordinates and sizes given above; do not attempt to center with approximations — use the provided numeric centers and cell centers for consistent placement
