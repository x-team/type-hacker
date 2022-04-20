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
          this.scene.start(SceneKeys.DamageMonitor);
        }
      });
  }

  createStartDialog() {
    const dialog = this.rexUI.add
      .dialog({
        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x2b11c1),
        title: this.rexUI.add.label({
          background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x020e31),
          text: this.add.text(0, 0, 'Type Fighters', {
            fontSize: '50px',
          }),
          space: {
            left: 50,
            right: 50,
            top: 10,
            bottom: 10,
          },
        }),

        content: this.add.text(0, 0, 'Do you want to try?', {
          fontSize: '34px',
        }),
        actions: [this.createLabel('Yes', 'yes')],
        space: {
          title: 25,
          content: 25,
          action: 15,
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
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
      background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x020e31),
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
