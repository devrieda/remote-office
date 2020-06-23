import { loadMario } from './entities/Mario.js';
import { loadPanda } from './entities/Panda.js';

export function loadEntities(audioContext) {
  const entityFactories = {};

  function addAs(name) {
    return factory => entityFactories[name] = factory;
  }

  return Promise.all([
    loadMario(audioContext).then(addAs('mario')),
    loadPanda(audioContext).then(addAs('panda')),
  ])
  .then(() => entityFactories);
}
