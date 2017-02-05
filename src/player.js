import store from './store';

export default class Player {
  constructor(game) {
    this.game = game;
    this.firestrike = '';
    this.deathmoans = '';
    this.fireRate = 300;
    this.nextFire = 0;
    this.hurtRate = 1500;
    this.nextHurt = this.game.time.now + 1500;
    this.playerPosition;
  }

  preload() {
    this.game.load.image('bullet', 'assets/images/bullet.png');
    this.game.load.image('TJ', 'assets/images/TJ_topdown.png');
    // Audio Files
    this.game.load.audio('firestrike', [ 'assets/audio/SoundEffects/firestrike.ogg' ]);
  }

  create() {
    this.player = this.game.add.sprite(96, this.game.world.height / 2 - 16, 'TJ');

    // JavaScript this is strange sometimes
    var controller = this;
    this.player.controller = controller;

    this.player.anchor.setTo(0.5, 0.5);

    // We need to enable physics on the player
    this.game.physics.arcade.enable(this.player);

    // Player physics properties
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
    this.playerPosition = new Phaser.Rectangle(this.player.x, this.player.y, this.player.width, this.player.height);

    var keyA = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    var keyW = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    var keyS = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    var keyD = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

    // Horizontal motion
    if (cursors.left.isDown || keyA.isDown) {
      if (cursors.up.isDown || keyW.isDown || cursors.down.isDOwn || keyS.isDown) {
        this.player.body.velocity.x = (-store.speed) / Math.sqrt(2);
      } else {
        this.player.body.velocity.x = -store.speed;
      }
      this.player.angle = 180;
    } else if (cursors.right.isDown || keyD.isDown) {
      if (cursors.up.isDown || keyW.isDown || cursors.down.isDOwn || keyS.isDown) {
        this.player.body.velocity.x = store.speed / Math.sqrt(2);
      } else {
        this.player.body.velocity.x = store.speed;
      }
      this.player.angle = 0;
    }

    // Vertical motion
    if (cursors.up.isDown || keyW.isDown) {
      // Are we also moving sideways?
      if (cursors.left.isDown || keyA.isDown) {
        this.player.body.velocity.y = (-store.speed) / Math.sqrt(2);
        this.player.angle = 225;
      } else if (cursors.right.isDown || keyD.isDown) {
        this.player.body.velocity.y = (-store.speed) / Math.sqrt(2);
        this.player.angle = 315;
      } else {
        this.player.body.velocity.y = -store.speed;
        this.player.angle = 270;
      }
    } else if (cursors.down.isDown || keyS.isDown) {
      // Are we also moving sideways?
      if (cursors.left.isDown || keyA.isDown) {
        this.player.body.velocity.y = store.speed / Math.sqrt(2);
        this.player.angle = 135;
      } else if (cursors.right.isDown || keyD.isDown) {
        this.player.body.velocity.y = store.speed / Math.sqrt(2);
        this.player.angle = 45;
      } else {
        this.player.body.velocity.y = store.speed;
        this.player.angle = 90;
      }
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
      var spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

      if (spacebar.isDown) {
        var bulletOffset = 20 * Math.sin(this.game.math.degToRad(this.player.angle));
        bullet.reset(this.player.x + bulletOffset, this.player.y);
        bullet.angle = this.player.angle;
        this.game.physics.arcade.velocityFromAngle(bullet.angle, 500, bullet.body.velocity);
        bullet.body.velocity.x += this.player.body.velocity.x;
      } else if (this.game.input.activePointer) {
        this.player.rotation = this.game.physics.arcade.angleToPointer(this.player);
        console.log('Active Pointer');
        bullet.reset(this.player.x, this.player.y);
        bullet.rotation = this.game.physics.arcade.moveToPointer(bullet, 500, this.game.input.activePointer);
      }
      // Delay next bullet fire opportunity
      this.nextFire = this.game.time.now + this.fireRate;

      // Play audio for Fire Strike
      this.firestrike.play('', 0, 0.2, false);
    }
  }

  // When an enemy bullet hits us
  onBulletCollision(player, bullet) {
    // Skip if it's not been long enough since the last time we took damage
    if (this.game.time.now <= this.nextHurt) {
      return;
    }

    // Set next hurt availability
    this.nextHurt = this.game.time.now + this.hurtRate;

    // Hurt the player
    store.health -= bullet.damage;
    bullet.kill();

    // If health depleted, end the game
    if (store.health <= 0) {
      this.onDeath();
    }
  }

  // When an enemy hits us
  onEnemyCollision(enemy) {
    store.health = store.health - enemy.damage / 50;

    // If health depleted, end the game
    if (store.health <= 0) {
      this.onDeath();
    }
  }

  onDeath() {
    /* Debug */
    store.health = store.maxHealth;
    this.game.sound.stopAll();
    this.game.state.start('town');
  }
}
