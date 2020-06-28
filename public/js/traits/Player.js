import Trait from '../Trait.js';
import Go, { Headings } from './Go.js';
import Killable from './Killable.js';

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

    // damage
    this.damaged  = false;
    this.weakened = false;
    this.weakenedTime = 0;
    this.weakenedFor  = 2;
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
    this.queue(entity => entity.sounds.add('drink'));
  }

  drinkBlueMoon() {
    this.itemA = '';
    this.addDamage(1);
  }

  addDamage(count) {
    this.life -= count;
    this.damaged  = true;
    this.weakened = true;
    this.queue(entity => entity.sounds.add('damage'));
  }

  shootDart() {
    this.shoot = true;
    this.queue(entity => entity.sounds.add('dart'));
  }

  update(entity, gameContext, level) {
    this.emitDart(entity, gameContext, level);
    this.sustainDamage(entity, gameContext, level);
  }

  emitDart(entity, gameContext, level) {
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

  sustainDamage(entity, { deltaTime }, level) {
    // weakened state (flashing)...
    if (this.weakened) {
      this.weakenedTime += deltaTime;
      if (this.weakenedTime > this.weakenedFor) {
        this.weakened = false;
        this.weakenedTime = 0;
      }
    }

    if (!this.damaged) { return; }

    // die... if they're dead
    const killable = entity.traits.get(Killable);
    if (this.life === 0) {
      killable.kill();
      this.damaged = false;
    }

    // bump them back a square
    const go = entity.traits.get(Go);
    if (go.heading === Headings.RIGHT) {
      entity.pos.x -= 16;

    } else if (go.heading === Headings.LEFT) {
      entity.pos.x += 16;

    } else if (go.heading === Headings.UP) {
      entity.pos.y -= 16;

    } else if (go.heading === Headings.DOWN) {
      entity.pos.y -= 16;
    }

    this.damaged = false;
  }
}
