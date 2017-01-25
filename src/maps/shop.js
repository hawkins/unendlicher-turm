var floor;
var walls;
var items;
var exitLayer;

export default {
  preload: game => {
    // Load tilemap
    game.load.tilemap('shop', 'assets/maps/shop.json', null, Phaser.Tilemap.TILED_JSON);

    // Load tiles image
    game.load.image('tiles', 'assets/images/tiles.png');
  },
  create: game => {
    // Create the map
    var map = game.add.tilemap('shop');
    map.addTilesetImage('DungeonCrawl_ProjectUtumnoTileset', 'tiles');

    // Create layers
    floor = map.createLayer('Floor');
    walls = map.createLayer('Walls');
    items = map.createLayer('Items');
    exitLayer = map.createLayer('ExitLayer');

    // Resize game world to match the floor
    layer.resizeWorld();

    // Collide with player
    map.setCollisionBetween(1, 10000, true, walls);

    // Enter town when player collides with exit layer
    map.setTileLocationCallback(1, 14, 1, 2, () => (game.state.start('town')), this, exitLayer);
  },
  update: (game, collidables) => {
    collidables.forEach(item => {
      // Collide with item
      game.physics.arcade.collide(item, walls);
      game.physics.arcade.collide(item, items);
      game.physics.arcade.collide(item, exitLayer);
    });
  }
};