import { loadPanda } from './entities/Panda.js';
import { loadDart } from './entities/Dart.js';
import { loadEggbag } from './entities/Eggbag.js';

export function loadEntities(audioContext) {
  const entityFactories = {};

  function addAs(name) {
    return factory => entityFactories[name] = factory;
  }

  return Promise.all([
    loadPanda(audioContext).then(addAs('panda')),
    loadDart(audioContext).then(addAs('dart')),
    loadEggbag(audioContext).then(addAs('eggbag')),
  ])
  .then(() => entityFactories);
}
