// Require the CSS for Webpack
import css from '../index.css';
import Player from '../player';
import town from '../maps/town';
import Fullscreen from '../fullscreen';
import GUI from '../gui';
import store from '../store';
import Wolfgrave from '../wolfgrave';

// Controls
var cursors;

// Controllers
var fullscreenController;
var playerController;
var player;
var gui;
var wolfgrave;

function preload() {
  // Load audio file
  this.game.load.audio('mainBackground', ['assets/audio/SoundEffects/adventure.ogg']);

  playerController = new Player(this.game, 4, 15);
  playerController.preload();

  wolfgrave = new Wolfgrave(this.game);
  wolfgrave.preload();

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

  if (store.backgroundMusic.name !== 'mainBackground') {
    // Create Audio for town
    store.backgroundMusic = this.game.add.audio('mainBackground');

    // Setting volume and loop
    store.backgroundMusic.play('', 1, 0.3, true);
  }

  //  This will force player to decelerate
  player.body.drag.set(550);

  // Create NPC
  wolfgrave.create();

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
  // Map
  town.update(this.game, [player]);

  // NPC
  wolfgrave.update(player);

  // Update the gui
  gui.update();

  // Handle player update
  playerController.update(cursors);
}

function render() {
  gui.render();
}

function shutdown() {
  if (store.nextState !== 'town' && store.nextState !== 'shop') {
    this.game.sound.stopAll();
  }
}

export default { preload, create, update, render, shutdown };
