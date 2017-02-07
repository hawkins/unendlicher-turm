import store from './store';
import HealthBar from './healthbar';

export default class GUI {
  constructor(game) {
    this.game = game;
    this.healthbar = undefined;
  }

  create() {
    // Create health bar
    this.healthbar = new HealthBar(this.game, { x: this.game.width / 2, y: this.game.height - 16 });
    this.healthbar.setPercent(store.health / store.maxHealth * 100);
    this.healthbar.setFixedToCamera(true);
  }

  update() {
    // Update health bar
    if (store.dirtyHealth) {
      store.dirtyHealth = false;
      this.healthbar.setPercent(store.health / store.maxHealth * 100);
    }
  }

  render() {
    // TODO: Improve this by not using debug text
    this.game.debug.text(`Health: ${store.health.toFixed(2)}/${store.maxHealth}`, this.game.width / 2 - 80, this.game.height - 16);
    this.game.debug.text(`Floor: ${store.wave}`, 32, this.game.height - 16);
    this.game.debug.text(`Coins: ${store.coins}`, 160, this.game.height - 16);
    this.game.debug.text(`Damage: ${store.damage}`, this.game.width - 128, this.game.height - 16);
    this.game.debug.text(`Speed: ${store.speed}`, this.game.width - 256, this.game.height - 16);
  }
}
