import Phaser from 'phaser';
import SceneKeys from '../../game/utils/SceneKeys';
import TFBaseScene from '../TFBaseScene';
// import { getLeaderboardScores, submitScore } from '../../game/playfab/leaderboard';
import { matrixRain } from '../GameStartDialog/matrixRain';
import Label from 'phaser3-rex-plugins/templates/ui/label/Label';
import { gamesHqUrl } from '../../api/utils';
import { EndMenu } from '../../game/entities/EndMenu';
import Word from '../../game/entities/Word';
// import { getPlayerName } from '../../game/playfab';

export default class GameOverDialogScene extends TFBaseScene {
  private startMenuContainer!: EndMenu;

  constructor() {
    super(SceneKeys.GameOverDialog);
  }

  async create() {
    this.events.on('game-over', async () => {
      this.sound.play('mistype', {
        volume: 0.2,
      });
      this.sound.stopByKey('bgm');
      this.cameras.main.shake(400, 0.007);
      this.scene.get(SceneKeys.BaseEvents).cameras.main.shake(400, 0.007);
      const rectangle = this.add.rectangle(0, 0, 3840, 2160, 0x000000);
      rectangle.setDepth(0);
      const xTeamLogo = this.add.image(1750, 150, 'x-team-logo');
      xTeamLogo.setOrigin(0.5, 0);
      xTeamLogo.setDepth(0);
      xTeamLogo.setScale(0.7);

      this.createParticles();
      const { width, height } = this.game.canvas;
      const containerXPos = width / 2;
      const containerYPos = height / 2;
      this.startMenuContainer = new EndMenu(
        this,
        containerXPos,
        containerYPos - 100,
        this.handleClickButton
      );
      const topScores = await this.startMenuContainer.getScoreboard();
      const topScoresText = new Word(this, 0, 0, topScores, 'white', true, '60px');
      topScoresText.setOrigin(0.5, 0.5);
      topScoresText.setAlign('left');
      this.startMenuContainer.setTopScoreText(topScoresText);
      topScoresText.destroy();
    });
  }

  createParticles() {
    const particle = this.add.particles('matrix-font-salmon');

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
      // tint: 0xff668f,
    });
    particle.setDepth(1);
  }

  restartGame() {
    this.cameras.main.fadeOut(250, 0, 0, 0);
    this.time.delayedCall(250, () => {
      this.scene.stop(SceneKeys.Panels);
      this.scene.stop(SceneKeys.Score);
      this.scene.stop(SceneKeys.NewLevel);
      this.scene.stop(SceneKeys.Keyboards);
      this.scene.stop(SceneKeys.GameOverDialog);
      this.scene.stop(SceneKeys.DamageMonitor);
      this.scene.start(SceneKeys.GameStartDialog);
    });
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
        this.startMenuContainer.toggleLoginbutton(false);
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

  handleClickButton(button: Label) {
    switch (button.name) {
      case 'game-xtu-login':
        this.loginToXTU();
        break;
      case 'game-start':
        // TODO: reload the game instead of refreshing page
        // scene.events.emit('reset-game');
        // scene.restartGame();
        location.reload();
        break;
    }
  }
}
