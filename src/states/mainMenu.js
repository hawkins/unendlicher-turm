// Require the CSS for Webpack
import css from '../index.css';
import mainMenu from '../maps/mainMenu';
import Fullscreen from '../fullscreen';
import store from '../store';

// Controls
var enter;
var hKey;
var sKey;

// Controllers
var fullscreenController;

// NPCs
var wizard;
var archer;
var TJ;

// Modals
var htpModal;
var storyModal;

var reg = {};

function preload() {
  // Load title image file
  this.game.load.image('Title', 'assets/images/title.png');

  // Load start game image file
  this.game.load.image('startGame', 'assets/images/startGame.png');

  // Load "How to Play" game image file
  this.game.load.image('htpGame', 'assets/images/htpGame.png');

  // Load Story game image file
  this.game.load.image('storyGame', 'assets/images/storyGame.png');

  // Load Wizard Player image file
  this.game.load.image('wizard', 'assets/images/Wizard.png');

  // Load Archer Player image file
  this.game.load.image('archer', 'assets/images/Archer.png');

  // Load Knight Player image file
  this.game.load.image('TJ', 'assets/images/TJ_topdown.png');

  // Load audio file
  this.game.load.audio('mainBackground', [ 'assets/audio/SoundEffects/adventure.ogg' ]);

  mainMenu.preload(this.game);
}

function create() {
  // Create the map(s)
  mainMenu.create(this.game);

  // Create Title Sprite
  this.game.add.sprite(30, 40, 'Title');

  // Create Start Game Sprite
  this.game.add.sprite(660, 335, 'startGame');

  // Create "How to Play" Game Sprite
  this.game.add.sprite(570, 35, 'htpGame');

  // Create Story Game Sprite
  this.game.add.sprite(565, 180, 'storyGame');

  // Create Wizard Player image file & rotate
  wizard = this.game.add.sprite(720, 430, 'wizard');
  wizard.anchor.setTo(0.5, 0.5);
  wizard.angle = 60;

  // Create Archer Player image file & rotate
  archer = this.game.add.sprite(760, 275, 'archer');
  archer.anchor.setTo(0.5, 0.5);
  archer.angle = 120;

  // Create TJ Player image file & rotate
  TJ = this.game.add.sprite(775, 130, 'TJ');
  TJ.anchor.setTo(0.5, 0.5);
  TJ.angle = 120;

  // Create keys
  enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  hKey = this.game.input.keyboard.addKey(Phaser.Keyboard.H);
  sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

  // Initiate the modal class
  reg.modal = new gameModal(this.game);
  createModals();

  // Create Audio for town
  store.backgroundMusic = this.game.add.audio('mainBackground');

  // Setting volume and loop
  store.backgroundMusic.play('', 1, 0.3, true);

  // Enable fullscreen
  fullscreenController = new Fullscreen(this.game, 'F');
}

function update() {
  // If Enter Pressed Start Game
  if (enter.isDown) {
    this.game.state.start('town');
  }
  // If H Key Pressed Show Modal
  if (hKey.isDown) {
    showHTPModal();
  }
  // If S Key Pressed Show Modal
  if (sKey.isDown) {
    showStoryModal();
  }
}

function createModals() {
  // How to Play Modal
  reg.modal.createModal({
    type: 'htp1',
    includeBackground: true,
    modalCloseOnInput: true,
    backgroundOpacity: 0.9,
    itemsArr: [
      {
        type: 'text',
        align: 'center',
        content: `
How to Play\n
Welcome to Unendlicher Turm!\n
Basic Actions
Use the W, A, S, D (or arrow) keys to move your player around the map.
Press the F key to toggle Fullscreen.\n
Arena Actions
Use the space bar or left-click the mouse to fire.\nUsing the mouse will increase your accuracy.\n
Shop Actions
Purchase health, damage, or speed by standing on it's respective rune and pressing the Enter key.`,
        fontFamily: 'Luckiest Guy',
        fontSize: 18,
        color: '0xFFFFFF',
        offsetY: -25
      }
    ]
  });

  // Story Modals
  // Story One (Our Story)
  reg.modal.createModal({
    type: 'story',
    includeBackground: true,
    modalCloseOnInput: true,
    backgroundOpacity: 0.9,
    itemsArr: [
      {
        type: 'text',
        content: `
Our Story\n
Many travelers are drawn to the City of Zherith.
Some have come to worship the tower and believe that it has the power to heal.
The people of the lands surrounding the tower have declared it sacred and it is
a crime punishable by death to desecrate it. When Wolfgrave and his trusty partner
Urgnot first arrived in town, he began asking people about the tower. The locals
spoke of warriors that come to conquer the tower, but while many have entered,
none have ever returned.\n
Click here to continue story`,
        fontFamily: 'Luckiest Guy',
        fontSize: 20,
        color: '0xFFFFFF',
        offsetY: -50,
        callback: function() {
          reg.modal.hideModal('story');
          showStory2Modal();
        }
      }
    ]
  });

  // Story Two (History of the Tower)
  reg.modal.createModal({
    type: 'story2',
    includeBackground: true,
    modalCloseOnInput: true,
    backgroundOpacity: 0.9,
    itemsArr: [
      {
        type: 'text',
        content: `
History of the Tower\n
Centuries ago there was a great war between the Elders of Magic that brought great
darkness and despair for nearly 200 years. As the Elders of Magic fought for power
over the lands, many died and entire civilizations were destroyed. In an effort to
save what was left, a small group of Elders decided to enchant an amulet to absorb
the power of the warring Elders. They believed that magic should be used for the
benefit of all mankind, so they created the endless tower and placed the guardians
to protect the amulet. Anyone who wished to harness this power could enter and face
the trials to prove themselves worthy. This ended the 200 year long war and peace
began to be return to the lands.\n
Click here to continue story`,
        fontFamily: 'Luckiest Guy',
        fontSize: 20,
        color: '0xFFFFFF',
        offsetY: -50,
        callback: function() {
          reg.modal.hideModal('story2');
          showStory3Modal();
        }
      }
    ]
  });

  // Story Three (The Guardians of the Tower)
  reg.modal.createModal({
    type: 'story3',
    includeBackground: true,
    modalCloseOnInput: true,
    backgroundOpacity: 0.9,
    itemsArr: [
      {
        type: 'text',
        content: `
The Guardians of the Tower\n
Many guardians exist inside the tower. Legend states that the beasts grow
stronger each floor of the tower, but no one dares speak of the prophecy
of the Unendlicher Turm. The prophecy states an amulet was hidden amongst
the souls of the guardians, and that there is no real way to release it.
This frightens the magicians of the modern era, because the prophecy
continues to say that the secret magic will instead be discovered in the one
who can best the Final Guardian, Hurk. Thus the ancient magic has already
been granted to a chosen one - but are you that chosen one?\n
Click to close story`,
        fontFamily: 'Luckiest Guy',
        fontSize: 20,
        color: '0xFFFFFF',
        offsetY: -50
      }
    ]
  });
}

function showHTPModal() {
  reg.modal.showModal('htp1');
}

// Story Functions
function showStoryModal() {
  reg.modal.showModal('story');
}

function showStory2Modal() {
  reg.modal.showModal('story2');
}

function showStory3Modal() {
  reg.modal.showModal('story3');
}

export default { preload, create, update, createModals, showHTPModal, showStoryModal, showStory2Modal, showStory3Modal };
