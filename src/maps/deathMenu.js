// Create Variables for Layers
var floor;
var items;
var walls;

export default {
  preload: game => {
    // Load tilemap
    game.load.tilemap('deathMenu', 'assets/maps/deathMenu.json', null, Phaser.Tilemap.TILED_JSON);

    // Load tiles image
    game.load.image('tiles', 'assets/images/tiles.png');
  },
  create: game => {
    // Create the map
    var map = game.add.tilemap('deathMenu');
    map.addTilesetImage('DungeonCrawl_ProjectUtumnoTileset', 'tiles');

    // Create layers
    floor = map.createLayer('Floor');
    items = map.createLayer('Items');
    walls = map.createLayer('Wall');

    // Collide with player
    map.setCollisionBetween(1, 10000, true, items);
    map.setCollisionBetween(1, 10000, true, walls);

    // Resize game world to match the floor
    floor.resizeWorld();
  },
  update: (game, collidables) => {
    collidables.forEach(item => {
      // Collide with item
      game.physics.arcade.collide(item, floor);
      game.physics.arcade.collide(item, items);
      game.physics.arcade.collide(item, walls);
    });
  }
};
