import Entity from '../Entity.js';
import Go from '../traits/Go.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import { Headings } from '../traits/Go.js';
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
    const go = panda.traits.get(Go);

    // running
    if (go.dirX > 0) {
      return runRight(go.distanceX);

    } else if (go.dirX < 0) {
      return runLeft(go.distanceX);

    } else if (go.dirY > 0) {
      return runDown(go.distanceY);

    } else if (go.dirY < 0) {
      return runUp(go.distanceY);
    }

    // not running, but make sure they're facing the right way!
    if (go.heading === Headings.RIGHT) {
      return 'run-right-2';
    } else if (go.heading === Headings.LEFT) {
      return 'run-left-2';
    } else if (go.heading === Headings.DOWN) {
      return 'run-down-2';
    } else if (go.heading === Headings.UP) {
      return 'run-up-2';
    }

    // default
    return 'idle';
  }

  function drawPanda(context) {
    sprite.draw(routeFrame(this), context, 0, 0);
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

