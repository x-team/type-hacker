import SceneKeys from '../../game/utils/SceneKeys';
import TFBaseScene from '../TFBaseScene';

export default class GameStartDialogScene extends TFBaseScene {
  constructor() {
    super(SceneKeys.GameStartDialog);
  }

  create() {
    const startDialog = this.createStartDialog().setPosition(950, 450);

    this.rexUI
      .modalPromise(startDialog, {
        manualClose: true,
        duration: {
          in: 500,
          out: 500,
        },
      })
      .then((result: Phaser.GameObjects.GameObject) => {
        if (result.name === 'yes') {
          this.sound.play('bgm', {
            loop: true,
            volume: 0.08,
          });
          this.scene.start(SceneKeys.Score);
          this.scene.start(SceneKeys.NewLevel);
          this.scene.start(SceneKeys.Keyboards);
          this.scene.start(SceneKeys.Panels);
          this.scene.start(SceneKeys.GameOverDialog);
          this.scene.start(SceneKeys.Smoke);
        }
      });
  }

  createStartDialog() {
    const codeRain = {
      startingPoint: 0, // 30
      width: 120, // Fullscreen width
      height: 70, // Fullscreen height
      cellWidth: 16, //16
      cellHeight: 16, //16
      spacingXMultiplier: 16, // 16
      spacingYMultiplier: 16, // 16
      getPoints: function (quantity: number) {
        const cols = new Array(codeRain.width).fill(0);
        const lastCol = cols.length - 1;
        const Between = Phaser.Math.Between;
        const RND = Phaser.Math.RND;
        const points = [];

        for (let i = 0; i < quantity; i++) {
          const col = Between(codeRain.startingPoint, lastCol);
          let row = (cols[col] += 1);

          if (RND.frac() < 0.01) {
            row *= RND.frac();
          }

          row %= codeRain.height;
          row |= 0;

          points[i] = new Phaser.Math.Vector2( // spacing between letters
            codeRain.spacingXMultiplier * col,
            codeRain.spacingYMultiplier * row
          );
        }
        console.log({ points });
        return points;
      },
    };
    this.add.particles('font').createEmitter({
      alpha: { start: 1, end: 0.25, ease: 'Expo.easeOut' },
      angle: 0,
      blendMode: 'ADD',
      emitZone: { source: codeRain, type: 'edge', quantity: 32000 },
      frame: Phaser.Utils.Array.NumberArray(8, 58),
      frequency: 100, // 100
      lifespan: 2000, // 6000
      quantity: 200, // 25
      scale: -0.5,
      tint: 0x42defd,
    });

    const dialog = this.rexUI.add
      .dialog({
        // background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x21879f),
        title: this.rexUI.add.label({
          // background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x42defd),
          text: this.add.sprite(0, 0, 'type-hacker-logo'),
          space: {
            left: 50,
            right: 50,
            top: 10,
            bottom: 10,
          },
        }),

        content: this.add.text(0, 0, 'New Game', {
          fontSize: '34px',
          color: '#42DEFD',
        }),
        actions: [this.createLabel('Start', 'yes')],
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

  createLabel = (text: string, name: string): any => {
    return this.rexUI.add.label({
      // background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x020e31),
      text: this.add.text(0, 0, text, {
        fontSize: '40px',
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
}
