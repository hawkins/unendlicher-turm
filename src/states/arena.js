// Require the CSS for Webpack
import css from '../index.css';
import Player from '../player';
import arena from '../maps/arena';
import Fullscreen from '../fullscreen';
import EnemyFactory from '../enemy-factory';
import store from '../store';

// Keys
var cursors;
var spacebar;

// Controllers
var fullscreenController;
var playerController;
var enemyController;
var player;

function preload() {
  // Create controllers now that game exists
  playerController = new Player(this.game);
  enemyController = new EnemyFactory(this.game, store.wave);

  // Now call actual preload methods
  enemyController.preload();
  playerController.preload();
  arena.preload(this.game);
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

  //  This will force player to decelerate and limit its speed
  player.body.drag.set(550);
  player.body.maxVelocity.setTo(200, 200);

  // Create enemies
  enemyController.create();

  // Add hit handler to enemies
  enemyController.setOnHit(bulletHitEnemy);

  // Ensure player is visible
  player.bringToTop();

  // Camera follows player
  this.game.camera.follow(player);

  // Enable fullscreen
  fullscreenController = new Fullscreen(this.game, 'F');
}

function update() {
  // Arena map
  arena.update(this.game, [player, ...enemyController.enemyGroup.children]);

  this.game.physics.arcade.overlap(enemyController.enemyBullets, player, playerController.onBulletCollision, null, this);

  // Update enemies
  enemyController.update();

  // If they're clicking or hitting spacebar, fire the weapon
  if (this.game.input.activePointer.isDown || spacebar.isDown) {
    playerController.fire(); //  Boom!
  }

  // Handle player update
  playerController.update(cursors);

  // If the wave is complete, unlock the next arena
  if (enemyController.waveComplete) {
    arena.unlock();
  }
}

// Explosion Animation / Destroy enemies
function bulletHitEnemy(baddie, bullet) {
  bullet.kill();
  var destroyed = enemyController.enemies[baddie.name].hurt();

  if (destroyed) {
    var explosionAnimation = enemyController.explosions.getFirstExists(false);
    explosionAnimation.reset(baddie.x, baddie.y);
    explosionAnimation.play('kaboom', 30, false, true);
  }
}

function render() {
  enemyController.render();
}

export default {
  preload,
  create,
  update,
  render
};
