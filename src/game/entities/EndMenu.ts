import Buttons from 'phaser3-rex-plugins/templates/ui/buttons/Buttons';
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle';
import Label from 'phaser3-rex-plugins/templates/ui/label/Label';
import TFBaseScene from '../../scenes/TFBaseScene';
import Word from './Word';
import { getHighestScores, submitScore } from '../../api/leaderboard';
import GridSizer from 'phaser3-rex-plugins/templates/ui/gridsizer/GridSizer';
import { TopScoreContainer } from './TopScoresContainer';
import Sizer from 'phaser3-rex-plugins/templates/ui/sizer/Sizer';

interface LabelSettings {
  xPos?: number;
  yPos?: number;
  color?: string;
}

interface GridItemConfig {
  column?: number | undefined;
  row?: number | undefined | true;
  align?: GridSizer.AlignTypes;
  padding?: GridSizer.PaddingTypes;
  expand?: boolean;
  key?: string;
}

interface PaddingConfig {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export class EndMenu extends Sizer {
  private static basePadding: PaddingConfig = { top: 0, bottom: 0, left: 0, right: 0 };

  private parentScene: TFBaseScene;

  // MAIN MENU
  private mainTextLabel: Label;

  private loginWithButton: Label;
  private retryGameButton: Label;

  private buttonsContainer: Buttons;

  // TOP SCORES
  private topScoreContainer: GridSizer;

  constructor(scene: TFBaseScene, x: number, y: number, handleClickFunc: Function) {
    super(scene, x, y, { orientation: 'y' });
    this.setOrigin(0.5, 0);

    this.parentScene = scene;

    // MAIN TEXT
    const mainTextText = scene.add.sprite(0, 0, 'game-over-logo');
    mainTextText.setScale(1.5);
    this.mainTextLabel = scene.rexUI.add
      .label({
        y: 0,
        height: mainTextText.height * mainTextText.scale,
        text: mainTextText,
        space: EndMenu.basePadding,
      })
      .fadeIn(1000, 1);

    this.add(this.mainTextLabel, {
      align: 'center',
      padding: EndMenu.basePadding,
    });

    // BUTTONS
    this.loginWithButton = this.createLabel('< Login with XTU />', 'game-xtu-login');

    this.retryGameButton = this.createLabel('< Retry />', 'game-start');

    this.buttonsContainer = scene.rexUI.add.buttons({
      x: 0,
      y: 0,
      // width: 400,
      orientation: 'x',
      align: 'center',
      buttons: [this.loginWithButton, this.retryGameButton],
      space: {
        left: 10,
        right: 10,
        top: 5,
        bottom: 5,
        // item: 10,
      },
      expand: true,
    });

    // EVENTS
    this.buttonsContainer.on('button.over', this.handleOverButton);
    this.buttonsContainer.on('button.out', this.handleOutButton);
    this.buttonsContainer.on('button.click', handleClickFunc, scene);
    this.add(this.buttonsContainer);

    const isUserloggedIn = scene.getPlayerData().data.session.isLoggedIn;
    this.toggleLoginbutton(!isUserloggedIn);

    // TOP SCORES
    this.topScoreContainer = scene.rexUI.add.gridSizer({
      x: 0,
      y: 0,
      height: 800,
      width: 800,
      row: 5,
      column: 1,
      rowProportions: 0,
      columnProportions: 1,
      space: {
        top: 0,
        bottom: 0,
        row: 2,
      },
    });

    this.add(this.topScoreContainer);
    this.layout();
    // To draw the box container
    // this.drawBounds(scene.add.graphics(), 0xff0000);
    scene.add.existing(this);
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

    const yourScoreText = new Word(
      this.parentScene,
      0,
      0,
      `YOUR SCORE: ${yourScore}`,
      'white',
      true,
      '60px'
    );
    const yourStreakText = new Word(
      this.parentScene,
      0,
      0,
      `YOUR LONGEST STREAK: ${yourLongestStreak}`,
      'white',
      true,
      '60px'
    );
    const topScoresText = new Word(this.parentScene, 0, 0, 'TOP SCORES', 'white', true, '60px');
    const dividerText = new Word(
      this.parentScene,
      0,
      0,
      '------------------------------------',
      'white',
      true,
      '60px'
    );

    // Basic Item Config
    const gridItemConfig: GridItemConfig = {
      row: 0,
      align: 'left',
      padding: EndMenu.basePadding,
    };

    this.topScoreContainer.add(yourScoreText, {
      ...gridItemConfig,
      row: 0,
    });
    this.topScoreContainer.add(yourStreakText, {
      ...gridItemConfig,
      row: 1,
    });
    this.topScoreContainer.add(topScoresText, {
      padding: {
        ...EndMenu.basePadding,
        top: 30,
      },
      row: 2,
      align: 'center',
    });
    this.topScoreContainer.add(dividerText, {
      ...gridItemConfig,
      row: 3,
      align: 'center',
    });
    try {
      const scoreBoard = await getHighestScores();
      const scoreboardText = scoreBoard.map(
        ({ displayName, email, score }, index) =>
          `${index + 1}. | ${score} ➡ ${displayName ?? email}`
      );

      const topScoresEntity = new TopScoreContainer(this.parentScene, 0, 0, scoreboardText);
      this.topScoreContainer.add(topScoresEntity, {
        ...gridItemConfig,
        row: 4,
        align: 'center',
      });
      this.layout();
    } catch (e) {
      const fallbackText = new Word(
        this.parentScene,
        0,
        0,
        'Something went wrong with scoreboard provider',
        'white',
        true,
        '60px'
      );
      console.error(e);
      this.topScoreContainer.add(fallbackText, {
        ...gridItemConfig,
        row: 3,
        align: 'center',
      });
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
          top: 5,
          bottom: 5,
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
