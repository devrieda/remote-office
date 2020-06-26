import Trait from '../Trait.js';

const MAX_LIFE = 4;

export default class Player extends Trait {
  constructor() {
    super();
    this.name = 'UNNAMED';
    this.mv   = 0;
    this.life = 3;

    // placeholders for items
    this.itemA = '';
    this.itemB = '';
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
    this.itemA = 'blue-moon-1';
    this.queue(entity => entity.sounds.add('blueMoon'));
  }

  addLaCroix() {
    this.itemA = 'la-croix-1';
    this.queue(entity => entity.sounds.add('laCroix'));
  }

  addNerf() {
    this.itemB = 'nerf-1';
    this.queue(entity => entity.sounds.add('nerf'));
  }
}
