import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle';
import Buttons from 'phaser3-rex-plugins/templates/ui/buttons/Buttons';
import Label from 'phaser3-rex-plugins/templates/ui/label/Label';
import Sizer from 'phaser3-rex-plugins/templates/ui/sizer/Sizer';
import { isProd } from '../../config';
import TFBaseScene from '../../scenes/TFBaseScene';
import Word from './Word';

interface LabelSettings {
  xPos?: number;
  yPos?: number;
  color?: string;
}

interface PaddingConfig {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export class StartMenu extends Sizer {
  private static basePadding: PaddingConfig = { top: 0, bottom: 0, left: 0, right: 0 };

  private parentScene: TFBaseScene;

  // MAIN MENU
  private mainTextLabel: Label;

  // private loginWithButton: Label;
  private startGameButton: Label;
  private howToPlayButton: Label;

  private buttonsContainer: Buttons;

  // HOW TO PLAY
  public static moveHowToPlayYPos: number = 150;
  private howToPlayLabel: Label;

  private goBackToMainMenuButton: Label;

  constructor(scene: TFBaseScene, x: number, y: number, handleClickFunc: Function) {
    super(scene, x, y, { orientation: 'y' });
    this.setOrigin(0.5, 0);
    this.parentScene = scene;
    // MAIN TEXT
    const mainTextText = scene.add.sprite(0, 0, 'type-hacker-logo');
    mainTextText.setScale(1.5);
    this.mainTextLabel = scene.rexUI.add.label({
      y: 0,
      // height: mainTextText.height * mainTextText.scale,
      text: mainTextText,
      space: StartMenu.basePadding,
    });

    this.add(this.mainTextLabel, {
      align: 'center',
      padding: StartMenu.basePadding,
    });

    // HOW TO PLAY TEXT
    const howToPlay = new Word(
      scene,
      0,
      0,
      [
        '1. Type the word you see on screen',
        '2. Chain correct characters to start the score multiplier',
        '3. You lose your streak if you mistype a word',
        '4. Computers will autofocus on the word you begin typing',
        '5. You lose lives if the timer expires on a monitor',
        '6. Each monitor only has 2 lives',
      ],
      'white',
      true,
      '50px'
    );
    howToPlay.setAlign('left');
    this.howToPlayLabel = scene.rexUI.add.label({
      y: 0,
      text: howToPlay,
    });
    this.add(this.howToPlayLabel);
    this.hide(this.howToPlayLabel);

    // BUTTONS
    const buttons: Label[] = [];
    this.startGameButton = this.createLabel('< New Game />', 'game-start');
    this.howToPlayButton = this.createLabel('<? How to play ?>', 'how-to-play', {
      color: '#FC973F',
    });
    this.goBackToMainMenuButton = this.createLabel('< Go Back />', 'game-main-menu');
    // this.loginWithButton = this.createLabel('< Login with XTU />', 'game-xtu-login');
    // buttons.push(this.loginWithButton);
    buttons.push(this.startGameButton);
    buttons.push(this.howToPlayButton);
    buttons.push(this.goBackToMainMenuButton);

    this.buttonsContainer = scene.rexUI.add.buttons({
      x: 0,
      y: 0,
      // width: 400,
      orientation: 'y',
      align: 'center',
      buttons,
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

    this.layout();
    scene.add.existing(this);

    // DEFAULT MENU
    this.toggleMainMenu(true, scene.getPlayerData().data.session.isLoggedIn);
    this.toggleHowToPlay(false);
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
      '60px'
    );
    wordtext.setOrigin(0.5, 0.5);
    const label = this.parentScene.rexUI.add
      .label({
        x: 0,
        y: 0,
        background: bgRect,
        align: 'center',
        text: wordtext,
        name,
        space: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      })
      .fadeIn(1000, 1);
    return label;
  }

  handleOverButton(button: Label) {
    const roundRect = button.getElement('background') as RoundRectangle;
    roundRect.setStrokeStyle(1, 0xfc973f);
  }

  handleOutButton(button: Label) {
    const roundRect = button.getElement('background') as RoundRectangle;
    roundRect.setStrokeStyle();
  }

  toggleMainMenu(isVisible: boolean, isLoggedIn: boolean) {
    // this.buttonsContainer.hideButton(this.loginWithButton);
    if (isVisible) {
      this.show(this.mainTextLabel);
      this.buttonsContainer.showButton(this.howToPlayButton);
      this.buttonsContainer.hideButton(this.goBackToMainMenuButton);
      this.buttonsContainer.showButton(this.howToPlayButton);
    } else {
      this.buttonsContainer.hideButton(this.goBackToMainMenuButton);
      this.buttonsContainer.showButton(this.howToPlayButton);
      this.hide(this.mainTextLabel);
      this.buttonsContainer.hideButton(this.howToPlayButton);
    }
    this.show(this.startGameButton);
    this.toggleLoginbutton(isLoggedIn);
    this.layout();
  }

  toggleHowToPlay(isVisible: boolean) {
    if (isVisible) {
      this.show(this.howToPlayLabel);
      this.buttonsContainer.showButton(this.goBackToMainMenuButton);
      this.buttonsContainer.hideButton(this.howToPlayButton);
    } else {
      this.buttonsContainer.hideButton(this.goBackToMainMenuButton);
      this.hide(this.howToPlayLabel);
      this.buttonsContainer.showButton(this.howToPlayButton);
    }
    this.layout();
  }

  toggleLoginbutton(isLoggedIn: boolean) {
    if (isProd()) {
      return;
    }
    if (isLoggedIn) {
      // this.buttonsContainer.hideButton(this.loginWithButton);
    } else {
      // this.buttonsContainer.showButton(this.loginWithButton);
    }
  }
}
