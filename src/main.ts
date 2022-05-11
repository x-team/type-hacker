import Phaser from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import ShakePositionPlugin from 'phaser3-rex-plugins/plugins/shakeposition-plugin';

import { GAME_BG_COLOR } from './game/utils/consts';
import SceneKeys from './game/utils/SceneKeys';
import BaseEventsScene from './scenes/BaseEvents';
import GameOverDialogScene from './scenes/GameOverDialog';
import GameStartDialogScene from './scenes/GameStartDialog';
import KeyboardsScene from './scenes/KeyboardsScene';
import NewLevelScene from './scenes/NewLevel';
import PanelsScene from './scenes/PanelsScene';
import PreloaderScene from './scenes/Preloader';
import ScoreScene from './scenes/ScoreScene';
import DamageMonitorScene from './scenes/DamageMonitorScene';
import UIElementsScene from './scenes/UIElements';
import { checkIfMobile } from './mobileGame';

const isMobile = checkIfMobile();

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  pixelArt: true,
  fps: {
    target: 1,
  },
  backgroundColor: GAME_BG_COLOR,
  scale: {
    width: isMobile ? 1920 : 1920,
    height: isMobile ? 1080 : 1080,
    mode: isMobile ? Phaser.Scale.FIT : Phaser.Scale.FIT,
    autoCenter: isMobile ? Phaser.Scale.CENTER_BOTH : Phaser.Scale.CENTER_BOTH,
  },
  plugins: {
    scene: [
      {
        key: 'rexUI',
        plugin: RexUIPlugin,
        mapping: 'rexUI',
      },
    ],
    global: [
      {
        key: 'rexShakePosition',
        plugin: ShakePositionPlugin,
        mapping: 'rexShake',
        start: true,
      },
    ],
  },
};

const typeHackerGame = new Phaser.Game(config);

// SCENES
typeHackerGame.scene.add(SceneKeys.Preloader, PreloaderScene, true);
typeHackerGame.scene.add(SceneKeys.Preloader, BaseEventsScene);
typeHackerGame.scene.add(SceneKeys.GameStartDialog, GameStartDialogScene);
typeHackerGame.scene.add(SceneKeys.UIElements, UIElementsScene);

typeHackerGame.scene.add(SceneKeys.UIElements, ScoreScene);
typeHackerGame.scene.add(SceneKeys.NewLevel, NewLevelScene);
typeHackerGame.scene.add(SceneKeys.Keyboards, KeyboardsScene);
typeHackerGame.scene.add(SceneKeys.Panels, PanelsScene);
typeHackerGame.scene.add(SceneKeys.GameOverDialog, GameOverDialogScene);
typeHackerGame.scene.add(SceneKeys.GameOverDialog, DamageMonitorScene);

export default typeHackerGame;
