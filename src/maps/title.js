// Create Variables for Layers
var floor;
var towerSiding;
var tower;
var walls;
var bubble;

export default {
  preload: game => {
    // Load tilemap
    game.load.tilemap('title', 'assets/maps/title.json', null, Phaser.Tilemap.TILED_JSON);

    // Load tiles image
    game.load.image('tiles', 'assets/images/tiles.png');
  },
  create: game => {
    // Create the map
    var map = game.add.tilemap('title');
    map.addTilesetImage('DungeonCrawl_ProjectUtumnoTileset', 'tiles');

    // Create layers
    floor = map.createLayer('Floor');
    towerSiding = map.createLayer('TowerSiding');
    tower = map.createLayer('Tower');
    walls = map.createLayer('Walls');
    bubble = map.createLayer('bubble');

    // Collide with player
    map.setCollisionBetween(1, 10000, true, towerSiding);
    map.setCollisionBetween(1, 10000, true, tower);
    map.setCollisionBetween(1, 10000, true, walls);
    map.setCollisionBetween(1, 10000, true, bubble);

    // Resize game world to match the floor
    floor.resizeWorld();
  },
  update: (game, collidables) => {
    collidables.forEach(item => {
      // Collide with item
      game.physics.arcade.collide(item, floor);
      game.physics.arcade.collide(item, towerSiding);
      game.physics.arcade.collide(item, tower);
      game.physics.arcade.collide(item, walls);
      game.physics.arcade.collide(item, bubble);
    });
  }
};
