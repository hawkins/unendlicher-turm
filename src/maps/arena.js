import store from '../store';

var state = {};

var layer;
var layer2;
var entranceLayer;
var exitLayer;

// Coins Distribution
var coinMax = 4;
var coinMin = 1;

export default {
  unlocked: false,
  preload: game => {
    // Load tilemap
    game.load.tilemap('arena', 'assets/maps/arena.json', null, Phaser.Tilemap.TILED_JSON);

    // Load tiles image
    game.load.image('tiles', 'assets/images/tiles.png');
  },
  create: game => {
    // In case this is not our first map, reset the map
    state.unlocked = false;

    // Create the map
    var map = game.add.tilemap('arena');
    map.addTilesetImage('DungeonCrawl_ProjectUtumnoTileset', 'tiles');

    // Create layers
    layer = map.createLayer('Floor');
    layer2 = map.createLayer('Walls');
    entranceLayer = map.createLayer('EntranceLayer');
    exitLayer = map.createLayer('ExitLayer');

    // Resize game world to match the floor
    layer.resizeWorld();

    // Collide with player
    map.setCollisionBetween(1, 10000, true, layer2);

    // Enter town when player collides with exit layer
    map.setTileLocationCallback(
      1,
      14,
      1,
      2,
      () => {
        if (state.unlocked) {
          store.wave++;
          store.coins = store.coins + (Math.floor(Math.random() * (coinMax - coinMin)) + coinMin);
          store.nextState = 'town';
          game.state.start('town');
        }
      },
      state,
      exitLayer
    );

    // Enter next arena when player collides with entrance layer and is unlocked
    map.setTileLocationCallback(
      28,
      14,
      1,
      2,
      () => {
        if (state.unlocked) {
          store.wave++;
          store.coins = store.coins + (Math.floor(Math.random() * (coinMax - coinMin)) + coinMin);
          store.nextState = 'arena';
          game.state.start('arena');
        }
      },
      state,
      entranceLayer
    );
  },
  update: (game, collidables) => {
    collidables.forEach(item => {
      // Collide with item
      game.physics.arcade.collide(item, layer2);
      game.physics.arcade.collide(item, exitLayer);
      game.physics.arcade.collide(item, entranceLayer);
    });
  },
  // This function allows
  unlock: () => {
    state.unlocked = true;
  }
};
