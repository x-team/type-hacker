import { MonitorCrack } from '../../game/entities/MonitorCrack';
import SceneKeys from '../../game/utils/SceneKeys';
import { TMonitorsNames } from '../../game/utils/types';
import TFBaseScene from '../TFBaseScene';

interface DamageMonitorParams {
  currentMonitor: TMonitorsNames;
}

export default class DamageMonitorScene extends TFBaseScene {
  private cracks: Phaser.GameObjects.Image[];
  private explosionSmokes: Phaser.GameObjects.Sprite[];
  private finalExplosions: Phaser.GameObjects.Sprite[];
  private smoke: Phaser.GameObjects.Sprite[];

  constructor() {
    super(SceneKeys.DamageMonitor);
    this.cracks = [];
    this.explosionSmokes = [];
    this.finalExplosions = [];
    this.smoke = [];
  }

  create() {
    this.events.on('game-over', () => {
      this.removeSmoke();
      this.removeCrack();
      this.removeExplotionSmoke();
      this.removeFinalExplosion();
    });

    this.events.on('damage-monitor', (currentMonitor: TMonitorsNames) => {
      this.createExplotionsSmoke({ currentMonitor });
      this.createFinalExplosion({ currentMonitor });
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

    const explosionSprite = this.explosionSmokes[0];
    const delayInMillis = explosionSprite.anims.duration * (explosionSprite.anims.repeat + 1);

    // Timeout to create the final smoke after the explosion
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
    const explosionSmoke = this.add.sprite(
      currentMonitorData.coordinates.explosionSmokeX,
      currentMonitorData.coordinates.explosionSmokeY,
      'explosion-atlas'
    );
    this.explosionSmokes = this.explosionSmokes.concat(explosionSmoke);
    explosionSmoke.setDisplaySize(200, 200);
    explosionSmoke.setAlpha(0.4);
    explosionSmoke.setBlendMode(Phaser.BlendModes.SCREEN);

    explosionSmoke.anims.play('explosion-smoke-atlas-anim');
  };

  createFinalExplosion = ({ currentMonitor }: DamageMonitorParams) => {
    const currentMonitorData = this.getPlayerData().data.monitors[currentMonitor];
    const monitorCoordinates = {
      x: currentMonitorData.coordinates.topRight.x,
      y: currentMonitorData.coordinates.topRight.y - 8,
    };

    const explosionSprite = this.explosionSmokes[0];
    const delayInMillis = explosionSprite.anims.duration * (explosionSprite.anims.repeat + 1);

    // Timeout to create the final smoke after the explosion
    setTimeout(() => {
      const smokeSprite = this.add.sprite(
        monitorCoordinates.x,
        monitorCoordinates.y,
        'final-explosion-atlas'
      );
      smokeSprite.setDisplaySize(60, 60);
      smokeSprite.setAlpha(0.8);
      smokeSprite.setBlendMode(Phaser.BlendModes.SCREEN);
      this.sound.play('monitor-break-fire', {
        volume: 0.3,
      });
      this.sound.play('monitor-break', {
        volume: 0.5,
      });
      smokeSprite.anims.play('final-explosion-atlas-anim');
      this.finalExplosions = this.finalExplosions.concat(smokeSprite);
    }, delayInMillis);
  };

  createCracks({ currentMonitor }: DamageMonitorParams) {
    const crackContainer = new MonitorCrack(this, 0, 0, currentMonitor);
    this.cracks = this.cracks.concat(crackContainer.cracks);
  }

  removeSmoke() {
    this.smoke.forEach((particlesManager) => particlesManager.destroy());
    this.smoke = [];
  }

  removeExplotionSmoke() {
    this.explosionSmokes.forEach((explosionSmoke) => explosionSmoke.destroy());
    this.explosionSmokes = [];
  }

  removeFinalExplosion() {
    this.finalExplosions.forEach((finalExplosion) => finalExplosion.destroy());
    this.finalExplosions = [];
  }

  removeCrack() {
    this.cracks.forEach((crack) => crack.destroy());
    this.cracks = [];
  }
}
