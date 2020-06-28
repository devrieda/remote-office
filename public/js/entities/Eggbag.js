import Entity from '../Entity.js';
import Trait from '../Trait.js';
import Killable from '../traits/Killable.js';
import Player from '../traits/Player.js';
import Weapon from '../traits/Weapon.js';
import PendulumMove from '../traits/PendulumMove.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import { loadSpriteSheet } from '../loaders/sprite.js';
import { loadAudioBoard } from '../loaders/audio.js';

export function loadEggbag(audioContext) {
  return Promise.all([
    loadSpriteSheet('eggbag'),
    loadAudioBoard('eggbag', audioContext)
  ])
  .then(([sprite, audio]) => {
    return createEggbagFactory(sprite, audio);
  });
}

class Behavior extends Trait {
  constructor() {
    super();
  }

  collides(us, them) {
    const killable = us.traits.get(Killable);
    if (killable.dead) { return; }

    // if this is a weapon, we die
    const weapon = them.traits.get(Weapon);
    if (weapon) {
      them.traits.get(Killable).kill();
      killable.kill();
      this.queue(entity => entity.sounds.add('splat'));
    }

    // if this is a player
    const player = them.traits.get(Player);
    if (player) {
      player.addDamage(1);
    }
  }
}

function createEggbagFactory(sprite, audio) {
  const anim = sprite.animations.get('eggbag');
  const dead = sprite.animations.get('dead');

  function routeAnim(eggbag) {
    if (eggbag.traits.get(Killable).dead) {
      return dead(eggbag.traits.get(Killable).deadTime);
    }
    return anim(eggbag.lifetime);
  }

  function drawEggbag(context) {
    sprite.draw(routeAnim(this), context, 0, 0);
  }

  return function createEggbag() {
    const eggbag = new Entity();
    eggbag.audio = audio;
    eggbag.size.set(16, 16);

    eggbag.addTrait(new Physics());
    eggbag.addTrait(new Solid());
    eggbag.addTrait(new PendulumMove());
    eggbag.addTrait(new Behavior());
    eggbag.addTrait(new Killable());

    eggbag.traits.get(Killable).removeAfter = 0.18;
    eggbag.draw = drawEggbag;
    return eggbag;
  }
}

