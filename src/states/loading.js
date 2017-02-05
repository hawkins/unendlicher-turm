// Require the CSS for Webpack
import css from '../index.css';
import Fullscreen from '../fullscreen';
import store from '../store';

// Controls
var space;
var enter;

// Controllers
var fullscreenController;

var percentage = 0;
var loadingText = 0;
var instructions1 = 0;
var instructions2 = 0;

function preload() {
  // Load title image file
  this.game.load.image('tower', 'assets/images/tower.png');
}

function create() {
  // Background color
  this.game.stage.backgroundColor = '#000';

  // Create Loading Sprites
  this.tower = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'tower');
  this.tower.anchor.setTo(1, 1.5);
  this.tower.scale.setTo(0.5, 0.5);

  // Create text
  this.style = { font: '18px Courier', fill: '#fff' };
  loadingText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 75, 'Loading...0%', this.style);
  loadingText.anchor.setTo(1);

  instructions1 = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 75, '', this.style);
  instructions1.anchor.setTo(0.65, 1);

  instructions2 = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 50, '', this.style);
  instructions2.anchor.setTo(0.65, 1);

  this.game.time.events.loop(Phaser.Timer.HALF / 50, updateLoad, this);

  // Create keys
  space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

  // Enable fullscreen
  fullscreenController = new Fullscreen(this.game, 'F');
}

function updateLoad() {
  if (percentage < 100) {
    percentage++;
    loadingText.setText('Loading...' + percentage + '%');
  } else {
    instructions1.setText('Press the Spacebar to move to the next floor.');
    instructions2.setText('Press Enter to return to town.');
    loadingText.setText('');
  }
}

function update() {
  // If Enter Pressed Start Game
  if (space.isDown) {
    percentage = 0;
    this.game.state.start('arena');
  }
  if (enter.isDown) {
    percentage = 0;
    this.game.state.start('town');
  }
}

export default { preload, create, update };
