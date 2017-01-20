// Require the CSS for Webpack
import css from './index.css'; // eslint-disable-line import/no-unresolved, no-unused-vars
import Enemy from './enemy';

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'root', {preload: preload, create: create, update: update, render: render});

// Global variables
// Player
var player;
var walls;
var cursors;

// Enemies
var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;

var bullets;
var fireRate = 100;
var nextFire = 0;

function create() {
  // Enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // A simple background for our game
  game.add.sprite(0, 0, 'sky');

  // The walls group contains the walls around the edge of the map
  walls = game.add.group();

  // We will enable physics for any object that is created in this group
  walls.enableBody = true;

  // Here we create the walls.
  var wall = walls.create(0, game.world.height - 64, 'ground');
  // Scale it to fit the width of the game (the original sprite is 400x32 in size)
  wall.scale.setTo(2, 2);
  // This stops it from moving away when you collide with it
  wall.body.immovable = true;

  // Repeat for each wall...
  wall = walls.create(0, 0, 'ground');
  wall.scale.setTo(2, 2);
  wall.body.immovable = true;

  // TODO: Fix sideways wall hitboxes not aligning with sprite when rotated
  /*
  wall = walls.create(64, 0, 'ground');
  wall.scale.setTo(2, 2);
  wall.body.immovable = true;
  wall.angle = 90;
  wall = walls.create(game.world.width - 64, 0, 'ground');
  wall.scale.setTo(2, 2);
  wall.body.immovable = true;
  wall.angle = 90;
  */

  // The player and its settings
  player = game.add.sprite(32, game.world.height - 150, 'dude');
  player.anchor.setTo(0.5, 0.5);

  //  We need to enable physics on the player
  game.physics.arcade.enable(player);

  //  Player physics properties
  player.body.collideWorldBounds = true;

  //  Our two animations, walking left and right. TODO: add up, down
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  // Create cursors
  cursors = game.input.keyboard.createCursorKeys();

  // Creates our enemy/monsters
  var baddie = game.add.sprite(0, 0, 'baddie');

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

  //  Create some baddies to waste :)
  enemies = [];

  // Number of enemies to spawn
  enemiesTotal = 10;
  enemiesAlive = 10;

  // TODO: Refactor this into a game.add.group()
  // and use enemies.create() or similar
  // so we can use physics properly
  for (var i = 0; i < enemiesTotal; i++) {
    enemies.push(new Enemy(i, game, baddie, enemyBullets));
  }

  //  Our bullet group
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30, 'bullet', 0, false);
  bullets.setAll('anchor.x', 0.5);
  bullets.setAll('anchor.y', 0.5);
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('checkWorldBounds', true);

  // Explosion pool / Animation for when we rain down a fiery hellstorm upon the invaders
  explosions = game.add.group();

  for (var i = 0; i < 10; i++) {
    var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
    explosionAnimation.anchor.setTo(0.5, 0.5);
    explosionAnimation.animations.add('kaboom');
  }

  baddie.bringToTop();
}

function update() {
  //  Collide the player with the walls
  var hitPlatform = game.physics.arcade.collide(player, walls);
  game.physics.arcade.overlap(enemyBullets, player, bulletHitPlayer, null, this);

  // Draw text with how many enemies are still alive
  enemiesAlive = 0;
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].alive) {
      enemiesAlive++;
      game.physics.arcade.collide(player, enemies[i].baddie);
      game.physics.arcade.overlap(bullets, enemies[i].baddie, bulletHitEnemy, null, this);
      enemies[i].update();
    }
  }

  // If they're clicking, fire the weapon
  if (game.input.activePointer.isDown) {
    fire(); //  Boom!
  }

  // Horizontal motion
  if (cursors.left.isDown) {
    //  Move to the left
    player.body.velocity.x = -150;
    player.animations.play('left');
  } else if (cursors.right.isDown) {
    //  Move to the right
    player.body.velocity.x = 150;
    player.animations.play('right');
  }

  // Vertical motion
  if (cursors.up.isDown) {
    // Move up
    player.body.velocity.y = -150;
    player.animations.play('up');
  } else if (cursors.down.isDown) {
    // Move down
    player.body.velocity.y = 150;
    player.animations.play('down');
  }

  // Stop motion
  if (!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
    //  Stand still
    player.animations.stop();

    player.frame = 4;
  }
}

function bulletHitPlayer(baddie, bullet) {
  bullet.kill();
}

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

// Shoot great balls of fire from the player
function fire() {
  // If enough time has past since the last bullet firing
  if (game.time.now > nextFire) {
    // Then create the bullet
    var bullet = bullets.getFirstExists(false);
    bullet.reset(player.x, player.y);
    bullet.rotation = game.physics.arcade.moveToPointer(bullet, 500, game.input.activePointer);

    // Delay next bullet fire opportunity
    nextFire = game.time.now + fireRate;
  }
}

function render() {
  // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
  game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);
}
