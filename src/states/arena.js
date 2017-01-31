// Require the CSS for Webpack
import css from '../index.css';
import Player from '../player';
import arena from '../maps/arena';
import Fullscreen from '../fullscreen';
import EnemyFactory from '../enemy-factory';
import store from '../store';
import GUI from '../gui';

// Keys
var cursors;
var spacebar;

// Controllers
var fullscreenController;
var playerController;
var enemyController;
var player;
var gui;

// Audio
var baddieDeath;

function preload() {
  // Create controllers now that game exists
  playerController = new Player(this.game);
  enemyController = new EnemyFactory(this.game, store.wave);

  // Now call actual preload methods
  enemyController.preload();
  playerController.preload();
  arena.preload(this.game);

  // Load Audio File
  this.game.load.audio('arenaBackground', [ 'assets/audio/SoundEffects/madGod.ogg' ]);
  this.game.load.audio('baddieDeath', [ 'assets/audio/SoundEffects/baddieDeath.ogg' ]);
}

function create() {
  // Enable the Arcade Physics system
  this.game.physics.startSystem(Phaser.Physics.ARCADE);

  // Create the map(s)
  arena.create(this.game);

  // Create the player
  player = playerController.create();

  // Attach bullets to player for enemyController to access
  player.bullets = playerController.bullets;

  // Attach player to enemyController
  enemyController.setTarget(player);

  // Create keys
  cursors = this.game.input.keyboard.createCursorKeys();
  spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  // Create sounds
  baddieDeath = this.game.add.audio('baddieDeath');

  if (store.backgroundMusic.name !== 'arenaBackground') {
    // Create Audio for town
    store.backgroundMusic = this.game.add.audio('arenaBackground');

    // Setting volume and loop
    store.backgroundMusic.play('', 1, 0.3, true);
  }

  // This will force player to decelerate and limit its speed
  player.body.drag.set(550);
  player.body.maxVelocity.setTo(200, 200);

  // Create enemies
  enemyController.create();

  // Add hit handler to enemies
  enemyController.setOnHit(bulletHitEnemy);

  // Create GUI
  gui = new GUI(this.game);
  gui.create();

  // Ensure player is visible
  player.bringToTop();

  // Camera follows player
  this.game.camera.follow(player);

  // Enable fullscreen
  fullscreenController = new Fullscreen(this.game, 'F');

  console.log('Your in the state: ' + store.nextState);
}

function update() {
  // Arena map
  arena.update(this.game, [ player, ...enemyController.enemyGroup.children ]);

  // Collide projectiles and player
  this.game.physics.arcade.overlap(enemyController.enemySpells, player, playerController.onBulletCollision, null, playerController);
  this.game.physics.arcade.overlap(enemyController.enemyArrows, player, playerController.onBulletCollision, null, playerController);

  // Update enemies
  enemyController.update();

  // If they're clicking or hitting spacebar, fire the weapon
  if (this.game.input.activePointer.isDown || spacebar.isDown) {
    playerController.fire(); // Boom!
  }

  // Handle player update
  playerController.update(cursors);

  // Update GUI
  gui.update();

  // If the wave is complete, unlock the next arena
  if (enemyController.waveComplete) {
    arena.unlock();
  }
}

// Explosion Animation / Destroy enemies
function bulletHitEnemy(baddie, bullet) {
  bullet.kill();
  var destroyed = baddie.controller.hurt();

  if (destroyed) {
    var explosionAnimation = enemyController.explosions.getFirstExists(false);
    explosionAnimation.reset(baddie.x, baddie.y);
    explosionAnimation.play('kaboom', 30, false, true);
  }
}

function shutdown() {
  if (store.nextState !== 'arena') {
    this.game.sound.stopAll();
  }
}

function render() {
  enemyController.render();
  gui.render();
}

export default { preload, create, update, render, shutdown };
