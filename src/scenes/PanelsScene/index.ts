import Phaser from "phaser";
import CircularProgress from "phaser3-rex-plugins/plugins/circularprogress";
import { calculateEnabledMonitors } from "../../game/events/onScoreWin";
import { CLOCK_COLORS } from "../../game/utils/consts";
import { calculateCurrentTimeout } from "../../game/utils/generators";
import SceneKeys from "../../game/utils/SceneKeys";
import { TMonitorsNames } from "../../game/utils/types";
import TFBaseScene from "../TFBaseScene";

import onHideClock from "./onHideClock";
import onResetClock from "./onResetClock";
import onShowClock from "./onShowClock";
import onUpdateCurrentMonitor from "./onUpdateCurrentMonitor";

type IConfigRexCircularProgress = {
  thickness: number;
  startAngle: number;
  anticlockwise: boolean;
  value: number;
  easeValue: {
    duration: number;
    ease: string;
  };
  valuechangeCallback: () => null;
};

type TFullPanel = {
  currentMonitor: TMonitorsNames;
  monitorX: number;
  monitorY: number;
};

export default class PanelsScene extends TFBaseScene {
  constructor() {
    super(SceneKeys.Panels);
  }

  public checkDamageOrGameOver({
    currentMonitor,
  }: {
    currentMonitor: TMonitorsNames;
  }) {
    const playerData = this.getPlayerData();
    const isMonitorDamaged = playerData.data.monitors[currentMonitor].isDamaged;
    const isGameOver = playerData.data.isGameOver;
    if (!isMonitorDamaged) {
      this.baseEventsScene("damage-monitor", {
        monitorToBeDamaged: currentMonitor,
      });
    } else {
      !isGameOver &&
        this.scene.get(SceneKeys.GameOverDialog).events.emit("game-over") &&
        this.baseEventsScene("game-over");
    }
    this.getPlayerData().data.monitors[currentMonitor].currentTimeout = 0;
  }

  public clockTimerAnimation({
    clockRadius,
    currentMonitor,
  }: {
    clockRadius: CircularProgress;
    currentMonitor: TMonitorsNames;
  }) {
    const playerData = this.getPlayerData();
    const totalTimeoutInMillis = calculateCurrentTimeout(playerData) * 1000;
    return this.tweens.add({
      targets: clockRadius,
      value: 0,
      duration: totalTimeoutInMillis,
      onComplete: (tween) => {
        tween.resetTweenData(true);
        clockRadius.setBarColor(CLOCK_COLORS.FIRST_COLOR);
        this.checkDamageOrGameOver({ currentMonitor });
      },
      onStart() {
        clockRadius.setBarColor(CLOCK_COLORS.FIRST_COLOR);
      },
      onUpdate: (tween) => {
        const currentTimeout =
          playerData.data.monitors[currentMonitor].totalCurrentTimeout * 1000 -
          tween.elapsed;

        if (currentTimeout <= 0.09) {
          tween.pause();
          tween.resetTweenData(true);
          this.checkDamageOrGameOver({ currentMonitor });
        } else {
          this.getPlayerData().data.monitors[currentMonitor].currentTimeout =
            currentTimeout / 1000;
        }

        if (clockRadius.value <= 0.25) {
          clockRadius.setBarColor(CLOCK_COLORS.FOURTH_COLOR);
        } else if (clockRadius.value <= 0.5) {
          clockRadius.setBarColor(CLOCK_COLORS.THIRD_COLOR);
        } else if (clockRadius.value <= 0.75) {
          clockRadius.setBarColor(CLOCK_COLORS.SECOND_COLOR);
        } else {
          clockRadius.setBarColor(CLOCK_COLORS.FIRST_COLOR);
        }
      },
    });
  }

  create() {
    const makeClock = (
      currentMonitor: TMonitorsNames
    ): {
      clockImage?: Phaser.GameObjects.Image;
      clockRadius?: CircularProgress;
    } => {
      const config: IConfigRexCircularProgress = {
        thickness: 0.2,
        startAngle: Phaser.Math.DegToRad(270),
        anticlockwise: false,
        value: 1,
        easeValue: {
          duration: 0,
          ease: "Linear",
        },
        valuechangeCallback: () => null,
      };

      const currentMonitorData =
        this.getPlayerData().data.monitors[currentMonitor];

      const clockImage = this.add?.image(
        currentMonitorData.coordinates.clockX,
        currentMonitorData.coordinates.clockY,
        "timer"
      );

      const clockRadius = this.rexUI.add.circularProgress(
        currentMonitorData.coordinates.clockRadiusX,
        currentMonitorData.coordinates.clockRadiusY,
        53,
        CLOCK_COLORS.FIRST_COLOR,
        1,
        config
      );

      clockRadius.setDataEnabled();

      const clockTimerTween = this.clockTimerAnimation({
        clockRadius,
        currentMonitor,
      });

      clockRadius.setData("clockTimerTween", clockTimerTween);

      this.events.on(
        "reset-clock",
        (monitor: TMonitorsNames) =>
          onResetClock({
            scene: this,
            monitor,
            currentMonitor,
            clockRadius,
          }),
        this
      );

      this.events.on(
        "hide-clock",
        (monitor: TMonitorsNames) =>
          onHideClock({ monitor, currentMonitor, clockRadius, clockImage }),
        this
      );

      this.events.on(
        "show-clock",
        (monitor: TMonitorsNames) =>
          onShowClock({ monitor, currentMonitor, clockRadius, clockImage }),
        this
      );

      return {
        clockImage,
        clockRadius,
      };
    };

    const makeMonitor = (x: number, y: number) => {
      const monitorImage = this.add?.image(x, y, "panel");
      return monitorImage;
    };

    // This is the asset overlay on top of the monitors
    const makeFullPanel = ({
      currentMonitor,
      monitorX,
      monitorY,
    }: TFullPanel) => {
      const monitor = makeMonitor(monitorX, monitorY);
      const { clockImage, clockRadius } = makeClock(currentMonitor);

      if (currentMonitor !== this.getPlayerData().data.currentMonitor) {
        monitor?.setVisible(false); // HERE
      }

      this.events.on("update-currentMonitor", () => {
        onUpdateCurrentMonitor({
          scene: this,
          monitor,
          currentMonitor,
        });
      });

      this.events.on("destroy-panels", () => {
        clockImage?.destroy();
        const clockTimerTween = clockRadius?.data?.get(
          "clockTimerTween"
        ) as Phaser.Tweens.Tween;
        clockRadius?.destroy();
        if (clockTimerTween) {
          clockTimerTween.stop();
        }
        monitor?.destroy();
      });
    };

    // TODO: This manual coordinates need to be changed to the ones we have related to this.getPlayerData().data.monitors
    // This shows the white asset overlay on top of the monitor
    const addFullPanels = () => {
      const leftPanel: TFullPanel = {
        currentMonitor: "left",
        monitorX: 465,
        monitorY: 624,
      };

      const centerPanel: TFullPanel = {
        currentMonitor: "center",
        monitorX: 989,
        monitorY: 420,
      };

      const rightPanel: TFullPanel = {
        currentMonitor: "right",
        monitorX: 1370,
        monitorY: 535,
      };

      const { centerMonitorEnabled, leftMonitorEnabled, rightMonitorEnabled } =
        calculateEnabledMonitors(this.getPlayerData().data.currentLevel);

      if (centerMonitorEnabled) makeFullPanel(centerPanel);
      if (leftMonitorEnabled) makeFullPanel(leftPanel);
      if (rightMonitorEnabled) makeFullPanel(rightPanel);
    };

    addFullPanels();

    this.events.on("level-end", () => {
      this.events.emit("destroy-panels");
    });

    this.events.on("new-level-start", () => {
      addFullPanels();
    });
  }
}
