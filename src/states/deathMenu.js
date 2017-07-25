// Require the CSS for Webpack
import css from '../index.css';
import deathMenu from '../maps/deathMenu';
import Fullscreen from '../fullscreen';
import store from '../store';

// Controls
var cKey;
var eKey;

// Controllers
var fullscreenController;

// NPCs
var wizard;
var archer;
var TJ;

function preload() {
  // Load title image file
  this.game.load.image('deathNote', 'assets/images/youDiedFool.png');

  // Load start game image file
  this.game.load.image('continue', 'assets/images/dieAgain.png');

  // Load "How to Play" game image file
  this.game.load.image('end', 'assets/images/endSuffering.png');

  // Load Wizard Player image file
  this.game.load.image('wizard', 'assets/images/Wizard.png');

  // Load Archer Player image file
  this.game.load.image('archer', 'assets/images/Archer.png');

  // Load TJ Player image file
  this.game.load.image('TJ', 'assets/images/TJ_topdown.png');

  // Load audio file
  this.game.load.audio('pacmanDeath', ['assets/audio/SoundEffects/pacmanDeath.ogg']);

  deathMenu.preload(this.game);
}

function create() {
  // Create the map(s)
  deathMenu.create(this.game);

  // Create Title Sprite
  this.game.add.sprite(440, 290, 'deathNote');

  // Create Continue Game Sprite
  this.game.add.sprite(245, 125, 'continue');

  // Create End Game Sprite
  this.game.add.sprite(550, 125, 'end');

  // Create Wizard Player image file & rotate
  wizard = this.game.add.sprite(350, 195, 'wizard');
  wizard.anchor.setTo(0.5, 0.5);
  wizard.angle = 120;

  // Create Archer Player image file & rotate
  archer = this.game.add.sprite(580, 195, 'archer');
  archer.anchor.setTo(0.5, 0.5);
  archer.angle = 60;

  // Create TJ Player image file & rotate
  TJ = this.game.add.sprite(463, 350, 'TJ');
  TJ.anchor.setTo(0.5, 0.5);
  TJ.angle = 60;

  // Create keys
  cKey = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
  eKey = this.game.input.keyboard.addKey(Phaser.Keyboard.E);

  // Create Audio for town
  store.backgroundMusic = this.game.add.audio('pacmanDeath');

  // Setting volume and loop
  store.backgroundMusic.play('', 1, 0.3, false);

  // Enable fullscreen
  fullscreenController = new Fullscreen(this.game, 'F');
}

function update() {
  // If C Key Pressed goto Town
  if (cKey.isDown) {
    store.health = store.maxHealth;
    this.game.state.start('town');
  }
  // If E Key Pressed Show Modal
  if (eKey.isDown) {
    store.health = store.maxHealth;
    this.game.state.start('mainMenu');
  }
}

function shutdown() {
  this.game.sound.stopAll();
}

export default { preload, create, update, shutdown };
