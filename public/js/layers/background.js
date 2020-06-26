import TileResolver from '../TileResolver.js';

export function createBackgroundLayer(level, tiles, sprites) {
  const resolver = new TileResolver(tiles);
  const buffer = document.createElement('canvas');
  buffer.width = 320 + 16;
  buffer.height = 180 + 16;

  const context = buffer.getContext('2d');

  function redraw(startIndexX, endIndexX, startIndexY, endIndexY) {
    context.clearRect(0, 0, buffer.width, buffer.height);

    for (let x = startIndexX; x <= endIndexX; ++x) {
      const col = tiles.grid[x];
      if (!col) continue; // finished loading all cols
      for (let y = startIndexY; y <= endIndexY; ++y) {
        const tile = col[y];
        if (!tile) continue; // finished loading all rows

        if (sprites.animations.has(tile.name)) {
          sprites.drawAnim(tile.name, context, x - startIndexX, y - startIndexY, level.totalTime);
        } else {
          sprites.drawTile(tile.name, context, x - startIndexX, y - startIndexY);
        }
      }
    }
  }

  return function drawBackgroundLayer(context, camera) {
    const drawWidth  = resolver.toIndex(camera.size.x);
    const drawHeight = resolver.toIndex(camera.size.y);

    const drawFromX = resolver.toIndex(camera.pos.x);
    const drawFromY = resolver.toIndex(camera.pos.y);

    const drawToX  = drawFromX + drawWidth;
    const drawToY  = drawFromY + drawHeight;

    redraw(drawFromX, drawToX, drawFromY, drawToY);

    context.drawImage(
      buffer,
      Math.floor(-camera.pos.x % 16),
      Math.floor(-camera.pos.y % 16)
    );
  };
}
