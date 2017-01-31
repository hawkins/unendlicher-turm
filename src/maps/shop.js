import store from '../store';

// Controls
var spacebar;

// Create Variables for Tiled Layers
var floor;
var walls;
var doors;
var shelfItems;
var items;
var portals;

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
    shelfItems = map.createLayer('ShelfItems');
    items = map.createLayer('Items');
    doors = map.createLayer('Doors');

    spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // Resize game world to match the floor
    floor.resizeWorld();

    // Collide with player
    map.setCollisionBetween(1, 10000, true, walls);
    map.setCollisionBetween(1, 10000, true, items);
    map.setCollisionBetween(1, 10000, true, shelfItems);
    map.setCollisionBetween(1, 10000, true, doors);

    // Enter town when player collides with exit layer
    map.setTileLocationCallback(
      0,
      7,
      1,
      1,
      () => {
        store.nextState = 'town';
        game.state.start('town');
      },
      this,
      doors
    );

    // Enter arena when player collides with exit layer
    map.setTileLocationCallback(
      27,
      7,
      1,
      1,
      () => {
        store.nextState = 'arena';
        game.state.start('arena');
      },
      this,
      doors
    );
  },
  update: (game, collidables) => {
    collidables.forEach(item => {
      // Collide with item
      game.physics.arcade.collide(item, walls);
      game.physics.arcade.collide(item, items);
      game.physics.arcade.collide(item, shelfItems);
      game.physics.arcade.collide(item, doors);
    });
  }
};
