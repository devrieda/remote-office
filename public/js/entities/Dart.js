import Entity from '../Entity.js';
import Trait from '../Trait.js';
import Velocity from '../traits/Velocity.js';
import Killable from '../traits/Killable.js';
import Physics from '../traits/Physics.js';
import Weapon from '../traits/Weapon.js';
import { loadSpriteSheet } from '../loaders/sprite.js';

export function loadDart() {
  return loadSpriteSheet('dart')
    .then(createDartFactory);
}

function calcHeading(vel) {
  if (vel.x > 0) {
    return 'right';

  } else if (vel.x < 0) {
    return 'left';

  } else if (vel.y > 0) {
    return 'down';

  } else if (vel.y < 0) {
    return 'up';

  } else {
    return 'right';
  }
}

class Behavior extends Trait {
  constructor() {
    super();
  }

  // the dart dies when it hits something
  obstruct(entity, side) {
    entity.traits.get(Killable).kill();
  }

  collides(us, them) {
  }
}

function createDartFactory(sprite) {
  function routeFrame(dart) {
    const heading = calcHeading(dart.vel);

    const distance = dart.pos.x + dart.pos.y;
    return sprite.animations.get(`dart-${heading}`)(distance);
  }

  function drawDart(context) {
    sprite.draw(routeFrame(this), context, 0, 0);
  }

  return function createDart() {
    const dart = new Entity();
    dart.size.set(16, 16);

    dart.addTrait(new Velocity());
    dart.addTrait(new Killable());
    dart.addTrait(new Physics());
    dart.addTrait(new Weapon());
    dart.addTrait(new Behavior());

    dart.traits.get(Killable).removeAfter = 0;

    dart.draw = drawDart;
    return dart;
  }
}
