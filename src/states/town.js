// Require the CSS for Webpack
import css from '../index.css';
import Player from '../player';
import town from '../maps/town';
import Fullscreen from '../fullscreen';

// Controls
var cursors;

// Controllers
var fullscreenController;
var playerController;
var player;

function preload() {
  playerController = new Player(this.game);
  playerController.preload();
  town.preload(this.game);
}

function create() {
  // Enable the Arcade Physics system
  this.game.physics.startSystem(Phaser.Physics.ARCADE);

  // Create the map(s)
  town.create(this.game);

  // Create the player
  player = playerController.create();

  // Create keys
  cursors = this.game.input.keyboard.createCursorKeys();

  //  This will force player to decelerate and limit its speed
  player.body.drag.set(550);
  player.body.maxVelocity.setTo(200, 200);

  player.bringToTop();

  // Camera follows player
  this.game.camera.follow(player);

  // Enable fullscreen
  fullscreenController = new Fullscreen(this.game, 'F');
}

function update() {
  // Arena map
  town.update(this.game, [player]);

  // Handle player update
  playerController.update(cursors);
}

export default {
  preload,
  create,
  update
};
