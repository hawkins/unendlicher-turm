// Require the CSS for Webpack
var css = require('./index.css'); // eslint-disable-line import/no-unresolved, no-unused-vars

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'root', {preload: preload, create: create, update: update});

function preload() {
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/star.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

var player;
var walls;
var cursors;

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
}

function update() {
  //  Collide the player and the stars with the walls
  var hitPlatform = game.physics.arcade.collide(player, walls);

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
}
