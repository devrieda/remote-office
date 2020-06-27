import Level from './Level.js';
import Timer from './Timer.js';
import { createLevelLoader } from './loaders/level.js';
import { loadEntities } from './entities.js';
import { makePlayer, findPlayers } from './player.js';
import { setupKeyboard } from './input.js';
import { createCameraLayer } from './layers/camera.js';
import { createCollisionLayer } from './layers/collision.js';
import { createPlayerProgressLayer } from './layers/player-progress.js';
import { createColorLayer } from './layers/color.js';
import { createTextLayer } from './layers/text.js';
import SceneRunner from './SceneRunner.js';
import TimedScene from './TimedScene.js';
import Scene from './Scene.js';

async function main(canvas) {
  const videoContext = canvas.getContext('2d');
  const audioContext = new AudioContext();

  const [entityFactory] = await Promise.all([
    loadEntities(audioContext),
  ]);

  const loadLevel = await createLevelLoader(entityFactory, videoContext);

  const sceneRunner = new SceneRunner();
  const panda = entityFactory.panda();
  panda.size.set(4, 4);
  panda.offset.set(6, 12);

  makePlayer(panda, "PANDA");

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(panda);

  async function runLevel(name) {
    const level = await loadLevel(name);

    panda.pos.set(576, 412);
    level.entities.add(panda);

    // camera outline
    // level.comp.layers.push(createCameraLayer(level.camera));
    // show collision outlines
    // level.comp.layers.push(createCollisionLayer(level))

    sceneRunner.addScene(level);
    sceneRunner.runNext();
  }

  const gameContext = {
    audioContext,
    videoContext,
    entityFactory,
    deltaTime: null
  }

  const timer = new Timer(1/60);
  timer.update = function update(deltaTime) {
    gameContext.deltaTime = deltaTime;
    sceneRunner.update(gameContext);
  }

  timer.start();

  runLevel('5th');
};

const canvas = document.getElementById('screen');
const start = () => {
  main(canvas);
  window.removeEventListener('click', start);
}
window.addEventListener('click', start);
