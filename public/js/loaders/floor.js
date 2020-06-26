import { Matrix } from '../math.js';
import Level from '../Level.js';
import { createColorLayer  } from '../layers/color.js';
import { createBackgroundLayer  } from '../layers/background.js';
import { createSpriteLayer } from '../layers/sprites.js';
import { loadSpriteSheet } from './sprite.js';
import { loadAscii } from './ascii.js';

export function createFloorLoader(entityFactory, context) {
  return function loadFloor(name) {
    return Promise.all([
      loadSpriteSheet('floor-plan'),
      loadSpriteSheet('windows'),
      loadAscii('collision'),
    ])
    .then(([floorPlanSprites, windowSprites, collisionText]) => {
      const floor = new Level();
      floor.name = name;
      const grid = createGrid(71, 45, collisionText);

      // black background
      floor.comp.layers.push(createColorLayer('#212123'))

      // floor plan
      const floorLayer = createBackgroundLayer(floor, grid, floorPlanSprites);
      floor.comp.layers.push(floorLayer);

      // entities
      const spriteLayer = createSpriteLayer(floor.entities);
      floor.comp.layers.push(spriteLayer);

      // collision
      floor.tileCollider.addGrid(grid);

      // windows
      const windowLayer = createBackgroundLayer(floor, grid, windowSprites);
      floor.comp.layers.push(windowLayer);

      return floor;
    });
  }
}

function createGrid(width, height, collisionText) {
  const rows = collisionText.split("\n");
  const grid = new Matrix();

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const type = rows[j][i] === "x" ? "ground" : "";
      grid.set(i, j, { name: `${i}x${j}`, type  });
    }
  }
  return grid;
}
