import arenaState from './states/arena';
import townState from './states/town';
import shopState from './states/shop';
import store from './store';

// Define the game
var game = new Phaser.Game(896, 512, Phaser.AUTO, 'root');

// Add states to the game
game.state.add('arena', arenaState);
game.state.add('town', townState);
game.state.add('shop', shopState);

// Start the start state
game.state.start('shop');
