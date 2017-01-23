// Require the CSS for Webpack
import css from '../index.css'; // eslint-disable-line import/no-unresolved, no-unused-vars
import Enemy from '../enemy'; // eslint-disable-line import/no-unresolved
import Player from '../player'; // eslint-disable-line import/no-unresolved
import arena from '../maps/arena'; // eslint-disable-line import/no-unresolved
import Fullscreen from '../fullscreen'; // eslint-disable-line import/no-unresolved


var cursors;
var spacebar;

// Enemies
var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;

// Controllers
var fullscreenController;
var playerController;
var player;

function preload() {
  playerController = new Player(this.game);
  this.game.load.image('bullet', 'assets/images/bullet.png');
  this.game.load.image('baddie', 'assets/images/invader.png');
  this.game.load.spritesheet('kaboom', 'assets/images/explosion.png', 64, 64, 23);
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

  // Create keys
  cursors = this.game.input.keyboard.createCursorKeys();
  spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  // Create some baddies to waste
  enemies = [];

  //  This will force player to decelerate and limit its speed
  player.body.drag.set(550);
  player.body.maxVelocity.setTo(200, 200);

  //  The enemies bullet group
  enemyBullets = this.game.add.group();
  enemyBullets.enableBody = true;
  enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
  enemyBullets.createMultiple(100, 'bullet');
  enemyBullets.setAll('anchor.x', 0.5);
  enemyBullets.setAll('anchor.y', 0.5);
  enemyBullets.setAll('outOfBoundsKill', true);
  enemyBullets.setAll('checkWorldBounds', true);

  // Number of enemies to spawn
  enemiesTotal = 20;
  enemiesAlive = 20;

  // TODO: Refactor this into a this.add.group()
  // and use enemies.create() or similar
  // so we can use physics properly
  for (var i = 0; i < enemiesTotal; i++) {
    enemies.push(new Enemy(i, this.game, player, enemyBullets));
  }

  // Explosion pool / Animation for when we rain down a fiery hellstorm upon the invaders
  explosions = this.game.add.group();

  for (var i = 0; i < 10; i++) {
    var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
    explosionAnimation.anchor.setTo(0.5, 0.5);
    explosionAnimation.animations.add('kaboom');
  }

  player.bringToTop();

  // Camera follows player
  this.game.camera.follow(player);

  // Enable fullscreen
  fullscreenController = new Fullscreen(this.game, 'F');
}

function update() {
  // Arena map
  arena.update(this.game, [player, ...enemies]);

  this.game.physics.arcade.overlap(enemyBullets, player, playerController.onBulletCollision, null, this);

  // Draw text with how many enemies are still alive
  enemiesAlive = 0;
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].alive) {
      enemiesAlive++;
      this.game.physics.arcade.collide(player, enemies[i].baddie);
      this.game.physics.arcade.overlap(playerController.bullets, enemies[i].baddie, bulletHitEnemy, null, this);
      enemies[i].update();
    }
  }

  // If they're clicking or hitting spacebar, fire the weapon
  if (this.game.input.activePointer.isDown || spacebar.isDown) {
    playerController.fire(); //  Boom!
  }

  // Handle player update
  playerController.update(cursors);
}

// TODO: Refactor enemies so we can have onBUlletCollision function for each instance individually
// Explosion Animation / Destroy enemies
function bulletHitEnemy(baddie, bullet) {
  bullet.kill();
  var destroyed = enemies[baddie.name].damage();

  if (destroyed) {
    var explosionAnimation = explosions.getFirstExists(false);
    explosionAnimation.reset(baddie.x, baddie.y);
    explosionAnimation.play('kaboom', 30, false, true);
  }
}

function render() {
  this.game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);
  // Keeping score 10 points per kill?
  this.game.debug.text('Score: ' + (enemiesTotal - enemiesAlive)*10 , 215, 32);
}

export default {
  preload,
  create,
  update,
  render
}
