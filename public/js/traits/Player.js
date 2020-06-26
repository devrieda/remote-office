import Trait from '../Trait.js';

const MAX_LIFE = 4;

export default class Player extends Trait {
  constructor() {
    super();
    this.name = 'UNNAMED';
    this.mv   = 0;
    this.life = 4;

    // placeholders for items
    this.aItem = '';
    this.bItem = '';
  }

  addMv(count) {
    this.mv += count;
    this.queue(entity => entity.sounds.add('mv'));
  }

  addCoffee() {
    if (this.life < MAX_LIFE) {
      this.life++;
    }
    this.queue(entity => entity.sounds.add('coffee'));
  }

  addBlueMoon() {
    this.aItem = 'blueMoon';
    this.queue(entity => entity.sounds.add('blueMoon'));
  }

  addLaCroix() {
    this.aItem = 'laCroix';
    this.queue(entity => entity.sounds.add('laCroix'));
  }

  addNerf() {
    this.bItem = 'nerf';
    this.queue(entity => entity.sounds.add('nerf'));
  }
}
