import { getNextWord } from '../../scenes/KeyboardsScene/onKeyDown';
import { getDelayBetweenWords } from '../../scenes/KeyboardsScene/utils';
import TFBaseScene from '../../scenes/TFBaseScene';
import { submitPlayerEvent } from '../playfab';
import SceneKeys from '../utils/SceneKeys';
import { TMonitorsNames } from '../utils/types';

export const onDamageMonitor = ({
  scene,
  monitorToBeDamaged,
}: {
  scene: TFBaseScene;
  monitorToBeDamaged: TMonitorsNames;
}) => {
  scene.sound.play('mistype', {
    volume: 0.2,
  });
  scene.sound.play('glass-break', {
    volume: 0.6,
  });
  scene.cameras.main.shake(400, 0.007);
  scene.getPlayerData().data.currentCharacterStreak = 0;
  scene.getPlayerData().data.currentScoreMultiplier = 1;
  scene.getPlayerData().data.monitors[monitorToBeDamaged].guessText?.setText('');
  scene.getPlayerData().data.monitors[monitorToBeDamaged].userText?.setText('');
  getNextWord({
    scene,
    guessWord: scene.getPlayerData().data.monitors[monitorToBeDamaged].guessText,
    userWord: scene.getPlayerData().data.monitors[monitorToBeDamaged].userText,
    levelSettings: scene.getPlayerData().configuration.levelSettings,
  });

  setTimeout(() => {
    scene.scene.get(SceneKeys.Panels).events.emit('show-clock', monitorToBeDamaged);
    scene.scene.get(SceneKeys.Panels).events.emit('reset-clock', monitorToBeDamaged);
  }, getDelayBetweenWords(scene.getPlayerData()));

  scene.getPlayerData().data.monitors[monitorToBeDamaged].isDamaged = true;
  scene.scene.get(SceneKeys.DamageMonitor).events.emit('damage-monitor', monitorToBeDamaged);
};

export default onDamageMonitor;
