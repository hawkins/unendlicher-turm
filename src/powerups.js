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
      store.purchaseSound = true;
      store.coins = store.coins - store.healthCost;
      store.maxHealth += 10;
      store.healthCost++;
      store.health = store.maxHealth;
      store.dirtyHealth = true;
    } else {
      store.purchaseSound = false;
      console.log("You're out of money!");
    }
  }

  damageZone() {
    if (store.coins >= store.damageCost) {
      store.purchaseSound = true;
      store.coins = store.coins - store.damageCost;
      store.damageCost++;
      store.damage++;
      if (store.fireRate > 75) {
        store.fireRate -= 15;
      } else {
        store.purchaseSound = false;
        console.log("You're writing checks your body can't cash!");
      }
    } else {
      store.purchaseSound = false;
      console.log("You're out of money!");
    }
  }

  speedZone() {
    if (store.speed <= 400) {
      if (store.coins >= store.speedCost) {
        store.purchaseSound = true;
        store.coins = store.coins - store.speedCost;
        store.speedCost++;
        store.speed += 10;
      } else {
        store.purchaseSound = false;
        console.log("You're out of money!");
      }
    } else {
      store.purchaseSound = false;
      console.log("You're not the Flash so chill!");
    }
  }
}
