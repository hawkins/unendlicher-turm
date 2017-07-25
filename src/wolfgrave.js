export default class Wolfgrave {
  constructor(game) {
    this.game = game;

    this.spawn = { x: 208, y: 432 };
    this.quoteTime = this.game.time.now + 4000;
  }

  preload() {
    this.game.load.image('wolfgrave', 'assets/images/wolfgrave.png');
    this.game.load.image('wolfgrave-quote1', 'assets/images/wolfgrave-quote1.png');
  }

  create() {
    // Create NPC
    this.npc = this.game.add.sprite(this.spawn.x, this.spawn.y, 'wolfgrave');
    this.game.physics.arcade.enable(this.npc);
    this.npc.body.immovable = true;
    this.npc.body.moves = false;
    this.npc.anchor.set(0.5);
  }

  update(player) {
    // Look at player
    this.npc.rotation = this.game.math.angleBetween(this.npc.x, this.npc.y, player.x, player.y);

    // Collide with player
    this.game.physics.arcade.collide(player, this.npc, null);

    // Toggle quote
    if (this.game.time.now > this.quoteTime) {
      if (this.quote && this.quote.alive) {
        this.destroyQuote();
        this.quoteTime = this.game.time.now + 20000;
      } else if (!this.quote || !this.quote.alive) {
        this.createQuote();
        this.quoteTime = this.game.time.now + 4000;
      }
    }
  }

  createQuote() {
    // Create quote
    this.quote = this.game.add.sprite(this.spawn.x, this.spawn.y, 'wolfgrave-quote1');
    this.quote.anchor.set(0.3, 1);
    this.quote.scale.set(0.5, 0.5);
  }

  destroyQuote() {
    this.quote.kill();
  }
}
