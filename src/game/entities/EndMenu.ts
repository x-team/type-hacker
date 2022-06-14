import Buttons from 'phaser3-rex-plugins/templates/ui/buttons/Buttons';
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle';
import Label from 'phaser3-rex-plugins/templates/ui/label/Label';
import TFBaseScene from '../../scenes/TFBaseScene';
import Word from './Word';
import { submitScore } from '../../api/leaderboard';

interface LabelSettings {
  xPos?: number;
  yPos?: number;
  color?: string;
}

export class EndMenu extends Phaser.GameObjects.Container {
  private parentScene: TFBaseScene;

  // MAIN MENU
  private mainTextLabel: Label;

  private loginWithButton: Label;
  private retryGameButton: Label;

  private buttonsContainer: Buttons;

  // TOP SCORES
  private topScoreLabel: Label;

  constructor(scene: TFBaseScene, x: number, y: number, handleClickFunc: Function) {
    super(scene, x, y);

    this.parentScene = scene;

    // MAIN TEXT
    const mainTextText = scene.add.sprite(0, 0, 'game-over-logo');
    mainTextText.setOrigin(0.5, 0);
    mainTextText.setScale(1.5);
    this.add(mainTextText);
    this.mainTextLabel = scene.rexUI.add
      .label({
        y: -y + 170 + mainTextText.height / 2,
        text: mainTextText,
      })
      .fadeIn(1000, 1)
      .layout();

    this.add(this.mainTextLabel);

    // BUTTONS
    this.loginWithButton = this.createLabel('< Login with XTU />', 'game-xtu-login');
    this.add(this.loginWithButton);

    this.retryGameButton = this.createLabel('< Retry />', 'game-start');
    this.add(this.retryGameButton);

    this.buttonsContainer = scene.rexUI.add
      .buttons({
        x: 0,
        y: mainTextText.y + mainTextText.height + 100,
        // width: 400,
        orientation: 'x',
        align: 'center',
        buttons: [this.loginWithButton, this.retryGameButton],
        space: {
          left: 10,
          right: 10,
          top: 15,
          bottom: 25,
          // item: 10,
        },
        expand: true,
      })
      .layout();

    // EVENTS
    this.buttonsContainer.on('button.over', this.handleOverButton);
    this.buttonsContainer.on('button.out', this.handleOutButton);
    this.buttonsContainer.on('button.click', handleClickFunc, scene);
    this.add(this.buttonsContainer);

    const isUserloggedIn = scene.getPlayerData().data.session.isLoggedIn;
    this.toggleLoginbutton(!isUserloggedIn);

    // TOP SCORES
    const yPos = this.buttonsContainer.y + this.buttonsContainer.height;
    const wordText = new Word(scene, 0, 0, '*', 'white', true);
    wordText.setOrigin(0.5, 0);
    wordText.setAlign('Left');
    this.add(wordText);
    this.topScoreLabel = scene.rexUI.add
      .label({
        y: yPos,
        text: wordText,
      })
      .fadeIn(1000, 1)
      .layout();
    this.topScoreLabel.setOrigin(0.5, 0.5);
    this.add(this.topScoreLabel);

    // To draw the box container
    // this.buttonsContainer.drawBounds(scene.add.graphics(), 0xff0000);
    scene.add.existing(this);
  }

  setTopScoreText(textGO: Word) {
    this.topScoreLabel.setText(textGO.text);
  }

  async getScoreboard() {
    const yourScore = this.parentScene.getPlayerData().data.currentScore;
    const yourLongestStreak = this.parentScene.getPlayerData().data.longestStreak;
    if (this.parentScene.getPlayerData().data.session.isLoggedIn) {
      const currentLevel = this.parentScene.getPlayerData().data.currentLevel;
      await submitScore({
        score: yourScore,
        longestStreak: yourLongestStreak,
        level: currentLevel,
      });
    }
    // const userName = getPlayerName();
    const yourScoreText = `YOUR SCORE: ${yourScore}`;
    const yourStreakText = `YOUR LONGEST STREAK: ${yourLongestStreak}`;
    const topScoresText = 'TOP SCORES';
    try {
      // const scoreSubmitted = await submitScore();
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // if (scoreSubmitted === 200) {
      //   const scoreBoard = (await getLeaderboardScores()) as any;
      //   const scoreboardText = scoreBoard.Leaderboard.map(
      //     (player: { Position: number; StatValue: number; DisplayName: number }) =>
      //       `${player.Position + 1}. |${player.StatValue} ➡ ${player.DisplayName}`
      //   );
      return [
        yourScoreText,
        yourStreakText,
        ' ',
        topScoresText,
        '-----------------------------',
        // ...scoreboardText,
      ];
      // }
    } catch (e) {
      return [
        yourScoreText,
        yourStreakText,
        ' ',
        topScoresText,
        'Something went wrong with scoreboard provider',
      ];
    }
  }

  createLabel(text: string, name: string, settings?: LabelSettings) {
    let xPos = 0;
    let yPos = 0;
    if (settings) {
      xPos = settings.xPos ?? xPos;
      yPos = settings.yPos ?? yPos;
    }
    const bgRect = this.parentScene.rexUI.add.roundRectangle(0, 0, 0, 0, 20);
    const wordtext = new Word(
      this.parentScene,
      0,
      0,
      text,
      settings?.color ?? 'white',
      true,
      '50px'
    );
    wordtext.setOrigin(0.5, 0.5);
    this.add(wordtext);
    this.add(bgRect);
    const label = this.parentScene.rexUI.add
      .label({
        x: xPos,
        y: yPos,
        background: bgRect,
        text: wordtext,
        name,
        align: 'center',
        space: {
          left: 50,
          right: 50,
          top: 10,
          bottom: 10,
        },
      })
      .fadeIn(1000, 1);
    return label;
  }

  handleOverButton(button: Label) {
    const roundRect = button.getElement('background') as RoundRectangle;
    roundRect.setStrokeStyle(1, 0x3f95b0);
  }

  handleOutButton(button: Label) {
    const roundRect = button.getElement('background') as RoundRectangle;
    roundRect.setStrokeStyle();
  }

  toggleLoginbutton(isVisibile: boolean) {
    if (isVisibile) {
      this.buttonsContainer.showButton(this.loginWithButton);
    } else {
      this.buttonsContainer.hideButton(this.loginWithButton);
    }
    this.buttonsContainer.layout();
  }
}
