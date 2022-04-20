import { MonitorCrack } from '../../game/entities/MonitorCrack';
import SceneKeys from '../../game/utils/SceneKeys';
import { TMonitorsNames } from '../../game/utils/types';
import TFBaseScene from '../TFBaseScene';

interface DamageMonitorParams {
  currentMonitor: TMonitorsNames;
}

export default class DamageMonitorScene extends TFBaseScene {
  private cracks: Phaser.GameObjects.Image[];
  private particles: Phaser.GameObjects.Particles.ParticleEmitterManager[];

  constructor() {
    super(SceneKeys.DamageMonitor);
    this.cracks = [];
    this.particles = [];
  }

  create() {
    this.events.on('game-over', () => {
      this.removeSmoke();
      this.removeCrack();
    });

    this.events.on('damage-monitor', (currentMonitor: TMonitorsNames) => {
      this.createSmoke({ currentMonitor });
      this.createCracks({ currentMonitor });
    });
  }

  createSmoke = ({ currentMonitor }: DamageMonitorParams) => {
    const particlesManager = this.add.particles('smoke').setDepth(0);
    this.particles = this.particles.concat(particlesManager);
    // Added isBurning for performance reasons as smoke would just continually generate on top of each other
    if (
      this.getPlayerData().data.monitors[currentMonitor].isDamaged &&
      !this.getPlayerData().data.monitors[currentMonitor].isBurning
    ) {
      this.getPlayerData().data.monitors[currentMonitor].isBurning = true;
      const currentMonitorData = this.getPlayerData().data.monitors[currentMonitor];
      const monitorCoordinates = {
        x: currentMonitorData.coordinates.smokeX,
        y: currentMonitorData.coordinates.smokeY,
      };

      particlesManager.createEmitter({
        scale: { start: 0, end: 0.2 },
        alpha: {
          start: 1,
          end: 0,
        },
        gravityY: -300,
        x: monitorCoordinates?.x,
        y: monitorCoordinates?.y,
        speed: { min: 10, max: 100 },
        blendMode: 'DARKEN',
      });
    }
    if (
      !this.getPlayerData().data.monitors[currentMonitor].isDamaged &&
      this.getPlayerData().data.monitors[currentMonitor].isBurning
    ) {
      particlesManager.destroy();
      this.getPlayerData().data.monitors[currentMonitor].isBurning = false;
    }
  };

  createCracks({ currentMonitor }: DamageMonitorParams) {
    const crackContainer = new MonitorCrack(this, 0, 0, currentMonitor);
    this.cracks = this.cracks.concat(crackContainer.cracks);
  }

  removeSmoke = () => {
    this.particles.forEach((particlesManager) => particlesManager.destroy());
    this.particles = [];
  };

  removeCrack = () => {
    this.cracks.forEach((crack) => crack.destroy());
    this.cracks = [];
  };
}
