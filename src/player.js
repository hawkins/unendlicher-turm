import store from './store';

export default class Player {
  constructor(game) {
    this.game = game;
    this.firestrike;
    this.deathmoans;
    this.fireRate = 300;
    this.nextFire = 0;
  }

  preload() {
    this.game.load.spritesheet('TJ', 'assets/images/TJ_topdown.png', 32, 48);
    // Audio Files
    this.game.load.audio('firestrike', [ 'assets/audio/SoundEffects/firestrike.ogg' ]);
  }

  create() {
    this.player = this.game.add.sprite(96, this.game.world.height / 2 - 16, 'TJ');
    this.player.anchor.setTo(0.5, 0.5);

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(this.player);

    //  Player physics properties
    this.player.body.collideWorldBounds = true;

    // Now create audio for player
    this.firestrike = this.game.add.audio('firestrike');

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

    var keyA = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    var keyW = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    var keyS = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    var keyD = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

    // Horizontal motion
    if (cursors.left.isDown || keyA.isDown) {
      //  Move to the left
      this.player.body.velocity.x = -store.speed;
      this.player.angle = 180;
    } else if (cursors.right.isDown || keyD.isDown) {
      //  Move to the right
      this.player.body.velocity.x = store.speed;
      this.player.angle = 0;
    }

    // Vertical motion
    if (cursors.up.isDown || keyW.isDown) {
      // Move up
      this.player.body.velocity.y = -store.speed;
      this.player.angle = 270;
    } else if (cursors.down.isDown || keyS.isDown) {
      // Move down
      this.player.body.velocity.y = store.speed;
      this.player.angle = 90;
    }

    // Stop motion
    if (!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
      //  Stand still
      this.player.animations.stop();
      this.player.frame = 4;
    }
  }

  render() {
    // TODO: Render a health bar
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

      // Play audio for Fire Strike
      this.firestrike.play('', 0, 0.2, false);
    }
  }

  // When an enemy bullet hits us
  onBulletCollision(enemy, bullet) {
    bullet.kill();
    store.health--;

    // If health depleted, end the game
    if (store.health <= 0) {
      /* Debug */
      store.health = 5;
      this.game.state.start('town');
    }
  }
}
