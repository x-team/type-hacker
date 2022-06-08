import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle';
import Label from 'phaser3-rex-plugins/templates/ui/label/Label';
import TFBaseScene from '../../scenes/TFBaseScene';
import Word from './Word';

export class StartMenu extends Phaser.GameObjects.Container {
  private separationFactor: number = 100;
  private separationFactorStep: number = 100;

  private parentScene: TFBaseScene;

  // MAIN MENU
  private mainTextLabel: Label;

  private loginWithButton: Label;
  private startGameButton: Label;
  private howToPlayButton: Label;

  private buttonsContainer: Phaser.GameObjects.Container;

  // HOW TO PLAY
  public static moveHowToPlayYPos: number = 150;
  private howToPlayLabel: Label;

  private goBackToMainMenuButton: Label;

  constructor(scene: TFBaseScene, x: number, y: number, handleClickFunc: Function) {
    super(scene, x, y);

    this.parentScene = scene;
    // MAIN TEXT
    const mainTextText = scene.add.sprite(0, -30, 'type-hacker-logo');
    mainTextText.setScale(1.5);
    this.add(mainTextText);
    this.mainTextLabel = scene.rexUI.add.label({
      text: mainTextText,
    });
    this.mainTextLabel.setVisible(false);

    this.add(this.mainTextLabel);

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
    this.add(howToPlay);
    this.howToPlayLabel = scene.rexUI.add
      .label({
        y: -StartMenu.moveHowToPlayYPos,
        text: howToPlay,
      })
      .layout();
    this.howToPlayLabel.setVisible(false);

    this.add(this.howToPlayLabel);

    // BUTTONS
    this.buttonsContainer = new Phaser.GameObjects.Container(scene, 0, 0);

    this.loginWithButton = this.createLabel('< Login with XTU />', 'game-xtu-login');
    this.loginWithButton.setInteractive({ useHandCursor: true });
    this.loginWithButton.setVisible(false);
    this.startGameButton = this.createLabel('< New Game />', 'game-start');
    this.startGameButton.setInteractive({ useHandCursor: true });
    this.startGameButton.setVisible(false);
    this.howToPlayButton = this.createLabel('<? How to play ?>', 'how-to-play', '#FC973F');
    this.howToPlayButton.setInteractive({ useHandCursor: true });
    this.howToPlayButton.setVisible(false);
    this.goBackToMainMenuButton = this.createLabel('< Go Back />', 'game-main-menu');
    this.goBackToMainMenuButton.setPosition(this.goBackToMainMenuButton.x, this.loginWithButton.y);
    this.goBackToMainMenuButton.setInteractive({ useHandCursor: true });
    this.goBackToMainMenuButton.setVisible(false);

    // ADD BUTTONS TO BUTTON CONTAINER
    this.buttonsContainer.add(this.loginWithButton);
    this.buttonsContainer.add(this.startGameButton);
    this.buttonsContainer.add(this.howToPlayButton);
    this.buttonsContainer.add(this.goBackToMainMenuButton);

    this.add(this.buttonsContainer);
    scene.add.existing(this);

    // DEFAULT MENU
    this.toggleMainMenu(true, scene.getPlayerData().data.session.isLoggedIn);
    // this.toggleHowToPlay(true);

    // EVENTS
    this.loginWithButton.on('pointerover', this.handleOverButton.bind(this.loginWithButton));
    this.loginWithButton.on('pointerout', this.handleOutButton.bind(this.loginWithButton));
    this.loginWithButton.onClick(handleClickFunc.bind({ scene, button: this.loginWithButton }));

    this.startGameButton.on('pointerover', this.handleOverButton.bind(this.startGameButton));
    this.startGameButton.on('pointerout', this.handleOutButton.bind(this.startGameButton));
    this.startGameButton.onClick(handleClickFunc.bind({ scene, button: this.startGameButton }));

    this.howToPlayButton.on('pointerover', this.handleOverButton.bind(this.howToPlayButton));
    this.howToPlayButton.on('pointerout', this.handleOutButton.bind(this.howToPlayButton));
    this.howToPlayButton.onClick(handleClickFunc.bind({ scene, button: this.howToPlayButton }));

    this.goBackToMainMenuButton.on(
      'pointerover',
      this.handleOverButton.bind(this.goBackToMainMenuButton)
    );
    this.goBackToMainMenuButton.on(
      'pointerout',
      this.handleOutButton.bind(this.goBackToMainMenuButton)
    );
    this.goBackToMainMenuButton.onClick(
      handleClickFunc.bind({ scene, button: this.goBackToMainMenuButton })
    );
  }

  createLabel(text: string, name: string, color?: string) {
    const bgRect = this.parentScene.rexUI.add.roundRectangle(0, 0, 0, 0, 20);
    const wordtext = new Word(this.parentScene, 0, 0, text, color ? color : 'white', true, '60px');
    wordtext.setOrigin(0.5, 0.5);
    this.add(wordtext);
    this.add(bgRect);
    const label = this.parentScene.rexUI.add
      .label({
        x: 0,
        y: this.separationFactor,
        background: bgRect,
        text: wordtext,
        name,
        space: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      })
      .fadeIn(1000, 1)
      .layout();
    this.separationFactor += this.separationFactorStep;
    return label;
  }

  handleOverButton(this: Label) {
    const button = this;
    const roundRect = button.getElement('background') as RoundRectangle;
    roundRect.setStrokeStyle(1, 0xfc973f);
  }

  handleOutButton(this: Label) {
    const button = this;
    const roundRect = button.getElement('background') as RoundRectangle;
    roundRect.setStrokeStyle();
  }

  toggleMainMenu(isVisible: boolean, isLoggedIn: boolean) {
    this.mainTextLabel.setVisible(isVisible);
    this.loginWithButton.setVisible(!isLoggedIn);
    this.startGameButton.setVisible(true);
    this.howToPlayButton.setVisible(isVisible);
  }

  toggleHowToPlay(isVisible: boolean) {
    this.howToPlayLabel.setVisible(isVisible);
    this.goBackToMainMenuButton.setVisible(isVisible);
    this.startGameButton.setVisible(true);
  }

  toggleLoginbutton(isVisibile: boolean) {
    this.loginWithButton.setVisible(isVisibile);
  }
}
