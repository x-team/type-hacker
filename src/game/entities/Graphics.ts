import Phaser from 'phaser';

export default class Graphics extends Phaser.GameObjects.Graphics {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, { x, y });
    scene.add.existing(this);
  }
}
