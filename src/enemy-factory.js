import Enemy from './enemy';

export default class EnemyFactory {
  constructor(game, wave) {
    this.game = game;
    this.wave = wave;

    this.player = undefined;
    this.waveComplete = false;
    this.maxExplosions = 10;
    this.enemies = [];
    this.enemyGroup = undefined;
    this.enemyBullets = undefined;
    this.explosions = this.game.add.group();
  }

  // Sets the enemies target, i.e., the player
  setTarget(target) {
    this.player = target;
  }

  // Set the onHit handler
  setOnHit(func) {
    this.onHit = func;
  }

  // Returns the enemies associated with this factory
  getEnemies() {
    return {
      list: this.enemies,
      group: this.enemyGroup
    };
  }

  preload() {
    this.game.load.image('bullet', 'assets/images/bullet.png');
    this.game.load.image('baddie', 'assets/images/invader.png');
    this.game.load.spritesheet('kaboom', 'assets/images/explosion.png', 64, 64, 23);
  }

  create() {
    this.enemies = [];

    // Enemy bullet physics
    this.enemyBullets = this.game.add.group();
    this.enemyBullets.enableBody = true;
    this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyBullets.createMultiple(100, 'bullet');
    this.enemyBullets.setAll('anchor.x', 0.5);
    this.enemyBullets.setAll('anchor.y', 0.5);
    this.enemyBullets.setAll('outOfBoundsKill', true);
    this.enemyBullets.setAll('checkWorldBounds', true);

    // TODO: Enemy physics
    this.enemyGroup = this.game.add.group();

    // Prepare explosion pool
    for (var i = 0; i < this.maxExplosions; i++) {
      var explosionAnimation = this.explosions.create(0, 0, 'kaboom', [0], false);
      explosionAnimation.anchor.setTo(0.5, 0.5);
      explosionAnimation.animations.add('kaboom');
    }

    // TODO: Create enemies
    this.spawn = this.getSpawn(this.wave);
    for (var i = 0; i < this.spawn.number; i++) {
      // TODO: Consider this.spawn.damage, this.spawn.health
      var enemy = new Enemy(i, this.game, this.player, this.enemyBullets);
      this.enemies.push(enemy);
      this.enemyGroup.add(enemy.getSprite());
    }
  }

  update() {
    // Determine how many mobs are still alive and draw this as text
    this.enemiesAlive = 0;
    for (var i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].alive) {
        this.enemiesAlive++;
        this.game.physics.arcade.collide(this.player, this.enemies[i].baddie);
        this.game.physics.arcade.overlap(this.player.bullets, this.enemies[i].baddie, this.onHit, null, this);
        this.enemies[i].update();
      }
    }

    // If the wave has been completed
    if (this.enemiesAlive === 0) {
      this.waveComplete = true;
    }
  }

  render() {
    this.game.debug.text('Enemies remaining: ' + this.enemiesAlive + ' / ' + this.spawn.number, 32, 32);
  }

  // Calculate spawn characteristics given a wave number
  getSpawn(wave) {
    var spawn = {
      number: 0,
      health: 1,
      damage: 1
    };

    spawn.number = wave;
    if (wave % 5 === 0) {
      spawn.number *= 1.2;
    }

    spawn.health = (wave / 4) + 1;

    spawn.damage = (wave / 3) + 1;

    return spawn;
  }
}
