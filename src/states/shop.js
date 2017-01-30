// Require the CSS for Webpack
import css from '../index.css';
import Player from '../player';
import shop from '../maps/shop';
import Fullscreen from '../fullscreen';
import store from '../store';
import GUI from '../gui';
import powerUps from '../powerups';

// eslint-disable-line import/no-unresolved
// Controls
var cursors;
var spacebar;
var bKey;
var hKey;
var zKey;

// Controllers
var fullscreenController;
var playerController;
var player;
var shopActions;
var gui;
var powerups;

// Audio
var shopMusic;

// Click Rates
var clickRate = 2000;
var nextClick;

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

  // Purchase Keys
  bKey = this.game.input.keyboard.addKey(Phaser.Keyboard.B);
  hKey = this.game.input.keyboard.addKey(Phaser.Keyboard.H);
  zKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);

  nextClick = this.game.time.now + 1000;

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

  // Create the PowerUps
  powerups = new powerUps(this.game);

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

  // Handle player update
  playerController.update(cursors);

  // Update Player Position
  // playerPosition = new Phaser.Rectangle(player.x, player.y, player.width, player.height);
  if (hKey.isDown) {
    if (timer(this.game)) {
      console.log('Heal you wish!');
      console.log('Current Max: ' + store.maxHealth);
      console.log('Current Coins: ' + store.coins);
      powerups.healthZone();
      console.log('New Max: ' + store.maxHealth);
      console.log('New Coins: ' + store.coins);
    }
  } else if (bKey.isDown) {
    if (timer(this.game)) {
      console.log('Bulk up!');
      console.log('Current Max: ' + store.damage);
      console.log('Current Coins: ' + store.coins);
      powerups.damageZone();
      console.log('New Max: ' + store.damage);
      console.log('New Coins: ' + store.coins);
    }
  } else if (zKey.isDown) {
    if (timer(this.game)) {
      console.log('Zoom Zoom!');
      console.log('Current Max: ' + store.speed);
      console.log('Current Coins: ' + store.coins);
      powerups.speedZone();
      console.log('New Max: ' + store.speed);
      console.log('New Coins: ' + store.coins);
    }
  }
}

function render() {
  gui.render();
}

function shutdown() {
  this.game.sound.stopAll();
}

function timer(instance) {
  // If we can purchase
  if (instance.time.now > nextClick) {
    nextClick = instance.time.now + clickRate;
    return true;
  } else {
    return false;
  }
}

export default { preload, create, update, render, shutdown, timer };
