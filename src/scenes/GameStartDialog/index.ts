// import { hasPlayerName } from '../../game/playfab';
import SceneKeys from '../../game/utils/SceneKeys';
import { checkIfMobile } from '../../mobileGame';
import TFBaseScene from '../TFBaseScene';
import { matrixRain } from './matrixRain';
import KioskBoard from 'kioskboard';
import { keyboardSettings } from '../../mobileGame/virtualKeyboard';
import { gamesHqUrl } from '../../api/utils';
import { StartMenu } from '../../game/entities/StartMenu';
import Label from 'phaser3-rex-plugins/templates/ui/label/Label';
import Word from '../../game/entities/Word';

export default class GameStartDialogScene extends TFBaseScene {
  private fadeInMenuTransition: number = 1500;
  private fadeOutMenuTransition: number = 800;
  private startMenuContainer!: StartMenu;

  constructor() {
    super(SceneKeys.GameStartDialog);
  }

  create() {
    const rectangle = this.add.rectangle(0, 0, 3840, 2160, 0x000000);
    rectangle.setDepth(0);
    const xTeamLogo = this.add.image(1750, 150, 'x-team-logo');
    xTeamLogo.setOrigin(0.5, 0);
    xTeamLogo.setDepth(0);
    xTeamLogo.setScale(0.7);

    this.createParticles();

    const { width } = this.game.canvas;
    const containerXPos = width / 2;
    const containerYPos = 150 + (xTeamLogo.height * xTeamLogo.scale) / 2;
    this.startMenuContainer = new StartMenu(
      this,
      containerXPos,
      containerYPos,
      // containerYPos - 100,
      this.handleClickButton
    );
    const userSession = this.getPlayerData().data.session;

    if (userSession.isLoggedIn) {
      this.scene.launch(SceneKeys.HUD);
    } else {
    }

    this.fadeInStartMenu();
  }

  createLabel(text: string, name: string, color?: string) {
    const bgRect = this.rexUI.add.roundRectangle(0, 0, 0, 0, 20);
    const wordtext = new Word(this, 0, 0, text, color ? color : 'white', true, '60px');
    wordtext.setOrigin(0.5, 0.5);
    const label = this.rexUI.add
      .label({
        x: 400,
        y: 200,
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
    return label;
  }

  createParticles() {
    const particle = this.add.particles('matrix-font');

    particle.createEmitter({
      alpha: { start: 1, end: 0.25, ease: 'Expo.easeOut' },
      angle: 0,
      blendMode: 'ADD',
      emitZone: { source: matrixRain, type: 'edge', quantity: 32000 },
      frame: Phaser.Utils.Array.NumberArray(8, 58),
      frequency: 100, // 100
      lifespan: 2000, // 6000
      quantity: 200, // 25
      scale: -0.5,
      tint: 0x42defd,
    });
    particle.setDepth(1);
  }

  loginToXTU() {
    window.open(
      gamesHqUrl + '/general/login/google',
      'popup',
      'width=600,height=600,scrollbars=no,resizable=no'
    );
    const receivePostMessage = async (event: MessageEvent<any>) => {
      // IMPORTANT: check the origin of the data!
      if (event.origin.startsWith(gamesHqUrl)) {
        console.log(event.data);
        const session = event.data;
        localStorage.setItem('session', JSON.stringify(session));
        await this.shutDownAndStartGame();
      } else {
        // The data was NOT sent from your site!
        // Be careful! Do not use it. This else branch is
        // here just for clarity, you usually shouldn't need it.
        return;
      }
      window.removeEventListener('message', receivePostMessage);
    };
    window.addEventListener('message', receivePostMessage);
  }

  startGame() {
    const usernameInputContainer = document.getElementById('#username-input-container');
    if (usernameInputContainer) {
      usernameInputContainer.style.visibility = 'hidden';
    }
    this.cameras.main.fadeOut(250, 0, 0, 0);
    this.time.delayedCall(250, async () => {
      await this.shutDownAndStartGame();
      if (checkIfMobile()) {
        renderVirtualKeyboard();
      }
    });
  }

  async shutDownAndStartGame() {
    this.sound.play('bgm', {
      loop: true,
      volume: 0.08,
    });
    const userSession = this.getPlayerData().data.session;
    await this.checkAvailableSession();
    if (userSession.isLoggedIn) {
      this.scene.launch(SceneKeys.HUD);
    }
    this.scene.stop(SceneKeys.GameStartDialog);
    this.scene.start(SceneKeys.Panels);
    this.scene.start(SceneKeys.Score);
    this.scene.start(SceneKeys.NewLevel);
    this.scene.start(SceneKeys.Keyboards);
    this.scene.start(SceneKeys.GameOverDialog);
    this.scene.start(SceneKeys.DamageMonitor);
  }

  handleClickButton(button: Label) {
    switch (button.name) {
      case 'game-xtu-login':
        this.loginToXTU();
        break;
      case 'game-start':
        this.startGame();
        break;
      case 'how-to-play':
        this.fadeOutStartMenu();
        this.startMenuContainer.toggleMainMenu(false, this.getPlayerData().data.session.isLoggedIn);
        this.startMenuContainer.toggleHowToPlay(true);
        this.fadeInStartMenu();
        break;
      case 'game-main-menu':
        this.fadeOutStartMenu();
        this.startMenuContainer.toggleMainMenu(true, this.getPlayerData().data.session.isLoggedIn);
        this.startMenuContainer.toggleHowToPlay(false);
        this.fadeInStartMenu();
        break;
    }
  }

  fadeInStartMenu() {
    this.tweens.add({
      targets: this.startMenuContainer,
      alpha: {
        from: 0,
        to: 1,
      },
      duration: this.fadeInMenuTransition,
    });
  }

  fadeOutStartMenu() {
    this.tweens.add({
      targets: this.startMenuContainer,
      alpha: {
        from: 1,
        to: 0,
      },
      duration: this.fadeOutMenuTransition,
    });
  }
}

const renderVirtualKeyboard = () => {
  KioskBoard.run('#virtual-keyboard', keyboardSettings);
  const selectElement = document.querySelector('#virtual-keyboard') as HTMLInputElement;
  selectElement.style.display = 'inline-block';
  selectElement?.focus();
  selectElement.style.display = 'none';
};
