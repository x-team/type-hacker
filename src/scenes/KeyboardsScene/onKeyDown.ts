import {
  MONITORS_DEFAULT_OVERLAY_ALPHA,
  MONITORS_FOCUS_OVERLAY_ALPHA,
} from '../../game/utils/consts';
import SceneKeys from '../../game/utils/SceneKeys';
import {
  LevelSettings,
  TMonitorConfiguration,
  TMonitorData,
  TMonitorsNames,
} from '../../game/utils/types';
import TFBaseScene from '../TFBaseScene';
import { generateNewWord, getDelayBetweenWords, getRandomInteger } from './utils';

const playRandomKeystrokeSound = (scene: TFBaseScene) => {
  const keystrokeSoundNames = ['keyboard1', 'keyboard2', 'keyboard3', 'keyboard4'];
  const randomSoundName =
    keystrokeSoundNames[Math.floor(Math.random() * keystrokeSoundNames.length)];
  scene.sound.play(randomSoundName);
};

const getScoreIncrement = (
  scene: TFBaseScene,
  currentMonitor: TMonitorsNames,
  monitor: TMonitorConfiguration
) => {
  const timeoutLeftOnCompletion =
    scene.getPlayerData().data.monitors[currentMonitor].currentTimeout;
  const totalCurrentTimeout =
    scene.getPlayerData().data.monitors[currentMonitor].totalCurrentTimeout;
  const completeWordSpeedCoefficient =
    Math.round((timeoutLeftOnCompletion / totalCurrentTimeout) * 100) / 100;
  const currentScoreMultiplier = scene.getPlayerData().data.currentScoreMultiplier;
  console.log({ completeWordSpeedCoefficient });
  if (completeWordSpeedCoefficient >= 0.66) {
    return Math.round(monitor.rightKeyStrokeWinPoints * currentScoreMultiplier);
  }
  if (completeWordSpeedCoefficient >= 0.33) {
    return Math.round(monitor.rightKeyStrokeWinPoints * 0.75 * currentScoreMultiplier);
  }
  return Math.round(monitor.rightKeyStrokeWinPoints * 0.5 * currentScoreMultiplier);
};

const updateScoreAndCombo = ({
  scene,
  currentMonitor,
  monitorConfig,
  monitorData,
}: {
  scene: TFBaseScene;
  currentMonitor: TMonitorsNames;
  monitorConfig: TMonitorConfiguration;
  monitorData: TMonitorData;
}) => {
  scene.baseEventsScene('score-win', {
    scoreIncrement: getScoreIncrement(scene, currentMonitor, monitorConfig),
    combo: monitorConfig.comboWinPoints,
    monitorData,
  });
};

const eventCharacterDoesNotMatch = ({ scene }: { scene: TFBaseScene }) => {
  scene.sound.play('mistype', {
    volume: 0.2,
    rate: 1.75,
  });
  scene.scene.get(SceneKeys.Panels).events.emit('mistype');
  scene.getPlayerData().data.currentCharacterStreak = 0;
  scene.getPlayerData().data.currentScoreMultiplier = 1;
  scene.scene.get(SceneKeys.Score).events.emit('update-combo');
};

export const getNextWord = ({
  scene,
  levelSettings,
  guessWord,
  userWord,
}: {
  scene: TFBaseScene;
  levelSettings: LevelSettings;
  guessWord?: Phaser.GameObjects.Text;
  userWord?: Phaser.GameObjects.Text;
}) => {
  const { wordLength } = levelSettings;
  const addModifier = getRandomInteger(
    wordLength.randomLengthAddMin,
    wordLength.randomLengthAddMax
  );
  const length = wordLength.minLength + addModifier;
  const generatedWord = generateNewWord(
    length,
    scene.getPlayerData().data.currentWordsDisplayed || []
  );

  scene.getPlayerData().data.currentWordsDisplayed.push(generatedWord);
  guessWord?.setText(generatedWord);
  userWord?.setText('');
  return generatedWord;
};

const calculateCurrentMultiplier = (currentCharacterStreak: number, scene: TFBaseScene) => {
  if (currentCharacterStreak >= 20) scene.getPlayerData().data.currentScoreMultiplier = 2;
  if (currentCharacterStreak >= 50) scene.getPlayerData().data.currentScoreMultiplier = 3;
};

const onLastCharacterMatching = ({
  scene,
  guessWord,
  userWord,
  monitorConfig,
  currentMonitor,
}: {
  scene: TFBaseScene;
  guessWord: Phaser.GameObjects.Text;
  monitorConfig: TMonitorConfiguration;
  userWord: Phaser.GameObjects.Text;
  currentMonitor: TMonitorsNames;
  newLetter: string;
}) => {
  scene.getPlayerData().data.currentWordsDisplayed = scene
    .getPlayerData()
    .data.currentWordsDisplayed.filter((word) => word !== guessWord.text);

  scene.scene.get(SceneKeys.Panels).events.emit('hide-clock', currentMonitor);

  getNextWord({
    scene: scene,
    guessWord,
    userWord,
    levelSettings: scene.getPlayerData().configuration.levelSettings,
  });
  updateScoreAndCombo({
    scene: scene,
    monitorData: Object.values(scene.getPlayerData().data.monitors).find(
      (monitor) => monitor.name === currentMonitor
    )!,
    monitorConfig,
    currentMonitor,
  });

  if (scene.getPlayerData().data.monitors[currentMonitor].isDamaged)
    scene.getPlayerData().data.monitors[currentMonitor].isTimoutAfterFirstdamaged = true;
  scene.getPlayerData().data.isFocusingOnWord = false;
  guessWord.visible = false;

  // Delay between words adjusts according to current level
  setTimeout(() => {
    guessWord.visible = true;
    scene.scene.get(SceneKeys.Panels).events.emit('show-clock', currentMonitor);
    scene.scene.get(SceneKeys.Panels).events.emit('reset-clock', currentMonitor);
  }, getDelayBetweenWords(scene.getPlayerData()));
};

const eventCharacterDoesMatch = ({
  scene,
  guessWord,
  userWord,
  monitorConfig,
  currentMonitor,
  newLetter,
}: {
  scene: TFBaseScene;
  guessWord: Phaser.GameObjects.Text;
  monitorConfig: TMonitorConfiguration;
  userWord: Phaser.GameObjects.Text;
  currentMonitor: TMonitorsNames;
  newLetter: string;
}) => {
  playRandomKeystrokeSound(scene);
  scene.getPlayerData().data.currentCharacterStreak += 1;
  calculateCurrentMultiplier(scene.getPlayerData().data.currentCharacterStreak, scene);
  userWord.setText(userWord.text + newLetter);
  const isTheLastLetter = guessWord.text.length === userWord.text.length;
  if (isTheLastLetter)
    onLastCharacterMatching({
      scene,
      guessWord,
      userWord,
      monitorConfig,
      currentMonitor,
      newLetter,
    });
};

export const onKeydown = ({
  scene,
  event,
}: {
  scene: TFBaseScene;
  event: { keyCode: number; key: string };
}) => {
  const isValidLetterOrSymbol =
    event.keyCode === 189 || event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode <= 90);

  if (!isValidLetterOrSymbol) {
    return;
  }

  const typedCharacter = event.key;

  const playerData = scene.getPlayerData().data;
  const { isFocusingOnWord, monitors } = playerData;

  const matchableWords = [
    monitors.left.guessText,
    monitors.center.guessText,
    monitors.right.guessText,
  ];
  const monitorNames: TMonitorsNames[] = ['left', 'center', 'right'];

  if (isFocusingOnWord) {
    const monitorName = scene.getPlayerData().data.currentMonitor;
    const guessText = scene.getPlayerData().data.monitors[monitorName]
      .guessText as Phaser.GameObjects.Text;
    const userText = scene.getPlayerData().data.monitors[monitorName]
      .userText as Phaser.GameObjects.Text;
    const guessWord = guessText?.text;
    const userWord = userText?.text;

    const eventKeyMatchWithNextWord = guessWord.charAt(userWord.length) === typedCharacter;
    const monitor = scene.getPlayerData().configuration.levelSettings.monitorConfiguration;

    if (eventKeyMatchWithNextWord) {
      eventCharacterDoesMatch({
        scene,
        guessWord: guessText,
        monitorConfig: monitor,
        userWord: userText,
        currentMonitor: monitorName,
        newLetter: event.key,
      });
    } else {
      eventCharacterDoesNotMatch({ scene: scene });
    }
  } else {
    const matchedGuessText = matchableWords.find(
      (phaserText) => phaserText && phaserText.text.charAt(0) === typedCharacter
    );

    // Matched first character
    if (matchedGuessText) {
      scene.getPlayerData().data.isFocusingOnWord = true;
      scene.getPlayerData().data.currentFocusedGuessWord = matchedGuessText.text;
      const monitorName = monitorNames[matchableWords.indexOf(matchedGuessText)];
      const monitor = scene.getPlayerData().configuration.levelSettings.monitorConfiguration;
      const userWord = scene.getPlayerData().data.monitors[monitorName]
        .userText as Phaser.GameObjects.Text;

      // Get away the focus from the previous screen
      scene
        .getPlayerData()
        .data.monitors[scene.getPlayerData().data.currentMonitor].screenOverlay?.setAlpha(
          MONITORS_DEFAULT_OVERLAY_ALPHA
        );
      // Focus on the new screen
      scene
        .getPlayerData()
        .data.monitors[monitorName].screenOverlay?.setAlpha(MONITORS_FOCUS_OVERLAY_ALPHA);

      if (scene.getPlayerData().data.currentMonitor !== monitorName) {
        scene.scene.get(SceneKeys.Panels).events.emit('restart-on-focus-animation');
      }
      scene.getPlayerData().data.currentMonitor = monitorName;
      scene.scene.get(SceneKeys.Panels).events.emit('update-currentMonitor');

      eventCharacterDoesMatch({
        scene,
        guessWord: matchedGuessText,
        monitorConfig: monitor,
        userWord,
        currentMonitor: monitorName,
        newLetter: typedCharacter,
      });
    } else {
      eventCharacterDoesNotMatch({ scene: scene });
    }
  }
};

export default onKeydown;
