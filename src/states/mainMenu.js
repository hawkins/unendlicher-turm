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

  // Load start game image file
  this.game.load.image('startGame', 'assets/images/startGame.png');

  // Load "How to Play" game image file
  this.game.load.image('htpGame', 'assets/images/htpGame.png');

  // Load Story game image file
  this.game.load.image('storyGame', 'assets/images/storyGame.png');

  mainMenu.preload(this.game);
}

function create() {
  // Create the map(s)
  mainMenu.create(this.game);

  // Create Title Sprite
  this.game.add.sprite(30, 40, 'Title');

  // Create Start Game Sprite
  this.game.add.sprite(660, 335, 'startGame');

  // Create "How to Play" Game Sprite
  this.game.add.sprite(570, 35, 'htpGame');

  // Create Story Game Sprite
  this.game.add.sprite(565, 180, 'storyGame');

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
