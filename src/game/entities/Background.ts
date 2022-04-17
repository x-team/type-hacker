import Phaser from "phaser";

interface BGSettings {
  isGif: boolean;
}

class Background extends Phaser.GameObjects.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    settings: BGSettings
  ) {
    super(scene, x, y, texture, 0);
    scene.add.existing(this);

    if (settings.isGif) {
      this.anims.play(`${texture}-gif`);
    }

    this.setOrigin(0, 0);
  }
}

export default Background;
