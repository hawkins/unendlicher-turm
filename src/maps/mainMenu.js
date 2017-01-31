// Create Variables for Layers
var floor;
var towerSiding;
var tower;
var walls;

export default {
  preload: game => {
    // Load tilemap
    game.load.tilemap('mainMenu', 'assets/maps/mainMenu.json', null, Phaser.Tilemap.TILED_JSON);

    // Load tiles image
    game.load.image('tiles', 'assets/images/tiles.png');
  },
  create: game => {
    // Create the map
    var map = game.add.tilemap('mainMenu');
    map.addTilesetImage('DungeonCrawl_ProjectUtumnoTileset', 'tiles');

    // Create layers
    floor = map.createLayer('Floor');
    tower = map.createLayer('Tower');
    towerSiding = map.createLayer('TowerSiding');
    walls = map.createLayer('Walls');

    // Collide with player
    map.setCollisionBetween(1, 10000, true, towerSiding);
    map.setCollisionBetween(1, 10000, true, tower);
    map.setCollisionBetween(1, 10000, true, walls);

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
    });
  }
};
