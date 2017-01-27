// Require the CSS for Webpack
import css from '../index.css';
import Player from '../player';
import shop from '../maps/shop';
import Fullscreen from '../fullscreen';
import store from '../store';
import GUI from '../gui';

// eslint-disable-line import/no-unresolved
// Controls
var cursors;
var spacebar;

// Controllers
var fullscreenController;
var playerController;
var player;
var shopActions;
var gui;

// Audio
var shopMusic;

function preload() {
  // Load audio file
  this.game.load.audio('adventure', [ 'assets/audio/SoundEffects/adventure.ogg' ]);

  playerController = new Player(this.game);
  playerController.preload();
  shop.preload(this.game);
}

function create() {
  // Enable the Arcade Physics system
  this.game.physics.startSystem(Phaser.Physics.ARCADE);

  // Create the map(s)
  shop.create(this.game);

  // Create the player
  player = playerController.create();

  // Create keys
  cursors = this.game.input.keyboard.createCursorKeys();
  spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  // Create Audio for shop
  shopMusic = this.game.add.audio('adventure');

  // Setting volume and loop
  shopMusic.play('', 1, 0.3, true);

  //  This will force player to decelerate and limit its speed
  player.body.drag.set(550);
  player.body.maxVelocity.setTo(200, 200);

  // Create the GUI
  gui = new GUI(this.game);
  gui.create();

  // Ensure player is visible
  player.bringToTop();

  // Camera follows player
  this.game.camera.follow(player);

  // Enable fullscreen
  fullscreenController = new Fullscreen(this.game, 'F');

  console.log(player);
}

function update() {
  // Arena map
  shop.update(this.game, [ player ]);

  // Update the gui
  gui.update();

  if (spacebar.isDown && shop.healthZone(player.position.x + player.width / 2, player.position.y + player.height / 2)) {
    console.log('Player on Board');
  }

  // Handle player update
  playerController.update(cursors);
}

function render() {
  gui.render();
}

function shutdown() {
  this.game.sound.stopAll();
}

export default { preload, create, update, render, shutdown };
