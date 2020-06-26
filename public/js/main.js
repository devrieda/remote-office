import Level from './Level.js';
import Timer from './Timer.js';
import { createLevelLoader } from './loaders/level.js';
import { createFloorLoader } from './loaders/floor.js';
import { loadFont } from './loaders/font.js';
import { loadEntities } from './entities.js';
import { makePlayer, findPlayers } from './player.js';
import { setupKeyboard } from './input.js';
import { createCameraLayer } from './layers/camera.js';
import { createCollisionLayer } from './layers/collision.js';
import { createDashboardLayer } from './layers/dashboard.js';
import { createPlayerProgressLayer } from './layers/player-progress.js';
import { createColorLayer } from './layers/color.js';
import { createTextLayer } from './layers/text.js';
import SceneRunner from './SceneRunner.js';
import TimedScene from './TimedScene.js';
import Scene from './Scene.js';

async function main(canvas) {
  const videoContext = canvas.getContext('2d');
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([
    loadEntities(audioContext),
    loadFont()
  ]);

  const loadLevel = await createLevelLoader(entityFactory);
  const loadFloor = await createFloorLoader(entityFactory, videoContext);

  const sceneRunner = new SceneRunner();
  const panda = entityFactory.panda();
  panda.size.set(4, 4)
  panda.offset.x = 6;
  panda.offset.y = 12;

  makePlayer(panda, "PANDA");

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(panda);

  async function runLevel(name) {
    const floor = await loadFloor(name);

    panda.pos.set(220, 220);
    floor.entities.add(panda);

    const dashboardLayer = createDashboardLayer(font, floor);
    floor.comp.layers.push(dashboardLayer)

    // camera outline
    // floor.comp.layers.push(createCameraLayer(floor.camera));
    // show collision outlines
    // floor.comp.layers.push(createCollisionLayer(floor))

    sceneRunner.addScene(floor);
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
