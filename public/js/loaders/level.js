import { Matrix } from '../math.js';
import Level from '../Level.js';
import { createColorLayer  } from '../layers/color.js';
import { createBackgroundLayer  } from '../layers/background.js';
import { createSpriteLayer } from '../layers/sprites.js';
import { createDashboardLayer } from '../layers/dashboard.js';
import { loadMusicSheet } from './music.js';
import { loadSpriteSheet } from './sprite.js';
import { loadFont } from './font.js';
import { loadAscii } from './ascii.js';

export function createLevelLoader(entityFactory, context) {
  return function loadLevel(name) {
    return Promise.all([
      loadSpriteSheet('floor-plan'),
      loadSpriteSheet('windows'),
      loadSpriteSheet('tiles'),
      loadMusicSheet('floor'),
      loadAscii('collision'),
      loadFont()
    ])
    .then(([
        floorPlanSprites,
        windowSprites,
        itemsSprites,
        musicPlayer,
        collisionText,
        font
      ]) => {

      const level = new Level();
      level.name = name;
      level.music.setPlayer(musicPlayer);
      level.music.playTheme();

      const grid = createGrid(71, 45);

      // remember the sprites for spawning later
      level.itemsSprites = itemsSprites;

      // black background
      level.comp.layers.push(createColorLayer('#212123'))

      // collision grid
      const collisionGrid = createCollisionGrid(71, 45, collisionText);
      level.tileCollider.addGrid(collisionGrid);

      // spawn entities
      const entityCoords = findEntityCoords(71, 45, collisionText);
      entityCoords.forEach(({ name, x, y }) => {
        const createEntity = entityFactory[name];
        const entity = createEntity();
        entity.pos.set(x * 16, y * 16);
        level.entities.add(entity);
      });

      // floor plan layer
      const floorLayer = createBackgroundLayer(level, grid, floorPlanSprites);
      level.comp.layers.push(floorLayer);

      // entities layer
      const spriteLayer = createSpriteLayer(level.entities);
      level.comp.layers.push(spriteLayer);

      // items layer
      const itemsLayer = createBackgroundLayer(level, collisionGrid, itemsSprites);
      level.comp.layers.push(itemsLayer);

      // windows layer
      const windowLayer = createBackgroundLayer(level, grid, windowSprites);
      level.comp.layers.push(windowLayer);

      // dashboard
      const dashboardLayer = createDashboardLayer(font, level, itemsSprites);
      level.comp.layers.push(dashboardLayer)

      return level;
    });
  }
}

function createGrid(width, height) {
  const grid = new Matrix();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      grid.set(x, y, { name: `${x}x${y}` });
    }
  }
  return grid;
}

function findEntityCoords(width, height, collisionText) {
  const rows = collisionText.split("\n");

  const entities = [];

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (rows[y][x] === 'e') {
        entities.push({ name: 'eggbag', x, y });
      }
    }
  }
  return entities;
}

function createCollisionGrid(width, height, collisionText) {
  const rows = collisionText.split("\n");
  const grid = new Matrix();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // use types to place items
      const value = rows[y][x];
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
        grid.set(x, y, { name: name, type });
      }
    }
  }
  return grid;
}
