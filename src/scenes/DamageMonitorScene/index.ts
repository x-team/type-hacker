import { MonitorCrack } from '../../game/entities/MonitorCrack';
import SceneKeys from '../../game/utils/SceneKeys';
import { TMonitorsNames } from '../../game/utils/types';
import TFBaseScene from '../TFBaseScene';

interface DamageMonitorParams {
  currentMonitor: TMonitorsNames;
}

export default class DamageMonitorScene extends TFBaseScene {
  private cracks: Phaser.GameObjects.Image[];
  private explotionSmokes: Phaser.GameObjects.Sprite[];
  private smoke: Phaser.GameObjects.Sprite[];

  constructor() {
    super(SceneKeys.DamageMonitor);
    this.cracks = [];
    this.explotionSmokes = [];
    this.smoke = [];
  }

  create() {
    this.events.on('game-over', () => {
      this.removeSmoke();
      this.removeCrack();
      this.removeExplotionSmoke();
    });

    this.events.on('damage-monitor', (currentMonitor: TMonitorsNames) => {
      this.createExplotionsSmoke({ currentMonitor });
      this.createSmoke({ currentMonitor });
      this.createCracks({ currentMonitor });
    });
  }

  createSmoke = ({ currentMonitor }: DamageMonitorParams) => {
    const currentMonitorData = this.getPlayerData().data.monitors[currentMonitor];
    const monitorCoordinates = {
      x: currentMonitorData.coordinates.smokeX,
      y: currentMonitorData.coordinates.smokeY,
    };

    const explotionSprite = this.explotionSmokes[0];
    const delayInMillis = explotionSprite.anims.duration * (explotionSprite.anims.repeat + 1);

    // Timeout to create the final smoke after the explotion
    setTimeout(() => {
      const smokeSprite = this.add.sprite(
        monitorCoordinates.x,
        monitorCoordinates.y,
        'smoke-atlas'
      );
      smokeSprite.setDisplaySize(200, 200);
      smokeSprite.setAlpha(0.6);
      smokeSprite.setBlendMode(Phaser.BlendModes.SCREEN);
      smokeSprite.anims.play('smoke-atlas-anim');
      this.smoke = this.smoke.concat(smokeSprite);
    }, delayInMillis);
  };

  createExplotionsSmoke = ({ currentMonitor }: DamageMonitorParams) => {
    const currentMonitorData = this.getPlayerData().data.monitors[currentMonitor];
    const explotionSmoke = this.add.sprite(
      currentMonitorData.coordinates.explotionSmokeX,
      currentMonitorData.coordinates.explotionSmokeY,
      'explotion-atlas'
    );
    this.explotionSmokes = this.explotionSmokes.concat(explotionSmoke);
    explotionSmoke.setDisplaySize(200, 200);
    explotionSmoke.setAlpha(0.4);
    explotionSmoke.setBlendMode(Phaser.BlendModes.SCREEN);

    explotionSmoke.anims.play('explotion-smoke-atlas-anim');
  };

  createCracks({ currentMonitor }: DamageMonitorParams) {
    const crackContainer = new MonitorCrack(this, 0, 0, currentMonitor);
    this.cracks = this.cracks.concat(crackContainer.cracks);
  }

  removeSmoke = () => {
    this.smoke.forEach((particlesManager) => particlesManager.destroy());
    this.smoke = [];
  };

  removeExplotionSmoke = () => {
    this.explotionSmokes.forEach((explotionSmoke) => explotionSmoke.destroy());
    this.explotionSmokes = [];
  };

  removeCrack = () => {
    this.cracks.forEach((crack) => crack.destroy());
    this.cracks = [];
  };
}
