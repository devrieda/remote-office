import TileResolver from './TileResolver.js';
import { blueMoon } from './tiles/blue-moon.js';
import { coffee } from './tiles/coffee.js';
import { laCroix } from './tiles/la-croix.js';
import { mv } from './tiles/mv.js';
import { nerf } from './tiles/nerf.js';
import { wall } from './tiles/wall.js';

const handlers = {
  blueMoon,
  coffee,
  laCroix,
  mv,
  nerf,
  wall
}

export default class TileCollider {
  constructor() {
    this.resolvers = []
  }

  addGrid(tileMatrix) {
    this.resolvers.push(new TileResolver(tileMatrix));
  }

  checkX(entity, gameContext, level) {
    let x;
    if (entity.vel.x > 0) {
      x = entity.bounds.right;
    } else if (entity.vel.x < 0) {
      x = entity.bounds.left;
    } else {
      return;
    }

    for (const resolver of this.resolvers) {
      const matches = resolver.searchByRange(
        x, x, entity.bounds.top, entity.bounds.bottom
      );

      matches.forEach(match => {
        this.handle(0, entity, match, resolver, gameContext, level);
      });
    }
  }

  checkY(entity, gameContext, level) {
    let y;
    if (entity.vel.y > 0) {
      y = entity.bounds.bottom;
    } else if (entity.vel.y < 0) {
      y = entity.bounds.top;
    } else {
      return;
    }

    for (const resolver of this.resolvers) {
      const matches = resolver.searchByRange(
        entity.bounds.left, entity.bounds.right, y, y
      );

      matches.forEach(match => {
        this.handle(1, entity, match, resolver, gameContext, level);
      });
    }
  }

  handle(index, entity, match, resolver, gameContext, level) {
    const tileCollisionContext = {
      entity,
      match,
      resolver,
      gameContext,
      level
    };

    const handler = handlers[match.tile.type];
    if (handler) {
      handler[index](tileCollisionContext);
    }
  }
}
