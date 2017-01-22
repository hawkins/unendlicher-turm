export default class Player {
  constructor(game) {
    this.game = game;
    this.fireRate = 300;
    this.nextFire = 0;
  }

  preload() {
    this.game.load.spritesheet('Wizard', 'assets/images/Wizard.png', 32, 48);
  }

  create() {
    this.player = this.game.add.sprite(96, this.game.world.height / 2 - 16, 'Wizard');
    this.player.anchor.setTo(0.5, 0.5);

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(this.player);

    //  Player physics properties
    this.player.body.collideWorldBounds = true;

    // Now create bullets group
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(30, 'bullet', 0, false);
    this.bullets.setAll('anchor.x', 0);
    this.bullets.setAll('anchor.y', 0);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);

    return this.player;
  }

  update(cursors) {
    // Look at the mouse
    this.player.rotation = this.game.physics.arcade.angleToPointer(this.player);

    // Horizontal motion
    if (cursors.left.isDown) {
      //  Move to the left
      this.player.body.velocity.x = -150;
      this.player.animations.play('left');
    } else if (cursors.right.isDown) {
      //  Move to the right
      this.player.body.velocity.x = 150;
      this.player.animations.play('right');
    }

    // Vertical motion
    if (cursors.up.isDown) {
      // Move up
      this.player.body.velocity.y = -150;
      this.player.animations.play('up');
    } else if (cursors.down.isDown) {
      // Move down
      this.player.body.velocity.y = 150;
      this.player.animations.play('down');
    }

    // Stop motion
    if (!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
      //  Stand still
      this.player.animations.stop();
      this.player.frame = 4;
    }
  }

  // Shoot projectile toward mouse
  fire() {
    // If enough time has past since the last bullet firing
    if (this.game.time.now > this.nextFire) {
      // Then create the bullet
      var bullet = this.bullets.getFirstExists(false);

      bullet.reset(this.player.x, this.player.y);

      bullet.rotation = this.game.physics.arcade.moveToPointer(bullet, 500, this.game.input.activePointer);

      // Delay next bullet fire opportunity
      this.nextFire = this.game.time.now + this.fireRate;
    }
  }

  // When an enemy bullet hits us
  onBulletCollision(enemy, bullet) {
    bullet.kill();
  }
}
