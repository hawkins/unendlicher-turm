import arenaState from './states/arena';
import townState from './states/town';
import store from './store';

console.log(store);
// Define the game
var game = new Phaser.Game(896, 504, Phaser.AUTO, 'root');

// Add states to the game
game.state.add('arena', arenaState);
game.state.add('town', townState);

// Start the start state
game.state.start('town');
