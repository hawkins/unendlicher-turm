import Knight from './enemies/knight';
import Wizard from './enemies/wizard';
import Archer from './enemies/archer';
import Guardian from './enemies/guardian';

export default class EnemyFactory {
  constructor(game, wave) {
    this.game = game;
    this.wave = wave;

    this.player = undefined;
    this.waveComplete = false;
    this.maxExplosions = 10;
    this.enemies = [];
    this.enemyGroup = undefined;
    this.enemySpells = undefined;
    this.enemyArrows = undefined;
    this.explosions = undefined;
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
    return { list: this.enemies, group: this.enemyGroup };
  }

  preload() {
    this.game.load.image('spell', 'assets/images/bullet_2.png');
    this.game.load.image('arrow', 'assets/images/bullet_3.png');
    this.game.load.image('Knight', 'assets/images/Knight.png');
    this.game.load.image('Wizard', 'assets/images/Wizard.png');
    this.game.load.image('Archer', 'assets/images/Archer.png');
    this.game.load.spritesheet('Guardian', 'assets/images/Guardian.png', 104, 98);
    this.game.load.spritesheet('kaboom', 'assets/images/explosion.png', 64, 64, 23);
  }

  create() {
    this.enemies = [];

    // Enemy spell physics
    this.enemySpells = this.game.add.group();
    this.enemySpells.enableBody = true;
    this.enemySpells.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemySpells.createMultiple(100, 'spell');
    this.enemySpells.setAll('anchor.x', 0.5);
    this.enemySpells.setAll('anchor.y', 0.5);
    this.enemySpells.setAll('outOfBoundsKill', true);
    this.enemySpells.setAll('checkWorldBounds', true);

    // Enemy arrow physics
    this.enemyArrows = this.game.add.group();
    this.enemyArrows.enableBody = true;
    this.enemyArrows.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyArrows.createMultiple(100, 'arrow');
    this.enemyArrows.setAll('anchor.x', 0.5);
    this.enemyArrows.setAll('anchor.y', 0.5);
    this.enemyArrows.setAll('outOfBoundsKill', true);
    this.enemyArrows.setAll('checkWorldBounds', true);

    // TODO: Enemy physics
    this.enemyGroup = this.game.add.group();

    this.explosions = this.game.add.group();
    // Prepare explosion pool
    for (var i = 0; i < this.maxExplosions; i++) {
      var explosionAnimation = this.explosions.create(0, 0, 'kaboom', [ 0 ], false);
      explosionAnimation.anchor.setTo(0.5, 0.5);
      explosionAnimation.animations.add('kaboom');
    }

    // Create enemies
    this.spawn = this.getSpawn(this.wave);
    // Knights
    for (var i = 0; i < this.spawn.knight.number; i++) {
      var enemy = new Knight(i, this.game, this.player, this.spawn.knight.health, this.spawn.knight.damage);
      this.enemies.push(enemy);
      this.enemyGroup.add(enemy.getSprite());
    }
    // Wizards
    for (var i = 0; i < this.spawn.wizard.number; i++) {
      var enemy = new Wizard(i, this.game, this.player, this.enemySpells, this.spawn.wizard.health, this.spawn.wizard.damage);
      this.enemies.push(enemy);
      this.enemyGroup.add(enemy.getSprite());
    }
    // Archers
    for (var i = 0; i < this.spawn.archer.number; i++) {
      var enemy = new Archer(i, this.game, this.player, this.enemyArrows, this.spawn.archer.health, this.spawn.archer.damage);
      this.enemies.push(enemy);
      this.enemyGroup.add(enemy.getSprite());
    }
    // Guardian
    for (var i = 0; i < this.spawn.guardian.number; i++) {
      var enemy = new Guardian(i, this.game, this.player, this.spawn.guardian.health, this.spawn.guardian.damage);
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

    // Make enemies collide with eachother
    this.game.physics.arcade.collide(this.enemyGroup, this.enemyGroup);

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
      knight: { number: 0, health: 1, damage: 1 },
      wizard: { number: 0, health: 1, damage: 1 },
      archer: { number: 0, health: 1, damage: 1 },
      guardian: { number: 0, health: 1, damage: 1 }
    };

    spawn.knight.number = wave;
    if (wave % 5 === 0) {
      spawn.knight.number *= 1.5;
    }

    // Wizards show up after 5 waves
    if (wave > 5) {
      spawn.wizard.number = wave - 5;
    }
    if (wave % 3 === 0) {
      spawn.wizard.number *= 1.5;
    }

    // Archers show up after 10 waves
    if (wave > 10) {
      spawn.archer.number = wave - 8;
    }
    if (wave % 4 === 0) {
      spawn.archer.number *= 1.5;
    }

    // Guardian shows up at wave 20
    if (wave >= 20) {
      spawn.guardian.number = 1;
      spawn.guardian.health = 10 * spawn.knight.health;
      spawn.guardian.damage = 100;
    }

    spawn.knight.number = Math.round(spawn.knight.number);
    spawn.wizard.number = Math.round(spawn.wizard.number);
    spawn.archer.number = Math.round(spawn.archer.number);
    spawn.number = spawn.knight.number + spawn.wizard.number + spawn.archer.number + spawn.guardian.number;

    spawn.knight.health = wave / 4 + 1;
    spawn.wizard.health = wave / 7 + 1;
    spawn.archer.health = wave / 12 + 1;

    spawn.knight.damage = wave / 5 + 1;
    spawn.wizard.damage = wave / 3;
    spawn.archer.damage = wave / 2;

    return spawn;
  }
}
