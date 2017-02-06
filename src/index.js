import arenaState from './states/arena';
import townState from './states/town';
import shopState from './states/shop';
import mainMenuState from './states/mainMenu';
import deathMenuState from './states/deathMenu';
import store from './store';

// Define the game
var game = new Phaser.Game(896, 512, Phaser.AUTO, 'root');

// Add states to the game
game.state.add('arena', arenaState);
game.state.add('town', townState);
game.state.add('shop', shopState);
game.state.add('mainMenu', mainMenuState);
game.state.add('deathMenu', deathMenuState);

// Start the start state
game.state.start('mainMenu');
