// Require the CSS for Webpack
var css = require('./index.css'); // eslint-disable-line import/no-unresolved, no-unused-vars

// GAME MECHANICS
// Features
// * point system : counter for shooting enemies

// TODO:
    // * Create Start menu with instructions
    // * Level Complete! Screen if you win
    // * You are D.E.A.D Screen if you lose
    // * Add a running Score
    // * Display Lives
    // * Spawn lives for player to loot during level

// PLAYER 
// Features 
    // * Movement - up, down, left, right
    // * Player can now rain hell fire. 
    // * Collision Detection between enemies and player

// TODO: 
    // * Fire is still comming out of a strange place on the sprite.


 // ENEMIES 
 // Features: 
    // * We have Enemies!!!
    // * Explosion Animation when destoryed
    // * random spawning and movement

 // TODO: 
    // *  Figure out why enemy fire is not working.
    // *  Add Wall collision detection for baddies.
    // *  Inflict Damage on player when there is a collision 
    // *  Remove ranodom baddie in top left corner.

Enemy = function (index, game, player, bullets) {

    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.health = 3;         // Maybe we can incrementally increase per level to increase difficulty??
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;

    this.baddie = game.add.sprite(x, y, 'baddie');
    
    this.baddie.anchor.set(0.5);
    this.baddie.name = index.toString();
    game.physics.enable(this.baddie, Phaser.Physics.ARCADE);
    this.baddie.body.immovable = false;
    this.baddie.body.collideWorldBounds = true;
    this.baddie.body.bounce.setTo(1, 1);
    this.baddie.angle = game.rnd.angle();

    // increasing this will increase the movement speed of the enemies
    game.physics.arcade.velocityFromRotation(this.baddie.rotation, 90, this.baddie.body.velocity);

};


Enemy.prototype.damage = function() {

    this.health -= 1;
    if (this.health <= 0) {
        this.alive = false;
        this.baddie.kill();
        return true;
    }
    return false;

}

Enemy.prototype.update = function() {

    if (this.game.physics.arcade.distanceBetween(this.baddie, this.player) < 300) {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {

            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();
            bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
        }
    }

};

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'root', {preload: preload, create: create, update: update, render:render});

function preload() {
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/star.png');
  game.load.image('bullet', 'assets/bullet.png');
  game.load.image('baddie', 'assets/invader.png')
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
}

var player;
var walls;
var cursors;
var baddie;

// Enemies
var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;

var currentSpeed = 0;

var bullets;
var fireRate = 100;
var nextFire = 0;

function create() {
  //  We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //  A simple background for our game
  game.add.sprite(0, 0, 'sky');

  //  The walls group contains the walls around the edge of the map
  walls = game.add.group();

  //  We will enable physics for any object that is created in this group
  walls.enableBody = true;

  // Here we create the walls.
  var wall = walls.create(0, game.world.height - 64, 'ground');
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  wall.scale.setTo(2, 2);
  //  This stops it from moving away when you collide with it
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
  baddie = game.add.sprite(0, 0, 'baddie');
  player.anchor.setTo(0.5, 0.5);

  //  This will force it to decelerate and limit its speed
  player.body.drag.set(0.2);
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

  for (var i = 0; i < enemiesTotal; i++){
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

}  // --- End of Create() function ------

function update() {
  //  Collide the player and the stars with the walls
  var hitPlatform = game.physics.arcade.collide(player, walls);
  game.physics.arcade.overlap(enemyBullets, player, bulletHitPlayer, null, this);

  enemiesAlive = 0;

  for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].alive) {
            enemiesAlive++;
            game.physics.arcade.collide(player, enemies[i].baddie);
            game.physics.arcade.overlap(bullets, enemies[i].baddie, bulletHitEnemy, null, this);
            enemies[i].update();
        }
    }

  if (game.input.activePointer.isDown) {
        fire(); //  Boom!
  }

// ********************************
//   Player Movement
// ********************************

  //  Slow the players movement
  if (player.body.velocity.x > 0) {
    player.body.velocity.x -= 10;
  }
  if (player.body.velocity.x < 0) {
    player.body.velocity.x += 10;
  }
  if (player.body.velocity.y > 0) {
    player.body.velocity.y -= 10;
  }
  if (player.body.velocity.y < 0) {
    player.body.velocity.y += 10;
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

  //  Allow the player to jump if they are touching the ground.
  if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
    player.body.velocity.y = -350;
  }
} // ---- End of update() function -----


function bulletHitPlayer (baddie, bullet) {
    bullet.kill();
}

// Explosion Animation / Destroy enemies
function bulletHitEnemy (baddie, bullet) {

    bullet.kill();
    var destroyed = enemies[baddie.name].damage();

    if (destroyed){
        var explosionAnimation = explosions.getFirstExists(false);
        explosionAnimation.reset(baddie.x, baddie.y);
        explosionAnimation.play('kaboom', 30, false, true);
    }

}

// Shoot great balls of fire. 
function fire () {
    if (game.time.now > nextFire && bullets.countDead() > 0) {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstExists(false);

        bullet.reset(player.x, player.y);
        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
    }

}

function render () {
    // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);
}
