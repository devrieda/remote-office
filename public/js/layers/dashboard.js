import { findPlayers } from '../player.js';
import Player from '../traits/Player.js';

function getPlayerTrait(level) {
  for (const entity of findPlayers(level.entities)) {
    return entity.traits.get(Player);
  }
}

export function createDashboardLayer(font, level, sprites) {
  const LINE1 = 3;
  const LINE2 = font.size + 3;

  function drawItemB(context, itemB) {
    context.beginPath();
    context.rect(68.5, 2.5, 18, 17);
    context.stroke();
    context.fillRect(65, 7, 6, 8);
    sprites.draw('B', context, 65, 3)

    if (itemB !== "") {
      sprites.draw(itemB, context, 70, 3);
    }
  }

  function drawItemA(context, itemA) {
    context.beginPath();
    context.rect(94.5, 2.5, 18, 17);
    context.stroke();
    context.fillRect(90, 7, 6, 8);
    sprites.draw('A', context, 91, 3)

    if (itemA !== "") {
      sprites.draw(itemA, context, 96, 3);
    }
  }

  return function drawDashboard(context) {
    // black background
    context.fillStyle = '#000';
    context.fillRect(0, 0, context.canvas.width, 22);

    const playerTrait = getPlayerTrait(level);
    const { name, mv, life, itemB, itemA } = playerTrait;

    // motivosity
    font.print('-  -', context, 8, LINE1);
    sprites.draw('mv-count', context, 15, 1)
    font.print(mv.toString().padStart(4, '0'), context, 8, LINE2);

    // B / A
    context.strokeStyle = '#68c2d3';
    context.fillStyle = '#000';
    drawItemB(context, itemB);
    drawItemA(context, itemA);

    // life
    font.print('-LIFE-', context, 150, LINE1);
    [148, 160, 172, 184].forEach((position, i) => {
      const lifeType = life > i ? 'life-1' : 'life-2';
      sprites.draw(lifeType, context, position, 7);
    });

    // level
    font.print('-LEVEL-', context, 260, LINE1);
    font.print('5TH', context, 283, LINE2);
  }
}
