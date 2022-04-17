import CircularProgress from "phaser3-rex-plugins/plugins/circularprogress";
import { CLOCK_COLORS } from "../../game/utils/consts";
import { TMonitorsNames } from "../../game/utils/types";

const onShowClock = ({
  monitor,
  currentMonitor,
  clockImage,
  clockRadius,
}: {
  monitor: TMonitorsNames;
  currentMonitor: TMonitorsNames;
  clockRadius: CircularProgress;
  clockImage: Phaser.GameObjects.Image;
}) => {
  if (monitor === currentMonitor) {
    if (clockRadius?.data) {
      const clockTimerTween = clockRadius.data.get("clockTimerTween");
      clockTimerTween.restart();
    }
    clockRadius.setBarColor(CLOCK_COLORS.FIRST_COLOR);
    clockImage?.setVisible(true);
  }
};

export default onShowClock;
