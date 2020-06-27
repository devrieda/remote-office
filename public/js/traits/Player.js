import Trait from '../Trait.js';
import Go, { Headings } from './Go.js';

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

  pressA(entity) {
    if (this.itemA === '') return;

    if (this.itemA === 'blue-moon-1') {
      this.drinkBlueMoon();

    } else if (this.itemA === 'la-croix-1') {
      this.drinkLaCroix();
    }
  }

  pressB() {
    if (this.itemB === '') return;

    if (this.itemB === 'nerf-1') {
      this.shootDart();
      this.queue(entity => entity.sounds.add('laCroix'));
    }
  }

  drinkLaCroix() {
    this.itemA = '';
    this.queue(entity => entity.sounds.add('coffee'));
  }

  drinkBlueMoon() {
    this.itemA = '';
    this.life--;
    this.queue(entity => entity.sounds.add('damage'));
  }

  shootDart() {
    this.shoot = true;
    this.queue(entity => entity.sounds.add('dart'));
  }

    // emit dart
  update(entity, gameContext, level) {
    if (!this.shoot) { return; }

    const speed = 100;

    const go = entity.traits.get(Go);
    let velX = 0, velY = 0;
    let width = 16, height = 16
    let offsetX = 0, offsetY = 0;

    if (go.heading === Headings.RIGHT || go.heading === Headings.LEFT) {
      velX = speed * (go.heading === Headings.LEFT ? -1 : 1);
      width = 9;
      height = 2;
      offsetX = 3;
      offsetY = 9;

    } else if (go.heading === Headings.DOWN || go.heading === Headings.UP) {
      velY = speed * (go.heading === Headings.UP ? -1 : 1);
      width = 2;
      height = 9;
      offsetX = 7;
      offsetY = 3;
    }

    const dart = gameContext.entityFactory.dart();
    dart.pos.copy(entity.pos);
    dart.vel.set(velX, velY);
    dart.size.set(width, height)
    dart.offset.set(offsetX, offsetY);

    level.entities.add(dart);

    this.shoot = false;
  }
}
