// Require the CSS for Webpack
import css from '../index.css';
import mainMenu from '../maps/mainMenu';
import Fullscreen from '../fullscreen';

// Controls
var enter;

// Controllers
var fullscreenController;

function preload() {
  // Load title image file
  this.game.load.image('Title', 'assets/images/title.png');

  mainMenu.preload(this.game);
}

function create() {
  // Create the map(s)
  mainMenu.create(this.game);

  this.game.add.sprite(30, 40, 'Title');

  // Create keys
  enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

  // Enable fullscreen
  fullscreenController = new Fullscreen(this.game, 'F');
}

function update() {
  // If Enter Pressed Start Game
  if (enter.isDown) {
    this.game.state.start('town');
  }
}

export default { preload, create, update };
