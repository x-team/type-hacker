import SceneKeys from "../../game/utils/SceneKeys";
import { TMonitorsNames } from "../../game/utils/types";
import TFBaseScene from "../TFBaseScene";

import { onRemoveSmoke } from "./onRemoveSmoke";

export default class SmokeScene extends TFBaseScene {
  constructor() {
    super(SceneKeys.Smoke);
  }

  create() {
    const createSmoke = ({
      currentMonitor,
    }: {
      currentMonitor: TMonitorsNames;
    }) => {
      const particles = this.add.particles("smoke");
      // Added isBurning for performance reasons as smoke would just continually generate on top of each other
      if (
        this.getPlayerData().data.monitors[currentMonitor].isDamaged &&
        !this.getPlayerData().data.monitors[currentMonitor].isBurning
      ) {
        this.getPlayerData().data.monitors[currentMonitor].isBurning = true;
        const currentMonitorData =
          this.getPlayerData().data.monitors[currentMonitor];
        const monitorCoordinates = {
          x: currentMonitorData.coordinates.smokeX,
          y: currentMonitorData.coordinates.smokeY,
        };

        particles.setDepth(0);
        particles.createEmitter({
          scale: { start: 0, end: 0.2 },
          alpha: {
            start: 1,
            end: 0,
          },
          gravityY: -300,
          x: monitorCoordinates?.x,
          y: monitorCoordinates?.y,
          speed: { min: 10, max: 100 },
          blendMode: "DARKEN",
        });
      }
      if (
        !this.getPlayerData().data.monitors[currentMonitor].isDamaged &&
        this.getPlayerData().data.monitors[currentMonitor].isBurning
      ) {
        particles.destroy();
        this.getPlayerData().data.monitors[currentMonitor].isBurning = false;
      }

      this.events.on("game-over", () => {
        onRemoveSmoke({ particles });
      });
    };
    this.events.on("create-smoke", (currentMonitor: TMonitorsNames) => {
      createSmoke({ currentMonitor });
    });
  }
}
