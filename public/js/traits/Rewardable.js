import Trait from '../Trait.js';
import { Matrix } from '../math.js';
import { createBackgroundLayer  } from '../layers/background.js';

function createGrid(width, height) {
  const grid = new Matrix();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      grid.set(x, y, );
    }
  }
  return grid;
}

export default class Rewardable extends Trait {
  constructor() {
    super();

    this.spawnReward = false;
    this.rewardTime = 0;
    this.rewardAfter = 0.17;
    this.rewards = ['mv', 'mv', 'coffee', 'laCroix'];
  }

  reward() {
    this.queue(() => this.spawnReward = true);
  }

  update(entity, { deltaTime }, level) {
    if (!this.spawnReward) { return; }

    this.rewardTime += deltaTime;
    if (this.rewardTime > this.rewardAfter) {
        // replace the entity with a reward!
        const random = Math.floor(Math.random() * this.rewards.length);
        const type = this.rewards[random];

        const x = Math.round(entity.pos.x / 16);
        const y = Math.round(entity.pos.y / 16);

        // find entity tile
        const grid = new Matrix();
        const name = type;
        grid.set(x, y, { name, type });

        // set collisions to pick up the rewards
        level.tileCollider.addGrid(grid);

        // show the item
        const layer = createBackgroundLayer(level, grid, level.itemsSprites);
        level.comp.layers.push(layer);

        this.spawnReward = false;
        this.rewardTime = 0;
    }

  }
}
