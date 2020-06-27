import Entity from '../Entity.js';
import Trait from '../Trait.js';
import Killable from '../traits/Killable.js';
import PendulumMove from '../traits/PendulumMove.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import { loadSpriteSheet } from '../loaders/sprite.js';

export function loadEggbag() {
  return loadSpriteSheet('eggbag')
    .then(createEggbagFactory);
}

class Behavior extends Trait {
  constructor() {
    super();
  }

  collides(us, them) {
    if (us.traits.get(Killable).dead) { return; }
  }
}

function createEggbagFactory(sprite) {
  const anim = sprite.animations.get('eggbag');

  function routeAnim(eggbag) {
    if (eggbag.traits.get(Killable).dead) {
      return 'flat';
    }
    return anim(eggbag.lifetime);
  }

  function drawEggbag(context) {
    sprite.draw(routeAnim(this), context, 0, 0);
  }

  return function createEggbag() {
    const eggbag = new Entity();
    eggbag.size.set(16, 16);

    eggbag.addTrait(new Physics());
    eggbag.addTrait(new Solid());
    eggbag.addTrait(new PendulumMove());
    eggbag.addTrait(new Behavior());
    eggbag.addTrait(new Killable());

    eggbag.draw = drawEggbag;
    return eggbag;
  }
}

