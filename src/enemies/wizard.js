import store from '../store';

export default class Wizard {
  constructor(index, game, player, bullets, health, damage) {
    this.game = game;
    this.player = player;
    this.bullets = bullets;
    this.health = health;
    this.damage = damage;

    // Enemy speed toward player in pixels/second
    this.speed = 125;
    // Turn rate in degrees/frame
    this.turn_rate = 10;
    // How much the emeney moves around when close to player
    this.jitter_limit = 200;
    // How quickly they jitter in milliseconds
    this.jitter_speed = 10;
    // Distance to maintain from player in pixels
    this.avoid_distance = 250;

    this.fireRate = 1000;
    this.nextFire = this.game.time.now + 900 + 500 * Math.random();
    this.alive = true;
    var startX = (Math.random() * (28 - 1) + 1) / 30 * game.world.width;
    var startY = (Math.random() * (28 - 1) + 1) / 30 * game.world.height;

    // JavaScript this is strange sometimes
    var controller = this;

    this.baddie = this.game.add.sprite(startX, startY, 'Wizard');
    this.baddie.controller = controller;

    this.baddie.anchor.set(0.5);
    this.baddie.name = index.toString();
    this.game.physics.enable(this.baddie, Phaser.Physics.ARCADE);
    this.baddie.body.immovable = false;
    this.baddie.body.collideWorldBounds = true;
    this.baddie.body.bounce.setTo(1, 1);
    this.baddie.angle = this.game.rnd.angle();

    this.game.add.tween(this).to({ wobble: -this.jitter_limit }, this.jitter_speed, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.POSITIVE_INFINITY, true);
    // increasing this will increase the movement speed of the enemies
    this.game.physics.arcade.velocityFromRotation(this.baddie.rotation, 90 + index * 1.5, this.baddie.body.velocity);
  }

  // Hurts the enemy and returns true if the enemy was killed
  hurt() {
    this.health -= 1;

    // Kill the enemy if health depleted
    if (this.health <= 0) {
      this.alive = false;
      this.baddie.kill();
      store.coins += 0.25;
      return true;
    }

    return false;
  }

  // Controls what the enemy does on every update
  update() {
    // Attack
    this.fire();

    // Move
    if (this.alive) {
      // Grabs current angle between player and enemy
      var targetAngle = this.game.math.angleBetween(this.baddie.x, this.baddie.y, this.player.x, this.player.y);
      // adds target angle to wobble
      var avoidAngle = 0;
      if (this == this.baddie) return;
      if (avoidAngle !== 0) return;
      var distance = this.game.math.distance(this.player.x, this.player.y, this.baddie.x, this.baddie.y);

      // works kind of like a dodging mechanism
      if (distance < this.avoid_distance) {
        // Zig away from player at postive angle
        avoidAngle = Math.PI / 1.3;
        // Zag ( on chance move the oppsite direction), negative angle
        if (Phaser.Utils.chanceRoll(40)) avoidAngle *= -1;
      }

      // Add the avoidance angle to steer clear of player
      targetAngle += avoidAngle;

      // Gradually (this.turn_rate) aim towards the target angle
      if (this.baddie.rotation !== targetAngle) {
        // Calculate difference between the current angle and targetAngle
        var delta = targetAngle - this.baddie.rotation;

        // Keep it in range from -180 to 180 to make the most efficient turns.
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;

        // Turn clockwise or counter-clockwise
        if (delta > 0) {
          this.baddie.angle += this.turn_rate;
        } else {
          this.baddie.angle -= this.turn_rate;
        }

        // set angle to target angle if they are close
        if (Math.abs(delta) < this.game.math.degToRad(this.turn)) {
          this.baddie.rotation = targetAngle;
        }
      }

      // Calculate velocity vector based on this.rotation and this.SPEED
      this.baddie.body.velocity.x = Math.cos(this.baddie.rotation) * this.speed;
      this.baddie.body.velocity.y = Math.sin(this.baddie.rotation) * this.speed;
    }
  }

  // Return the sprite object associated with this enemy
  getSprite() {
    return this.baddie;
  }

  fire() {
    // If we're close enough
    if (this.game.physics.arcade.distanceBetween(this.baddie, this.player) < 300) {
      // If we can fire
      if (this.game.time.now > this.nextFire) {
        this.nextFire = this.game.time.now + this.fireRate;

        var bullet = this.bullets.getFirstDead();
        bullet.damage = this.damage;
        bullet.reset(this.baddie.x, this.baddie.y);
        bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
      }
    }
  }
}
