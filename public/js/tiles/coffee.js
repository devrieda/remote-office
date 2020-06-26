import { Sides } from '../Entity.js';
import Player from '../traits/Player.js';

function handle({ entity, match, resolver }) {
  if (entity.traits.has(Player)) {
    entity.traits.get(Player).addCoffee();
    const grid = resolver.matrix;
    grid.delete(match.indexX, match.indexY);
  }
}

export const coffee = [handle, handle];
