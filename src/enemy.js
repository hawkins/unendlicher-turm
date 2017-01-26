export default class Enemy {
  constructor(index, game, player, bullets, health, damage) {
    this.game = game;
    this.player = player;
    this.bullets = bullets;
    this.health = health;
    this.damage = damage;

    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;
    var startX = (Math.random() * (28 - 1) + 1) / 30 * game.world.width;
    var startY = (Math.random() * (28 - 1) + 1) / 30 * game.world.height;

    this.baddie = this.game.add.sprite(startX, startY, 'baddie');
    this.baddie.anchor.set(0.5);
    this.baddie.name = index.toString();
    this.game.physics.enable(this.baddie, Phaser.Physics.ARCADE);
    this.baddie.body.immovable = false;
    this.baddie.body.collideWorldBounds = true;
    this.baddie.body.bounce.setTo(1, 1);
    this.baddie.angle = this.game.rnd.angle();

    // increasing this will increase the movement speed of the enemies
    this.game.physics.arcade.velocityFromRotation(this.baddie.rotation, 90, this.baddie.body.velocity);
  }

  // Hurts the enemy and returns true if the enemy was killed
  hurt() {
    this.health -= 1;

    // Kill the enemy if health depleted
    if (this.health <= 0) {
      this.alive = false;
      this.baddie.kill();
      return true;
    }
    return false;
  }

  // Controls what the enemy does on every update
  update() {
    if (this.game.physics.arcade.distanceBetween(this.baddie, this.player) < 300) {
      if (this.game.time.now > this.nextFire) {
        this.nextFire = this.game.time.now + this.fireRate;

        var bullet = this.bullets.getFirstDead();
        bullet.reset(this.baddie.x, this.baddie.y);
        bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
      }
    }
  }

  // Return the sprite object associated with this enemy
  getSprite() {
    return this.baddie;
  }
}
