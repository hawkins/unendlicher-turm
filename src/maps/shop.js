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

// Create Variables for Object Layers
var healthPortal;
var strengthPortal;
var speedPortal;

// Create Variables for Portal Tile Position
var healthStone;
var strengthStone;
var speedStone;

// Create Variable for Object Layer
var height;
var name;
var properties;
var rectangle;
var rotation;
var type;
var visible;
var width;
var x;
var y;

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

    // Create object layer
    healthPortal = map.objects.Portals[0];

    // Assign Portal Position
    healthStone = new Phaser.Rectangle(healthPortal.x, healthPortal.y, healthPortal.width, healthPortal.height);

    // Collide with player
    map.setCollisionBetween(1, 10000, true, walls);
    map.setCollisionBetween(1, 10000, true, items);
    map.setCollisionBetween(1, 10000, true, shelfItems);
    map.setCollisionBetween(1, 10000, true, doors);

    // Enter town when player collides with exit layer
    map.setTileLocationCallback(0, 7, 1, 1, () => game.state.start('town'), this, doors);

    // Enter arena when player collides with exit layer
    map.setTileLocationCallback(27, 7, 1, 1, () => game.state.start('arena'), this, doors);
    // Purchase health powerups with player collides with exit layer
    // map.setTileLocationCallback(
    //   10,
    //   1,
    //   1,
    //   1,
    //   () => {
    //     if (spacebar.isDown) {
    //       console.log(store.maxHealth);
    //       powerUps.healthzone();
    //       console.log(store.maxHealth);
    //     }
    //   },
    //   this,
    //   doors
    // );
  },
  update: (game, collidables) => {
    collidables.forEach(item => {
      // Collide with item
      game.physics.arcade.collide(item, walls);
      game.physics.arcade.collide(item, items);
      game.physics.arcade.collide(item, shelfItems);
      game.physics.arcade.collide(item, doors);
    });
  },
  healthzone: game => {
    // Assign Portal Position
    healthStone = new Phaser.Rectangle(healthPortal.x, healthPortal.y, healthPortal.width, healthPortal.height);
  }
};
