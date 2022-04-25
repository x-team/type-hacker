import Graphics from '../../game/entities/Graphics';
import Word from '../../game/entities/Word';
import {
  calculateScoreRequirementForLevel,
  generateMonitorData,
} from '../../game/utils/generators';
import SceneKeys from '../../game/utils/SceneKeys';
import { TMonitorData } from '../../game/utils/types';
import TFBaseScene from '../TFBaseScene';

const circularScoreBarMeasurements = { x: 985, y: 184, radius: 90 };
const horizontalComboBarMeasurements = { x: 735, y: 942 };

export default class ScoreScene extends TFBaseScene {
  static RED_COMBO_BAR_COLOR = 0xff0000;
  static WHITE_COMBO_BAR_COLOR = 0xffffff;
  static BLUE_PROGRESS_BAR_COLOR = 0x5ce0e8;
  static LIGHT_BLUE_PROGRESS_BAR_COLOR = 0x96faff;

  constructor() {
    super(SceneKeys.Score);
  }

  create() {
    this.cameras.main.fadeIn(600, 0, 0, 0);
    const makeCircularScoreBar = () => {
      const config = {
        thickness: 0.145,
        startAngle: Phaser.Math.DegToRad(270),
        anticlockwise: false,
        value: 0,
        easeValue: {
          // TODO: not working
          duration: 3000,
          ease: 'Linear',
        },
        valuechangeCallback: () => null,
      };

      return this.rexUI.add.circularProgress(
        circularScoreBarMeasurements.x,
        circularScoreBarMeasurements.y,
        circularScoreBarMeasurements.radius,
        ScoreScene.BLUE_PROGRESS_BAR_COLOR,
        0,
        config
      );
    };

    const makeHorizontalScoreBar = (
      x: number,
      y: number,
      color: number,
      graphics: Graphics,
      isFullLength = false
    ) => {
      const value = 100;
      graphics?.fillStyle(color, 1);
      const width = 480;
      const percent = Phaser.Math.Clamp(value, 0, 100) / 100;
      graphics?.fillRect(0, 0, width * percent, 8);
      graphics.x = x;
      graphics.y = y;
      graphics.scaleX = isFullLength ? 1 : 0;
      return graphics;
    };
    const redComboBarGraphic = new Graphics(this as Phaser.Scene, 0, 0);
    const whiteComboBarGraphic = new Graphics(this as Phaser.Scene, 0, 0);

    const redComboBar = makeHorizontalScoreBar(
      horizontalComboBarMeasurements.x,
      horizontalComboBarMeasurements.y,
      ScoreScene.RED_COMBO_BAR_COLOR,
      redComboBarGraphic
    );

    const whiteComboBar = makeHorizontalScoreBar(
      horizontalComboBarMeasurements.x,
      horizontalComboBarMeasurements.y,
      0xffffff,
      whiteComboBarGraphic,
      true
    );

    redComboBar.setDepth(2);
    whiteComboBar.setDepth(1);

    const circle = makeCircularScoreBar();

    const middleX = this.game.canvas.width / 2;
    const offsetX = 24;
    const levelNumber = new Word(this, middleX + offsetX, 155, '1', '#fdfdfd ', true, '50px');
    levelNumber.setOrigin(0.5, 0);

    const currentScoreMultiplier = new Word(this, 975, 955, '1x', '#fdfdfd ', true, '30px');

    const score = new Word(
      this,
      1070,
      90,
      this.getPlayerData().data.currentScore.toString(),
      '#fdfdfd ',
      true,
      '50px'
    );

    // const plusScoreWordX = 1090;
    const plusScoreWords = {
      left: new Word(this, 0, 0, '', '#FC9842', true, '30px', true),
      center: new Word(this, 0, 0, '', '#FC9842', true, '30px', true),
      right: new Word(this, 0, 0, '', '#FC9842', true, '30px', true),
    };

    const handlePlusScore = ({
      plusScore,
      score,
      monitorData,
    }: {
      plusScore: number;
      score: string;
      monitorData: TMonitorData;
    }) => {
      const guessText = monitorData.guessText!;
      const plusScoreWord = plusScoreWords[monitorData.name];
      plusScoreWord.setText(`+${plusScore}`);
      plusScoreWord.x = guessText.x + guessText.width / 2 + score.length * 15;
      plusScoreWord.y = guessText.y;
      plusScoreWord.setOrigin(0, 0.5);
      const moveUpTweeen = this.tweens.add({
        targets: plusScoreWord,
        y: {
          from: plusScoreWord.y,
          to: plusScoreWord.y - 30,
        },
        duration: 800,
        alpha: {
          from: 1,
          to: 0,
        },
        ease: 'cubic.inout',
        onComplete: () => {
          moveUpTweeen.resetTweenData(true);
        },
      });
    };

    this.events.on('update-combo', () => {
      const comboPercentage = this.getPlayerData().data.currentCharacterStreak / 50;
      if (comboPercentage <= 1) {
        this.tweens.add({
          targets: redComboBar,
          scaleX: comboPercentage,
          duration: 300,
          onComplete: (tween) => {
            tween.resetTweenData(true);
          },
        });
      }
      if (comboPercentage >= 1) {
        this.tweens.add({
          targets: redComboBar,
          scaleX: 1,
          duration: 300,
          onComplete: (tween) => {
            tween.resetTweenData(true);
          },
        });
      }

      currentScoreMultiplier.setText(
        `${this.getPlayerData().data.currentScoreMultiplier.toString()}x`
      );
    });

    this.events.on('new-level-start', () => {
      this.getPlayerData().data.currentWordsDisplayed = []; // This was commented out for some reason
      this.events.emit('update-score', { score: 0 });
    });

    this.events.on(
      'update-score',
      ({ score: plusScore, monitorData }: { score: number; monitorData?: TMonitorData }) => {
        this.getPlayerData().data.currentScore += plusScore;
        score.setText(this.getPlayerData().data.currentScore.toString());
        if (plusScore > 0)
          handlePlusScore({
            score: score.text,
            plusScore,
            monitorData: monitorData ?? generateMonitorData('center'),
          });

        this.events.emit('update-combo');

        levelNumber.setText(this.getPlayerData().data.currentLevel.toString());
        currentScoreMultiplier.setText(
          `${this.getPlayerData().data.currentScoreMultiplier.toString()}x`
        );

        const nextLevelScore = calculateScoreRequirementForLevel(
          this.getPlayerData().data.currentLevel + 1
        );
        const scoreRequiredToCurrentLevel = calculateScoreRequirementForLevel(
          this.getPlayerData().data.currentLevel
        );

        const remainingScoreToNextLevel = nextLevelScore - scoreRequiredToCurrentLevel;
        const initialValue = this.getPlayerData().data.currentScore - scoreRequiredToCurrentLevel;

        const levelPercentage = (initialValue / remainingScoreToNextLevel) * 100;

        if (levelPercentage <= 100) {
          this.tweens.add({
            targets: circle,
            value: { value: levelPercentage / 100, duration: 300 },
            barColor: {
              value: ScoreScene.LIGHT_BLUE_PROGRESS_BAR_COLOR,
              durartion: 100,
              repeat: 0,
            },
            duration: 300,
            onComplete: (tween) => {
              tween.resetTweenData(true);
              circle.setBarColor(ScoreScene.BLUE_PROGRESS_BAR_COLOR);
            },
          });

          if (
            levelPercentage === 100 &&
            this.getPlayerData().data.currentLevel ===
              this.getPlayerData().configuration.pointsPerLevel.length
          ) {
            levelNumber.setText(this.getPlayerData().data.currentLevel.toString());
            levelNumber.setFontSize(80);
          }
        }
      }
    );
  }
}
