import Trait from '../Trait.js';

export const Headings = {
  UP:    Symbol('up'),
  LEFT:  Symbol('left'),
  DOWN:  Symbol('down'),
  RIGHT: Symbol('right')
}

export default class Go extends Trait {
  constructor() {
    super();
    this.speed = 5000;

    this.dirX = 0;
    this.dirY = 0;

    this.distanceX = 0;
    this.distanceY = 0;

    this.heading = Headings.DOWN;
  }

  update(entity, { deltaTime }) {
    // move left/right
    if (this.dirX !== 0) {
      this.distanceX += Math.abs(entity.vel.x) * deltaTime;
      entity.vel.x = this.speed * deltaTime * this.dirX;
      this.heading = this.dirX > 0 ? Headings.RIGHT : Headings.LEFT;

    } else {
      this.distanceX = 0;
      entity.vel.x = 0;
    }

    // move up/down
    if (this.dirY !== 0) {
      this.distanceY += Math.abs(entity.vel.y) * deltaTime;
      entity.vel.y = this.speed * deltaTime * this.dirY;
      this.heading = this.dirY > 0 ? Headings.DOWN : Headings.UP;

    } else {
      this.distanceY = 0;
      entity.vel.y = 0;
    }
  }
}
