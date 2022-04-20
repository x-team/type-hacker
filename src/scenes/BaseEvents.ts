import Background from '../game/entities/Background';
import onDamageMonitor from '../game/events/onDamageMonitor';
import onScoreWin from '../game/events/onScoreWin';
import { MONITORS_OVERLAY_ALPHA, MONITORS_OVERLAY_COLOR } from '../game/utils/consts';
import SceneKeys from '../game/utils/SceneKeys';
import { TMonitorCoordinates, TMonitorData, TMonitorsNames } from '../game/utils/types';
import TFBaseScene from './TFBaseScene';

export default class BaseEventsScene extends TFBaseScene {
  constructor() {
    super(SceneKeys.BaseEvents);
  }

  create() {
    this.prepareEvents();
    this.addBackground();
  }

  prepareEvents() {
    // GENERAL EVENTS
    this.events.on(
      'damage-monitor',
      ({ monitorToBeDamaged }: { monitorToBeDamaged: TMonitorsNames }) => {
        onDamageMonitor({ scene: this, monitorToBeDamaged });
      }
    );

    this.events.on(
      'score-win',
      ({
        scoreIncrement,
        combo,
        monitorData,
      }: {
        scoreIncrement: number;
        combo: number;
        monitorData: TMonitorData;
      }) => {
        onScoreWin({
          scene: this,
          scoreIncrement,
          combo,
          monitorData,
        });
      }
    );

    // this.events.on("score-lost", (score: number) => {
    //   onScoreLost({ scene: this, score });
    // });

    this.events.on('game-over', () => {
      this.getPlayerData().data.isGameOver = true;
      this.scene.get(SceneKeys.Smoke).events.emit('game-over');
    });

    this.events.on('reset-game', () => {
      this.restartPlayerData();
      this.scene.get(SceneKeys.Smoke).events.emit('game-over');
      this.scene.get(SceneKeys.NewLevel).events.emit('level-end', { skipAnimations: true });
    });
  }

  addBackground = () => {
    new Background(this, 0, 0, 'hacker-background', {
      isGif: true,
    });
    // Add black overlay to monitors
    const offset = 5;
    const generateCoordinates = (monitorCoordinates: TMonitorCoordinates) => {
      const { topLeft, topRight, bottomRight, bottomLeft } = monitorCoordinates;
      return [
        topLeft.x - offset,
        topLeft.y - offset,
        topRight.x - offset,
        topRight.y - offset,
        bottomRight.x - offset,
        bottomRight.y - offset,
        bottomLeft.x - offset,
        bottomLeft.y - offset,
      ];
    };

    // extract the coordinates
    const leftMonitorPanel = generateCoordinates(
      this.getPlayerData().data.monitors.left.coordinates
    );
    const centerMonitorPanel = generateCoordinates(
      this.getPlayerData().data.monitors.center.coordinates
    );
    const rightMonitorPanel = generateCoordinates(
      this.getPlayerData().data.monitors.right.coordinates
    );

    // Add the overlay
    const leftOverlay = this.add.polygon(
      offset,
      offset,
      leftMonitorPanel,
      MONITORS_OVERLAY_COLOR,
      MONITORS_OVERLAY_ALPHA
    );
    leftOverlay.setOrigin(0, 0);

    const centerOverlay = this.add.polygon(
      0,
      0,
      centerMonitorPanel,
      MONITORS_OVERLAY_COLOR,
      MONITORS_OVERLAY_ALPHA
    );
    centerOverlay.setOrigin(0, 0);

    const rightOverlay = this.add.polygon(
      0,
      0,
      rightMonitorPanel,
      MONITORS_OVERLAY_COLOR,
      MONITORS_OVERLAY_ALPHA
    );
    rightOverlay.setOrigin(0, 0);
  };

  startGameMusic() {
    this.sound.play('bgm', {
      loop: true,
      volume: 0.08,
    });
  }
}
