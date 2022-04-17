import CircularProgress from "phaser3-rex-plugins/plugins/circularprogress";
import { CLOCK_COLORS } from "../../game/utils/consts";
import { TMonitorsNames } from "../../game/utils/types";

const onHideClock = ({
  monitor,
  currentMonitor,
  clockRadius,
  clockImage,
}: {
  monitor: TMonitorsNames;
  currentMonitor: TMonitorsNames;
  clockRadius: CircularProgress;
  clockImage: Phaser.GameObjects.Image;
}) => {
  if (monitor === currentMonitor) {
    if (clockRadius?.data) {
      const clockTimerTween = clockRadius.data.get("clockTimerTween");
      clockTimerTween.pause();
    }
    clockRadius.setBarColor(CLOCK_COLORS.FIRST_COLOR);
    clockRadius.value = 0;
    clockImage?.setVisible(false);
  }
};

export default onHideClock;
