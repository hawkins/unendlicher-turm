import arenaState from './states/arena';
import townState from './states/town';

import Player from './player';

var game = new Phaser.Game(896, 504, Phaser.AUTO, 'root');

game.state.add('arena', arenaState);
game.state.add('town', townState);

game.state.start('town');
