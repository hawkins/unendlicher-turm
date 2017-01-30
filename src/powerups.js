import store from './store';

export default class powerUps {
  constructor(index, game, player, maxHealth, health, damage, speed, coins, healthCost, speedCost, damageCost) {
    this.game = game;
    this.player = player;

    // Attributes
    this.maxHealth = maxHealth;
    this.damage = damage;
    this.speed = speed;

    // Sub-Attributes
    this.health = health;

    // $$$$$
    this.coins = coins;
    this.healthCost = healthCost;
    this.speedCost = speedCost;
    this.damageCost = damageCost;
  }

  healthZone() {
    if (store.coins >= store.healthCost) {
      store.coins = store.coins - store.healthCost;
      store.maxHealth += 5;
      store.health = store.maxHealth;
    } else {
      console.log("You're out of money!");
    }
  }

  damageZone() {
    if (store.coins >= store.damageCost) {
      store.coins = store.coins - store.damageCost;
      store.damage += 2;
    } else {
      console.log("You're out of money!");
    }
  }

  speedZone() {
    if (store.coins >= store.speedCost) {
      store.coins = store.coins - store.speedCost;
      store.speed += 10;
    } else {
      console.log("You're out of money!");
    }
  }
}
