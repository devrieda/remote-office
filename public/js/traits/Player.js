import Trait from '../Trait.js';

const MV_LIFE_THRESHOLD = 100;

export default class Player extends Trait {
  constructor() {
    super();
    this.name  = 'UNNAMED';
    this.mv    = 0;
    this.lives = 3;
    this.score = 0;
  }

  addMv(count) {
    this.mv += count;
    this.queue(entity => entity.sounds.add('coin'));

    while (this.mv >= MV_LIFE_THRESHOLD) {
      this.addLives(1);
      this.mv -= MV_LIFE_THRESHOLD;
    }
  }

  addLives(count) {
    this.lives += count;
  }
}
