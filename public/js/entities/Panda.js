import Entity from '../Entity.js';
import Go from '../traits/Go.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import { loadSpriteSheet } from '../loaders/sprite.js';

export function loadPanda() {
  return Promise.all([
    loadSpriteSheet('panda')
  ])
  .then(([sprite]) => {
    return createPandaFactory(sprite);
  });
}

function createPandaFactory(sprite) {
  const runAnim = sprite.animations.get('run');

  function routeFrame(panda) {
    if (panda.traits.get(Jump).falling) {
      return 'jump';
    }
    if (panda.traits.get(Go).distance > 0) {
      if ((panda.vel.x > 0 && panda.traits.get(Go).dir < 0) ||
          (panda.vel.x < 0 && panda.traits.get(Go).dir > 0)) {
        return 'break';
      }
      return runAnim(panda.traits.get(Go).distance);
    }
    return 'idle'
  }

  function drawMario(context) {
    sprite.draw(routeFrame(this), context, 0, 0, this.traits.get(Go).heading < 0);
  }

  return function createMario() {
    const panda = new Entity();

    panda.size.set(16, 16);

    panda.addTrait(new Physics());
    panda.addTrait(new Solid());
    panda.addTrait(new Go());
    panda.addTrait(new Killable());

    panda.traits.get(Killable).removeAfter = 0;
    panda.draw = drawPanda;

    return panda;
  }
}

