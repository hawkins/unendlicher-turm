export default class Fullscreen {
  constructor(game, key) {
    this.game = game;

    // Configure fullscreen
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    // Add key listener
    var fullscreenKey = this.game.input.keyboard.addKey(Phaser.Keyboard[key]);
    fullscreenKey.onDown.add(() => (this.toggle()));
  }

  // This function toggles the fullscreen status
  toggle() {
    if (this.game.scale.isFullScreen) {
      this.game.scale.stopFullScreen();
    } else {
      this.game.scale.startFullScreen(false);
    }
  }
}
