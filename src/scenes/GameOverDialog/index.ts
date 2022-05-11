import Phaser from 'phaser';
import SceneKeys from '../../game/utils/SceneKeys';
import TFBaseScene from '../TFBaseScene';
import { getLeaderboardScores, submitScore } from '../../game/playfab/leaderboard';
import { matrixRain } from '../GameStartDialog/matrixRain';
// import { getPlayerName } from '../../game/playfab';

export default class GameOverDialogScene extends TFBaseScene {
  constructor() {
    super(SceneKeys.GameOverDialog);
  }

  async getScoreboard() {
    const yourScore = this.getPlayerData().data.currentScore;
    const yourLongestStreak = this.getPlayerData().data.longestStreak;
    // const userName = getPlayerName();
    const yourScoreText = `YOUR SCORE ${yourScore}`;
    const yourStreakText = `YOUR LONGEST STREAK: ${yourLongestStreak}`;
    const topScoresText = 'TOP SCORES:';
    try {
      const scoreSubmitted = await submitScore();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (scoreSubmitted === 200) {
        const scoreBoard = (await getLeaderboardScores()) as any;
        const scoreboardText = scoreBoard.Leaderboard.map(
          (player: { Position: number; StatValue: number; DisplayName: number }) =>
            `${player.Position + 1}. |${player.StatValue} ➡ ${player.DisplayName}`
        );
        return [
          yourScoreText,
          yourStreakText,
          ' ',
          topScoresText,
          '-----------------------------',
          ...scoreboardText,
        ];
      }
    } catch (e) {
      return [
        yourScoreText,
        yourStreakText,
        ' ',
        topScoresText,
        'Something went wrong with scoreboard provider',
      ];
    }
    return [];
  }

  create() {
    this.events.on('game-over', async () => {
      this.sound.play('mistype', {
        volume: 0.2,
      });
      this.sound.stopByKey('bgm');
      this.cameras.main.shake(400, 0.007);
      this.scene.get(SceneKeys.BaseEvents).cameras.main.shake(400, 0.007);
      const rectangle = this.add.rectangle(0, 0, 3840, 2160, 0x000000);
      rectangle.setDepth(0);
      const xTeamLogo = this.add.image(1703, 203, 'x-team-logo');
      xTeamLogo.setDepth(0);
      xTeamLogo.setScale(0.7);
      const scoreb = await this.getScoreboard();
      const startDialog = this.createGameOverDialog(scoreb).setPosition(1000, 450);

      this.rexUI
        .modalPromise(startDialog, {
          manualClose: true,
          duration: {
            in: 700,
            out: 250,
          },
        })
        .then((result: Phaser.GameObjects.GameObject) => {
          if (result.name === 'game-reset') {
            // TODO: reload the game instead of refreshing page
            // this.events.emit('reset-game');
            // this.restartGame();
            location.reload();
          }
        });
    });
  }

  createGameOverDialog(scoreb: any[]) {
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

    const dialog = this.rexUI.add
      .dialog({
        title: this.rexUI.add.label({
          text: this.add.sprite(0, 0, 'game-over-logo'),
          space: {
            left: 50,
            right: 50,
            top: 10,
            bottom: 10,
          },
        }),
        actions: [this.createLabel('<Retry />', 'game-reset')],
        content: this.add.text(0, 0, scoreb, { fontSize: '40px' }),
        space: {
          title: 25,
          content: 25,
          action: 15,
          left: 20,
          right: 20,
          top: 300,
          bottom: 300,
        },
        align: {
          title: 'center',
          content: 'center',
          description: 'center',
          choices: 'center',
          actions: 'center',
        },
        expand: {
          content: false,
        },
      })
      .layout();

    dialog
      .on('button.click', function (button: { text: string; name: string }, index: number) {
        dialog.emit('modal.requestClose', {
          index: index,
          text: button.text,
          name: button.name,
        });
      })
      .on(
        'button.over',
        function (button: {
          getElement: (arg0: string) => {
            setStrokeStyle: {
              (arg0: number, color: number): void;
              new (): any;
            };
          };
        }) {
          button.getElement('background').setStrokeStyle(1, 0xffffff);
        }
      )
      .on(
        'button.out',
        function (button: {
          getElement: (element: string) => {
            setStrokeStyle: () => void;
          };
        }) {
          button.getElement('background').setStrokeStyle();
        }
      );
    dialog.setDepth(2);
    return dialog;
  }

  createLabel = (text: string, name: string, color?: string): any => {
    return this.rexUI.add.label({
      background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 20),
      text: this.add.text(0, 0, text, {
        fontSize: '40px',
        color: color ? color : 'white',
      }),
      name,
      space: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    });
  };

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
}
