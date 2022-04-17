import SceneKeys from "../../game/utils/SceneKeys";
import TFBaseScene from "../TFBaseScene";

export default class UIElementsScene extends TFBaseScene {
  soundButtonSprite!: Phaser.GameObjects.Image;

  constructor() {
    super(SceneKeys.UIElements);
  }

  create() {
    this.soundButtonSprite = this.add.image(100, 100, "sound").setInteractive();
    this.soundButtonSprite.scale = 0.2;

    this.soundButtonSprite.on("pointerdown", this.enableOrDisableSound, this);
  }

  enableOrDisableSound() {
    if (this.getPlayerData().settings.soundEnabled) {
      this.getPlayerData().settings.soundEnabled = false;
      this.soundButtonSprite.setTexture("no-sound");
      this.game.sound.mute = true;
    } else {
      this.getPlayerData().settings.soundEnabled = true;
      this.soundButtonSprite.setTexture("sound");
      this.game.sound.mute = false;
    }
  }
}
