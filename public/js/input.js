import Keyboard from './KeyboardState.js';
import InputRouter from './InputRouter.js';
import Go, { Headings } from './traits/Go.js';

export function setupKeyboard(window) {
  const input = new Keyboard();
  const router = new InputRouter();

  input.listenTo(window);

  // B button
  input.addMapping('KeyH', keyState => {
    console.log('press B', keyState);
  });

  // A button
  input.addMapping('KeyJ', keyState => {
    console.log('press A', keyState);
  });

  // D-pad UP
  input.addMapping('KeyW', keyState => {
    router.route(entity => entity.traits.get(Go).dirY += keyState ? -1 : 1);
  });

  // D-pad LEFT
  input.addMapping('KeyA', keyState => {
    router.route(entity => entity.traits.get(Go).dirX += keyState ? -1 : 1);
  });

  // D-pad DOWN
  input.addMapping('KeyS', keyState => {
    router.route(entity => entity.traits.get(Go).dirY += keyState ? 1 : -1);
  });

  // D-pad RIGHT
  input.addMapping('KeyD', keyState => {
    router.route(entity => entity.traits.get(Go).dirX += keyState ? 1 : -1);
  });

  return router;
}
