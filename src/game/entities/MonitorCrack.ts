import TFBaseScene from '../../scenes/TFBaseScene';
import { TMonitorsNames } from '../utils/types';

export class MonitorCrack extends Phaser.GameObjects.Container {
  public cracks: Phaser.GameObjects.Image[];
  static OPACITY = 0.85;
  static BLEND_MODE = Phaser.BlendModes.MULTIPLY;

  constructor(scene: TFBaseScene, x: number, y: number, monitorToCrack: TMonitorsNames) {
    super(scene, x, y);
    this.cracks = MonitorCrack.getRandomCrack(scene, monitorToCrack);

    this.cracks.forEach((crack) => this.add(crack).setDepth(0));

    scene.add.existing(this);
  }

  static getRandomCrack(scene: TFBaseScene, monitorToCrack: TMonitorsNames) {
    const crackOption = Phaser.Math.Between(1, 3);
    switch (crackOption) {
      case 1:
        return MonitorCrack.firstCrackCombination(scene, monitorToCrack);
      case 2:
        return MonitorCrack.secondCrackCombination(scene, monitorToCrack);
      case 3:
        return MonitorCrack.thirdCrackCombination(scene, monitorToCrack);
      default:
        return MonitorCrack.firstCrackCombination(scene, monitorToCrack);
    }
  }

  static firstCrackCombination(scene: TFBaseScene, monitorToCrack: TMonitorsNames) {
    const leftCrackOne = scene.add
      .image(0, 0, 'broken-screen-1')
      .setRotation(38.57)
      .setBlendMode(MonitorCrack.BLEND_MODE)
      .setAlpha(MonitorCrack.OPACITY);
    const rightCrackOne = scene.add
      .image(0, 0, 'broken-screen-1')
      .setBlendMode(MonitorCrack.BLEND_MODE)
      .setAlpha(MonitorCrack.OPACITY);
    const rightCrackTwo = scene.add
      .image(0, 0, 'broken-screen-2')
      .setBlendMode(MonitorCrack.BLEND_MODE)
      .setAlpha(MonitorCrack.OPACITY);

    switch (monitorToCrack) {
      // 🖥️ Left Monitor
      case 'left':
        const leftCoord = scene.getPlayerData().data.monitors.left.coordinates;
        leftCrackOne.setPosition(leftCoord.topLeft.x + 40, leftCoord.topLeft.y + 40);
        rightCrackOne.setPosition(
          leftCoord.topRight.x - 45,
          (leftCoord.topRight.y + leftCoord.bottomRight.y) / 2 + 15
        );
        rightCrackTwo.setPosition(leftCoord.topRight.x - 40, leftCoord.bottomRight.y - 45);
        break;
      // 🖥️ Center Monitor
      case 'center':
        const centerCoord = scene.getPlayerData().data.monitors.center.coordinates;
        leftCrackOne.setPosition(centerCoord.topLeft.x + 50, centerCoord.topLeft.y + 45);
        rightCrackOne.setPosition(
          centerCoord.topRight.x - 50,
          (centerCoord.topRight.y + centerCoord.bottomRight.y) / 2
        );
        rightCrackTwo.setPosition(centerCoord.topRight.x - 45, centerCoord.bottomRight.y - 60);
        break;
      // 🖥️ Right Monitor
      case 'right':
        const rightCoord = scene.getPlayerData().data.monitors.right.coordinates;
        leftCrackOne.setPosition(rightCoord.topLeft.x + 50, rightCoord.topLeft.y + 50);
        rightCrackOne.setPosition(
          rightCoord.topRight.x - 50,
          (rightCoord.topRight.y + rightCoord.bottomRight.y) / 2
        );
        rightCrackTwo.setPosition(rightCoord.topRight.x - 45, rightCoord.bottomRight.y - 60);
        break;
      default:
        break;
    }
    return [leftCrackOne, rightCrackOne, rightCrackTwo];
  }

  static secondCrackCombination(scene: TFBaseScene, monitorToCrack: TMonitorsNames) {
    const leftCrackOne = scene.add
      .image(0, 0, 'broken-screen-1')
      .setRotation(7.33)
      .setBlendMode(MonitorCrack.BLEND_MODE)
      .setAlpha(MonitorCrack.OPACITY);
    const rightCrackOne = scene.add
      .image(0, 0, 'broken-screen-2')
      .setBlendMode(MonitorCrack.BLEND_MODE)
      .setAlpha(MonitorCrack.OPACITY);
    const rightCrackTwo = scene.add
      .image(0, 0, 'broken-screen-3')
      .setRotation(0.52)
      .setBlendMode(MonitorCrack.BLEND_MODE)
      .setAlpha(MonitorCrack.OPACITY);

    switch (monitorToCrack) {
      // 🖥️ Left Monitor
      case 'left':
        const leftCoord = scene.getPlayerData().data.monitors.left.coordinates;
        leftCrackOne.setPosition(leftCoord.bottomLeft.x + 55, leftCoord.bottomLeft.y - 32);
        rightCrackOne.setPosition(leftCoord.topRight.x - 40, leftCoord.bottomRight.y - 40);
        rightCrackTwo.setPosition(leftCoord.topRight.x - 40, leftCoord.topRight.y + 55);
        break;
      // 🖥️ Center Monitor
      case 'center':
        const centerCoord = scene.getPlayerData().data.monitors.center.coordinates;
        leftCrackOne.setPosition(centerCoord.bottomLeft.x + 52, centerCoord.bottomLeft.y - 38);
        rightCrackOne.setPosition(centerCoord.topRight.x - 45, centerCoord.bottomRight.y - 60);
        rightCrackTwo.setPosition(centerCoord.topRight.x - 45, centerCoord.topRight.y + 60);
        break;
      // 🖥️ Right Monitor
      case 'right':
        const rightCoord = scene.getPlayerData().data.monitors.right.coordinates;
        leftCrackOne.setPosition(rightCoord.bottomLeft.x + 60, rightCoord.bottomLeft.y - 38);
        rightCrackOne.setPosition(rightCoord.topRight.x - 45, rightCoord.bottomRight.y - 60);
        rightCrackTwo.setPosition(rightCoord.topRight.x - 42, rightCoord.topRight.y + 55);
        break;
      default:
        break;
    }
    return [leftCrackOne, rightCrackOne, rightCrackTwo];
  }

  static thirdCrackCombination(scene: TFBaseScene, monitorToCrack: TMonitorsNames) {
    const topLeftCrackOne = scene.add
      .image(0, 0, 'broken-screen-2')
      .setRotation(5.5)
      .setBlendMode(MonitorCrack.BLEND_MODE)
      .setAlpha(MonitorCrack.OPACITY);
    const middleLeftCrackOne = scene.add
      .image(0, 0, 'broken-screen-3')
      .setRotation(5.5)
      .setBlendMode(MonitorCrack.BLEND_MODE)
      .setAlpha(MonitorCrack.OPACITY);
    const middleBottomCrackOne = scene.add
      .image(0, 0, 'broken-screen-1')
      .setBlendMode(MonitorCrack.BLEND_MODE)
      .setAlpha(MonitorCrack.OPACITY);
    const middleBottomCrackTwo = scene.add
      .image(0, 0, 'broken-screen-3')
      .setRotation(3.8)
      .setBlendMode(MonitorCrack.BLEND_MODE)
      .setAlpha(MonitorCrack.OPACITY);

    switch (monitorToCrack) {
      // 🖥️ Left Monitor
      case 'left':
        const leftCoord = scene.getPlayerData().data.monitors.left.coordinates;
        topLeftCrackOne.setPosition(
          (leftCoord.topRight.x + leftCoord.topLeft.x) / 2 + 60,
          (leftCoord.topRight.y + leftCoord.topLeft.y) / 2 + 40
        );
        middleLeftCrackOne.setPosition(
          (leftCoord.topRight.x + leftCoord.topLeft.x) / 2 - 60,
          (leftCoord.topRight.y + leftCoord.topLeft.y) / 2 + 45
        );
        middleBottomCrackOne.setPosition(
          (leftCoord.topRight.x + leftCoord.topLeft.x) / 2 + 50,
          (leftCoord.bottomRight.y + leftCoord.bottomLeft.y) / 2 - 70
        );
        middleBottomCrackTwo.setPosition(
          (leftCoord.topRight.x + leftCoord.topLeft.x) / 2,
          (leftCoord.bottomRight.y + leftCoord.bottomLeft.y) / 2 - 60
        );
        break;
      // 🖥️ Center Monitor
      case 'center':
        const centerCoord = scene.getPlayerData().data.monitors.center.coordinates;
        topLeftCrackOne.setPosition(
          (centerCoord.topRight.x + centerCoord.topLeft.x) / 2 + 60,
          (centerCoord.topRight.y + centerCoord.topLeft.y) / 2 + 40
        );
        middleLeftCrackOne.setPosition(
          (centerCoord.topRight.x + centerCoord.topLeft.x) / 2 + 60,
          (centerCoord.topRight.y + centerCoord.topLeft.y) / 2 + 40
        );
        middleBottomCrackOne.setPosition(
          (centerCoord.topRight.x + centerCoord.topLeft.x) / 2 + 50,
          (centerCoord.bottomRight.y + centerCoord.bottomLeft.y) / 2 - 70
        );
        middleBottomCrackTwo.setPosition(
          (centerCoord.topRight.x + centerCoord.topLeft.x) / 2,
          (centerCoord.bottomRight.y + centerCoord.bottomLeft.y) / 2 - 60
        );
        break;
      // 🖥️ Right Monitor
      case 'right':
        const rightCoord = scene.getPlayerData().data.monitors.right.coordinates;
        topLeftCrackOne.setPosition(
          (rightCoord.topRight.x + rightCoord.topLeft.x) / 2 + 60,
          (rightCoord.topRight.y + rightCoord.topLeft.y) / 2 + 40
        );
        middleLeftCrackOne.setPosition(
          (rightCoord.topRight.x + rightCoord.topLeft.x) / 2 - 60,
          (rightCoord.topRight.y + rightCoord.topLeft.y) / 2 + 22
        );
        middleBottomCrackOne.setPosition(
          (rightCoord.topRight.x + rightCoord.topLeft.x) / 2 + 70,
          (rightCoord.bottomRight.y + rightCoord.bottomLeft.y) / 2 - 45
        );
        middleBottomCrackTwo.setPosition(
          (rightCoord.topRight.x + rightCoord.topLeft.x) / 2,
          (rightCoord.bottomRight.y + rightCoord.bottomLeft.y) / 2 - 35
        );
        break;
      default:
        break;
    }
    return [topLeftCrackOne, middleLeftCrackOne, middleBottomCrackOne, middleBottomCrackTwo];
  }
}
