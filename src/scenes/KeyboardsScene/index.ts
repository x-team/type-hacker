import Word from '../../game/entities/Word';
import { calculateEnabledMonitors } from '../../game/events/onScoreWin';
import {
  MONITORS_DEFAULT_OVERLAY_ALPHA,
  MONITORS_DEFAULT_OVERLAY_COLOR,
} from '../../game/utils/consts';
import SceneKeys from '../../game/utils/SceneKeys';
import { TMonitorsNames } from '../../game/utils/types';
import { checkIfMobile } from '../../mobileGame';
import TFBaseScene from '../TFBaseScene';
import onComboFn from './onCombo';
import onKeydownFn, { getNextWord } from './onKeyDown';

export default class KeyboardsScene extends TFBaseScene {
  constructor() {
    super(SceneKeys.Keyboards);
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);
    this.addKeyboardListener();
    this.addAllKeyboardGameMonitors();

    this.events.on('level-end', () => {
      this.getPlayerData().data.currentWordsDisplayed = [];
      this.events.emit('destroy-words');
      this.input.keyboard.removeListener('keydown');
    });

    this.events.on('new-level-start', () => {
      this.addAllKeyboardGameMonitors();
      !checkIfMobile() && this.addKeyboardListener();
    });
  }

  private addKeyboardListener() {
    if (checkIfMobile()) {
      const selectElement = document.querySelector('#virtual-keyboard');
      selectElement?.addEventListener('change', (event) => {
        const inputFieldValue = (event.target as HTMLInputElement).value || '';
        if (inputFieldValue) {
          const typedLetter = inputFieldValue.charAt(inputFieldValue.length - 1);
          onKeydownFn({
            scene: this,
            event: { keyCode: 48, key: typedLetter }, // TODO: update keycodes
          });
        }
      });
    } else {
      this.input.keyboard.on('keydown', (event: { keyCode: number; key: string }) => {
        onKeydownFn({
          scene: this,
          event,
        });
      });
    }
  }

  private addMonitorText(
    guessWordX: number,
    guessWordY: number,
    userWordY: number,
    currentMonitor: TMonitorsNames,
    defaultVisible: boolean
  ) {
    const guessWord = new Word(
      this,
      guessWordX,
      guessWordY,
      getNextWord({
        scene: this,
        levelSettings: this.getPlayerData().configuration.levelSettings,
      }),
      '#fdfdfd',
      defaultVisible
    );
    guessWord.setDepth(2);
    guessWord.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    guessWord.setOrigin(0, 0.5);
    checkIfMobile() && guessWord.setFontSize(90);
    this.tweens.add({
      targets: guessWord,
      alpha: {
        from: 0,
        to: 1,
      },
      duration: 400,
      onComplete: (tween) => {
        tween.resetTweenData(true);
      },
    });
    this.getPlayerData().data.monitors[currentMonitor].guessText = guessWord;

    const userWord = new Word(
      this,
      guessWordX,
      checkIfMobile() ? guessWordY : userWordY + guessWord.height,
      '',
      '#fe9c9d',
      defaultVisible
    );
    userWord.setDepth(2);
    userWord.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    userWord.setOrigin(0, 0.5);
    checkIfMobile() && userWord.setFontSize(90);

    this.getPlayerData().data.monitors[currentMonitor].userText = userWord;
    const currentTime = 10;

    const onCombo = this.events?.on('combo', () => {
      onComboFn({ currentTime, userWord });
    });

    this.events.on('destroy-words', () => {
      guessWord.destroy();
      userWord.destroy();
      onCombo.off('combo');
    });
  }

  addAllKeyboardGameMonitors() {
    const currentLevel = this.getPlayerData().data.currentLevel;

    const { centerMonitorEnabled, leftMonitorEnabled, rightMonitorEnabled } =
      calculateEnabledMonitors(currentLevel);

    const monitorsData = this.getPlayerData().data.monitors;
    // 🖥️ Center monitor
    if (centerMonitorEnabled) {
      if (!this.getPlayerData().data.monitors.center.screenOverlay) {
        this.generateMonitorsOverlay();
      }
      this.getPlayerData().data.monitors.center.screenOverlay!.setFillStyle(
        MONITORS_DEFAULT_OVERLAY_COLOR
      );
      this.getPlayerData().data.monitors.center.screenOverlay!.setAlpha(
        MONITORS_DEFAULT_OVERLAY_ALPHA
      );
      this.addMonitorText(
        monitorsData.center.coordinates.guessWordX,
        monitorsData.center.coordinates.guessWordY,
        monitorsData.center.coordinates.userWordY,
        'center',
        true
      );
    }

    // 🖥️ Left monitor
    if (leftMonitorEnabled) {
      if (!this.getPlayerData().data.monitors.left.screenOverlay) {
        this.generateMonitorsOverlay();
      }
      this.getPlayerData().data.monitors.left.screenOverlay!.setFillStyle(
        MONITORS_DEFAULT_OVERLAY_COLOR
      );
      this.getPlayerData().data.monitors.left.screenOverlay!.setAlpha(
        MONITORS_DEFAULT_OVERLAY_ALPHA
      );
      this.addMonitorText(
        monitorsData.left.coordinates.guessWordX,
        monitorsData.left.coordinates.guessWordY,
        monitorsData.left.coordinates.userWordY,
        'left',
        true
      );
    }

    // 🖥️ Right monitor
    if (rightMonitorEnabled) {
      if (!this.getPlayerData().data.monitors.right.screenOverlay) {
        this.generateMonitorsOverlay();
      }
      this.getPlayerData().data.monitors.right.screenOverlay!.setFillStyle(
        MONITORS_DEFAULT_OVERLAY_COLOR
      );
      this.getPlayerData().data.monitors.right.screenOverlay!.setAlpha(
        MONITORS_DEFAULT_OVERLAY_ALPHA
      );
      this.addMonitorText(
        monitorsData.right.coordinates.guessWordX,
        monitorsData.right.coordinates.guessWordY,
        monitorsData.right.coordinates.userWordY,
        'right',
        true
      );
    }
  }
}
