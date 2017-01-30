// Require the CSS for Webpack
import css from '../index.css';
import title from '../maps/title';
import Fullscreen from '../fullscreen';

// Controls
var enter;

function preload() {
  // Load audio file
  console.log('preload');
}

function create() {
  // Create the map(s)
  title.create(this.game);

  // Create keys
  enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

  // Enable fullscreen
  fullscreenController = new Fullscreen(this.game, 'F');

  console.log('create');
}

function update() {
  // If Enter Pressed Start Game
  if (enter.isDown) {
    // this.game.state.start('town');
  }
}

function render() {
}

export default { preload, create, update, render };
