import CircularProgress from "phaser3-rex-plugins/plugins/circularprogress";
import { CLOCK_COLORS } from "../../game/utils/consts";
import { calculateCurrentTimeout } from "../../game/utils/generators";
import { TMonitorsNames } from "../../game/utils/types";
import TFBaseScene from "../TFBaseScene";

const onResetClock = ({
  scene,
  monitor,
  currentMonitor,
  clockRadius,
}: {
  scene: TFBaseScene;
  monitor: TMonitorsNames;
  currentMonitor: TMonitorsNames;
  clockRadius: CircularProgress;
}) => {
  if (monitor === currentMonitor) {
    if (clockRadius?.data) {
      const clockTimerTween = clockRadius.data.get("clockTimerTween");
      clockTimerTween.restart();
    }
    clockRadius.setBarColor(CLOCK_COLORS.FIRST_COLOR);
    clockRadius.value = 1;
    const currentTimeout = calculateCurrentTimeout(scene.getPlayerData());
    // Here we only need to set the current time
    scene.getPlayerData().data.monitors[currentMonitor].currentTimeout =
      currentTimeout;
    // We don't need to set totalCurrentTimeOut because we change it on score-win
  }
};

export default onResetClock;
