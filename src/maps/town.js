// Create Variables for Layers
var layer;
var layer2;
var layer3;
var layer4;

export default {
  preload: game => {
    // Load tilemap
    game.load.tilemap('town', 'assets/maps/town.json', null, Phaser.Tilemap.TILED_JSON);

    // Load tiles image
    game.load.image('tiles', 'assets/images/tiles.png');
  },
  create: game => {
    // Create the map
    var map = game.add.tilemap('town');
    map.addTilesetImage('Dungeon PNG', 'tiles');

    // Create layers
    layer = map.createLayer('Floor');
    layer2 = map.createLayer('Walls');
    layer3 = map.createLayer('TowerSubParameter');
    layer4 = map.createLayer('TowerSmoothingParameter');

    // Resize game world to match the floor
    layer.resizeWorld();

    // Collide with player
    map.setCollisionBetween(1, 10000, true, layer2);
    map.setCollisionBetween(1, 10000, true, layer3);
    map.setCollisionBetween(1, 10000, true, layer4);
  },
  update: (game, collidables) => {
    collidables.forEach(item => {
      // Collide with item
      game.physics.arcade.collide(item, layer2);
      game.physics.arcade.collide(item, layer3);
      game.physics.arcade.collide(item, layer4);
    });
  }
};