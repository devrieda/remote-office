import { Matrix } from '../math.js';
import Level from '../Level.js';
import { createColorLayer  } from '../layers/color.js';
import { createBackgroundLayer  } from '../layers/background.js';
import { createSpriteLayer } from '../layers/sprites.js';
import { createDashboardLayer } from '../layers/dashboard.js';
import { loadSpriteSheet } from './sprite.js';
import { loadFont } from './font.js';
import { loadAscii } from './ascii.js';

export function createFloorLoader(entityFactory, context) {
  return function loadFloor(name) {
    return Promise.all([
      loadSpriteSheet('floor-plan'),
      loadSpriteSheet('windows'),
      loadSpriteSheet('tiles'),
      loadAscii('collision'),
      loadFont()
    ])
    .then(([
        floorPlanSprites,
        windowSprites,
        itemsSprites,
        collisionText,
        font
      ]) => {

      const floor = new Level();
      floor.name = name;
      const grid = createGrid(71, 45);

      // black background
      floor.comp.layers.push(createColorLayer('#212123'))

      // floor plan
      const floorLayer = createBackgroundLayer(floor, grid, floorPlanSprites);
      floor.comp.layers.push(floorLayer);

      // entities
      const spriteLayer = createSpriteLayer(floor.entities);
      floor.comp.layers.push(spriteLayer);

      // collision
      const collisionGrid = createCollisionGrid(71, 45, collisionText);
      floor.tileCollider.addGrid(collisionGrid);

      // items
      const itemsLayer = createBackgroundLayer(floor, collisionGrid, itemsSprites);
      floor.comp.layers.push(itemsLayer);

      // windows
      const windowLayer = createBackgroundLayer(floor, grid, windowSprites);
      floor.comp.layers.push(windowLayer);

      // dashboard
      const dashboardLayer = createDashboardLayer(font, floor, itemsSprites);
      floor.comp.layers.push(dashboardLayer)

      return floor;
    });
  }
}

function createGrid(width, height) {
  const grid = new Matrix();

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      grid.set(i, j, { name: `${i}x${j}` });
    }
  }
  return grid;
}

function createCollisionGrid(width, height, collisionText) {
  const rows = collisionText.split("\n");
  const grid = new Matrix();

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      // use types to place items
      const value = rows[j][i];
      const types = {
        "b": "blueMoon",
        "l": "laCroix",
        "m": "mv",
        "c": "coffee",
        "n": "nerf",
        "x": "wall"
      }
      const type = types[value] || "";

      // only use walls for collisions
      let name = type;
      if (name === "wall") { name = ""; }

      if (type !== "") {
        grid.set(i, j, { name: name, type });
      }
    }
  }
  return grid;
}
