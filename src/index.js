// Require the CSS for Webpack
import css from './index.css'; // eslint-disable-line import/no-unresolved, no-unused-vars
import Enemy from './enemy'; // eslint-disable-line import/no-unresolved
import Player from './player'; // eslint-disable-line import/no-unresolved
import arena from './maps/arena'; // eslint-disable-line import/no-unresolved
import town from './maps/town'; // eslint-disable-line import/no-unresolved
import Fullscreen from './fullscreen'; // eslint-disable-line import/no-unresolved

var game = new Phaser.Game(896, 504, Phaser.AUTO, 'root', {preload, create, update, render});

// Global variables
// Player
var player;
var walls;
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
var playerController = new Player(game);

function preload() {
  game.load.image('sky', 'assets/images/sky.png');
  game.load.image('ground', 'assets/images/platform.png');
  game.load.image('bullet', 'assets/images/bullet.png');
  game.load.image('baddie', 'assets/images/invader.png');
  game.load.spritesheet('kaboom', 'assets/images/explosion.png', 64, 64, 23);
  playerController.preload();
  town.preload(game);
}

function create() {
  // Enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // Create the map
  town.create(game);

  // Create the player
  player = playerController.create();

  // Create keys
  cursors = game.input.keyboard.createCursorKeys();
  spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  // Create some baddies to waste
  enemies = [];

  //  This will force player to decelerate and limit its speed
  player.body.drag.set(550);
  player.body.maxVelocity.setTo(200, 200);

  //  The enemies bullet group
  enemyBullets = game.add.group();
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

  // TODO: Refactor this into a game.add.group()
  // and use enemies.create() or similar
  // so we can use physics properly
  for (var i = 0; i < enemiesTotal; i++) {
    enemies.push(new Enemy(i, game, player, enemyBullets));
  }

  // Explosion pool / Animation for when we rain down a fiery hellstorm upon the invaders
  explosions = game.add.group();

  for (var i = 0; i < 10; i++) {
    var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
    explosionAnimation.anchor.setTo(0.5, 0.5);
    explosionAnimation.animations.add('kaboom');
  }

  player.bringToTop();

  // Camera follows player
  game.camera.follow(player);

  // Enable fullscreen
  fullscreenController = new Fullscreen(game, 'F');
}

function update() {
  // Arena map
  town.update(game, [player, ...enemies]);

  //  Collide the player with the walls
  var hitPlatform = game.physics.arcade.collide(player, walls);
  game.physics.arcade.overlap(enemyBullets, player, playerController.onBulletCollision, null, this);

  // Draw text with how many enemies are still alive
  enemiesAlive = 0;
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].alive) {
      enemiesAlive++;
      game.physics.arcade.collide(player, enemies[i].baddie);
      game.physics.arcade.overlap(playerController.bullets, enemies[i].baddie, bulletHitEnemy, null, this);
      enemies[i].update();
    }
  }

  // If they're clicking or hitting spacebar, fire the weapon
  if (game.input.activePointer.isDown || spacebar.isDown) {
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
  game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);
}
