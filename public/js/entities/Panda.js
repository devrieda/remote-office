import Entity from '../Entity.js';
import Go, { Headings } from '../traits/Go.js';
import Player from '../traits/Player.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import { loadSpriteSheet } from '../loaders/sprite.js';
import { loadAudioBoard } from '../loaders/audio.js';

export function loadPanda(audioContext) {
  return Promise.all([
    loadSpriteSheet('panda'),
    loadAudioBoard('panda', audioContext)
  ])
  .then(([sprite, audio]) => {
    return createPandaFactory(sprite, audio);
  });
}

function createPandaFactory(sprite, audio) {
  function routeFrame(panda) {
    const player   = panda.traits.get(Player);
    const go       = panda.traits.get(Go);
    const killable = panda.traits.get(Killable);

    const nerf = player.itemB === 'nerf-1';
    const modifier = nerf ? '-nerf' : '';

    const runRight = sprite.animations.get(`run-right${modifier}`);
    const runLeft  = sprite.animations.get(`run-left${modifier}`);
    const runUp    = sprite.animations.get(`run-up${modifier}`);
    const runDown  = sprite.animations.get(`run-down${modifier}`);
    const dead     = sprite.animations.get('dead');

    if (killable.dead) { return dead(killable.deadTime); }

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
      return `run-right${modifier}-2`;
    } else if (go.heading === Headings.LEFT) {
      return `run-left${modifier}-2`;
    } else if (go.heading === Headings.DOWN) {
      return `run-down${modifier}-2`;
    } else if (go.heading === Headings.UP) {
      return `run-up${modifier}-2`;
    }

    // default
    return 'idle';
  }

  function drawPanda(context) {
    sprite.draw(routeFrame(this), context, 0, 0);
  }

  return function createPanda() {
    const panda = new Entity();
    panda.audio = audio;
    panda.size.set(16, 16);

    panda.addTrait(new Physics());
    panda.addTrait(new Solid());
    panda.addTrait(new Go());
    panda.addTrait(new Killable());

    panda.traits.get(Killable).removeAfter = 1;
    panda.draw = drawPanda;

    return panda;
  }
}

