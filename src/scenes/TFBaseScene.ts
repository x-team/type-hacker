import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import ShakePositionPlugin from 'phaser3-rex-plugins/plugins/shakeposition-plugin';
import GlowFilterPipelinePlugin from 'phaser3-rex-plugins/plugins/glowfilter2pipeline-plugin.js';

import { FullPlayerData } from '../game/entities/FullPlayerData';
import SceneKeys from '../game/utils/SceneKeys';
import { MONITORS_TURNED_OFF_COLOR, MONITORS_TURNED_OFF_OVERLAY_ALPHA } from '../game/utils/consts';
import { TMonitorCoordinates } from '../game/utils/types';

export default class TFBaseScene extends Phaser.Scene {
  rexUI!: RexUIPlugin;
  rexGlow!: GlowFilterPipelinePlugin;
  rexShake!: ShakePositionPlugin;
  playerData: FullPlayerData;

  baseEventsScene = (event: string, data?: any) =>
    this.scene.get(SceneKeys.BaseEvents).events.emit(event, data);

  constructor(key: string) {
    super({ key });
    this.playerData = FullPlayerData.getPlayerData();
  }

  restartPlayerData() {
    this.playerData = FullPlayerData.getPlayerData(true);
  }

  getPlayerData() {
    return FullPlayerData.getPlayerData();
  }

  generateMonitorsOverlay() {
    // Add black overlay to monitors

    // Offset could be different than zero
    // if we want the overlay to be bigger or smaller than the monitors
    const offset = 5;
    const generateOverlayCoordinates = (monitorCoordinates: TMonitorCoordinates) => {
      const { topLeft, topRight, bottomRight, bottomLeft } = monitorCoordinates;
      return [
        topLeft.x - offset,
        topLeft.y - offset,
        topRight.x + offset,
        topRight.y - offset,
        bottomRight.x + offset,
        bottomRight.y + offset,
        bottomLeft.x - offset,
        bottomLeft.y + offset,
      ];
    };

    // extract the coordinates
    const leftMonitorPanel = generateOverlayCoordinates(
      this.getPlayerData().data.monitors.left.coordinates
    );
    const centerMonitorPanel = generateOverlayCoordinates(
      this.getPlayerData().data.monitors.center.coordinates
    );
    const rightMonitorPanel = generateOverlayCoordinates(
      this.getPlayerData().data.monitors.right.coordinates
    );

    // Add the overlay
    const leftOverlay = this.add.polygon(
      0,
      0,
      leftMonitorPanel,
      MONITORS_TURNED_OFF_COLOR,
      MONITORS_TURNED_OFF_OVERLAY_ALPHA
    );
    leftOverlay.setOrigin(0, 0);

    const centerOverlay = this.add.polygon(
      0,
      0,
      centerMonitorPanel,
      MONITORS_TURNED_OFF_COLOR,
      MONITORS_TURNED_OFF_OVERLAY_ALPHA
    );
    centerOverlay.setOrigin(0, 0);

    const rightOverlay = this.add.polygon(
      0,
      0,
      rightMonitorPanel,
      MONITORS_TURNED_OFF_COLOR,
      MONITORS_TURNED_OFF_OVERLAY_ALPHA
    );
    rightOverlay.setOrigin(0, 0);

    this.getPlayerData().data.monitors.left.screenOverlay = leftOverlay;
    this.getPlayerData().data.monitors.center.screenOverlay = centerOverlay;
    this.getPlayerData().data.monitors.right.screenOverlay = rightOverlay;
  }
}
