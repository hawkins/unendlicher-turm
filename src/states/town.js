// Require the CSS for Webpack
import css from '../index.css';
import Player from '../player';
import town from '../maps/town';
import Fullscreen from '../fullscreen';
import GUI from '../gui';

// eslint-disable-line import/no-unresolved
// Controls
var cursors;

// Controllers
var fullscreenController;
var playerController;
var player;
var gui;

// Audio
var townMusic;

function preload() {
  // Load audio file
  this.game.load.audio('adventure', [ 'assets/audio/SoundEffects/adventure.ogg' ]);

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

  // Create Audio for town
  townMusic = this.game.add.audio('adventure');

  // Setting volume and loop
  townMusic.play('', 1, 0.3, true);

  //  This will force player to decelerate and limit its speed
  player.body.drag.set(550);
  player.body.maxVelocity.setTo(200, 200);

  // Create the GUI
  gui = new GUI(this.game);
  gui.create();

  player.bringToTop();

  // Camera follows player
  this.game.camera.follow(player);

  // Enable fullscreen
  fullscreenController = new Fullscreen(this.game, 'F');
}

function update() {
  // Arena map
  town.update(this.game, [ player ]);

  // Update the gui
  gui.update();

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
