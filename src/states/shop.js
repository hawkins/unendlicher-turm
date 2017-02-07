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
var enter;

// Controllers
var fullscreenController;
var playerController;
var player;
var shopActions;
var gui;
var powerups;
var playerPosition;

// Click Rates
var clickRate = 1000;
var nextClick;

// MAP
// Create Variables for Object Layers
var healthPortal;
var strengthPortal;
var speedPortal;

// Create Variables for Portal Tile Position
var healthStone;
var strengthStone;
var speedStone;

// Create Variable for Object Layer
var height;
var name;
var properties;
var rectangle;
var rotation;
var type;
var visible;
var width;
var x;
var y;

function preload() {
  // Load tilemap
  this.game.load.tilemap('shop', 'assets/maps/shop.json', null, Phaser.Tilemap.TILED_JSON);

  // Load tiles image
  this.game.load.image('tiles', 'assets/images/tiles.png');

  // Load audio file
  this.game.load.audio('adventure', [ 'assets/audio/SoundEffects/adventure.ogg' ]);

  playerController = new Player(this.game);
  playerController.preload();
  shop.preload(this.game);
}

function create() {
  // Enable the Arcade Physics system
  this.game.physics.startSystem(Phaser.Physics.ARCADE);

  // Create the map
  var map = this.game.add.tilemap('shop');
  map.addTilesetImage('DungeonCrawl_ProjectUtumnoTileset', 'tiles');

  // TODO: Determine why only one Portals can exist
  // Create object layer
  // healthPortal = map.objects.Portals[0];
  // strengthPortal = map.obects.Portals[1];
  // speedPortal = map.objects.Portals[2];
  // Assign Portal Position (x, y , width, height)
  healthStone = new Phaser.Rectangle(301, 32, 68, 42);
  strengthStone = new Phaser.Rectangle(431, 32, 68, 42);
  speedStone = new Phaser.Rectangle(557, 32, 68, 42);

  // Create the map(s)
  shop.create(this.game);

  // Create the player
  player = playerController.create();

  // Create keys
  cursors = this.game.input.keyboard.createCursorKeys();
  enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

  nextClick = this.game.time.now + 1000;

  if (store.backgroundMusic.name !== 'mainBackground') {
    // Create Audio for town
    store.backgroundMusic = this.game.add.audio('mainBackground');

    // Setting volume and loop
    store.backgroundMusic.play('', 1, 0.3, true);
  }

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
}

function update() {
  // Arena map
  shop.update(this.game, [ player ]);

  // Update the gui
  gui.update();

  // Handle player update
  playerController.update(cursors);

  // Update Player Position
  playerPosition = new Phaser.Rectangle(player.x, player.y, player.width, player.height);

  if (enter.isDown && healthStone.contains(playerPosition.x, playerPosition.y)) {
    if (timer(this.game)) {
      powerups.healthZone();
    }
  } else if (enter.isDown && strengthStone.contains(playerPosition.x, playerPosition.y)) {
    if (timer(this.game)) {
      powerups.damageZone();
    }
  } else if (enter.isDown && speedStone.contains(playerPosition.x, playerPosition.y)) {
    if (timer(this.game)) {
      powerups.speedZone();
    }
  }
}

function render() {
  gui.render();
}

function shutdown() {
  if (store.nextState !== 'town') {
    this.game.sound.stopAll();
  }
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
