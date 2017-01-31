import store from '../store';

export default class Guardian {
  constructor(index, game, player, health, damage) {
    this.game = game;
    this.player = player;
    this.health = health;
    this.damage = damage;

    this.speed = 30;

    this.alive = true;
    var startX = (Math.random() * (28 - 1) + 1) / 30 * game.world.width;
    var startY = (Math.random() * (28 - 1) + 1) / 30 * game.world.height;

    // JavaScript this is strange sometimes
    var controller = this;

    this.baddie = this.game.add.sprite(startX, startY, 'Guardian');
    this.baddie.controller = controller;

    this.baddie.scale.setTo(1, 1);
    this.baddie.anchor.set(0.5);
    this.baddie.name = index.toString();
    this.game.physics.enable(this.baddie, Phaser.Physics.ARCADE);
    this.baddie.body.immovable = true;
    this.baddie.body.collideWorldBounds = true;
    this.baddie.body.bounce.setTo(1, 1);

    // Create animations
    this.baddie.animations.add('left', [ 0, 1, 2 ], 2, true);
    this.baddie.animations.add('right', [ 5, 6, 7 ], 2, true);
    this.baddie.animations.add('down', [ 10, 11, 12 ], 2, true);
    this.baddie.animations.add('up', [ 15, 16, 17 ], 2, true);
    this.baddie.animations.add('attack_left', [ 3, 4 ], 2, true);
    this.baddie.animations.add('attack_right', [ 8, 9 ], 2, true);
    this.baddie.animations.add('attack_down', [ 13, 14 ], 2, true);
    this.baddie.animations.add('attack_up', [ 18, 19 ], 2, true);
  }

  // Hurts the enemy and returns true if the enemy was killed
  hurt() {
    this.health -= 1;

    // Kill the enemy if health depleted
    if (this.health <= 0) {
      this.alive = false;
      this.baddie.kill();

      store.coins++;

      return true;
    }

    return false;
  }

  // Controls what the enemy does on every update
  update() {
    // Grabs current angle and distance between player and enemy
    var targetAngle = this.game.math.angleBetween(this.baddie.x, this.baddie.y, this.player.x, this.player.y);
    var distance = this.game.math.distance(this.player.x, this.player.y, this.baddie.x, this.baddie.y);

    // Set animation
    if (targetAngle < -2.445) {
      this.baddie.animations.play('left');
    } else if (targetAngle < -0.7853) {
      this.baddie.animations.play('up');
    } else if (targetAngle < 0.7853) {
      this.baddie.animations.play('right');
    } else if (targetAngle < 2.445) {
      this.baddie.animations.play('down');
    }

    // Attack the player if we're close enough
    if (distance < 100) {
      // Set animation
      if (targetAngle < -2.445) {
        this.baddie.animations.play('attack_left');
      } else if (targetAngle < -0.7853) {
        this.baddie.animations.play('attack_up');
      } else if (targetAngle < 0.7853) {
        this.baddie.animations.play('attack_right');
      } else if (targetAngle < 2.445) {
        this.baddie.animations.play('attack_down');
      }

      // TODO: Kill the player when attack animation ends
      this.player.controller.onEnemyCollision(this);
    }

    // Update velocity
    this.baddie.body.velocity.x = Math.cos(targetAngle) * this.speed;
    this.baddie.body.velocity.y = Math.sin(targetAngle) * this.speed;
  }

  // Return the sprite object associated with this enemy
  getSprite() {
    return this.baddie;
  }
}
