import { TMonitorsNames } from '../../game/utils/types';
import TFBaseScene from '../TFBaseScene';

const onUpdateCurrentMonitor = ({
  scene,
  monitor,
  currentMonitor,
}: {
  scene: TFBaseScene;
  monitor?: Phaser.GameObjects.Image;
  currentMonitor: TMonitorsNames;
}) => {
  if (currentMonitor !== scene.getPlayerData().data.currentMonitor) {
    monitor?.setVisible(false);
  } else {
    monitor?.setVisible(true);
  }
};

export default onUpdateCurrentMonitor;
