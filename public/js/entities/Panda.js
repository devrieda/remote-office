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
  const runRight = sprite.animations.get('run-right');
  const runLeft  = sprite.animations.get('run-left');
  const runUp    = sprite.animations.get('run-up');
  const runDown  = sprite.animations.get('run-down');

  function routeFrame(panda) {
    if (panda.traits.get(Go).distance > 0) {
      return runRight(panda.traits.get(Go).distance);
    }
    return 'idle'
  }

  function drawPanda(context) {
    sprite.draw(routeFrame(this), context, 0, 0, this.traits.get(Go).heading < 0);
  }

  return function createPanda() {
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

