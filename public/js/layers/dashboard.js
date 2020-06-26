import { findPlayers } from '../player.js';
import Player from '../traits/Player.js';

function getPlayerTrait(level) {
  for (const entity of findPlayers(level.entities)) {
    return entity.traits.get(Player);
  }
}

export function createDashboardLayer(font, level) {
  const LINE1 = 3;
  const LINE2 = font.size + 3;

  return function drawDashboard(context) {
    // black background
    context.fillStyle = '#000';
    context.fillRect(0, 0, context.canvas.width, 22);

    const playerTrait = getPlayerTrait(level);

    font.print(playerTrait.name, context, 10, LINE1);
    font.print(playerTrait.score.toString().padStart(6, '0'), context, 10, LINE2);

    // font.print('@x' + playerTrait.coins.toString().padStart(2, '0'), context, 96, LINE2);

    font.print('FLOOR', context, 272, LINE1);
    font.print(level.name, context, 288, LINE2);
  }
}
