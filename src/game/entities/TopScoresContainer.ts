import ScrollablePanel from 'phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel';
import TFBaseScene from '../../scenes/TFBaseScene';
import Word from './Word';

export class TopScoreContainer extends ScrollablePanel {
  constructor(scene: TFBaseScene, x: number, y: number, scoreboardText: string[]) {
    const sizer = TopScoreContainer.createTopScoresSizer(scene, scoreboardText);
    const { tracker, thumbnail } = TopScoreContainer.createSlider(scene);
    const topScoresPanelConfig: ScrollablePanel.IConfig = {
      x,
      y,
      width: 200,
      height: 400,

      scrollMode: 0,

      panel: {
        child: sizer,
        mask: {
          // padding: 1,
        },
      },

      slider: {
        track: tracker,
        thumb: thumbnail,
        // position: 'left',
      },

      mouseWheelScroller: {
        focus: false,
        speed: 0.1,
      },
      space: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    };
    super(scene, topScoresPanelConfig);
    this.setOrigin(0, 0);
    scene.add.existing(this);
  }

  private static createTopScoresSizer(scene: TFBaseScene, scoreboardText: string[]) {
    const sizer = scene.rexUI.add.fixWidthSizer({
      x: 0,
      y: 0,
      align: 'center',
      space: {
        left: 3,
        right: 3,
        top: 3,
        bottom: 3,
        // item: 2,
        // line: 8,
      },
    });
    for (let i = 0; i < scoreboardText.length; i += 1) {
      const scoreEntry = new Word(scene, 0, 0, scoreboardText[i], 'white', true, '60px');
      sizer.add(scoreEntry);
    }
    return sizer;
  }

  private static createSlider(scene: TFBaseScene) {
    const xPos = 0;
    const yPos = 0;

    const trackerWidth = 5;
    const trackerHeight = 10;
    const trackerRadius = 10;
    const tracker = scene.rexUI.add.roundRectangle(
      xPos,
      yPos,
      trackerWidth,
      trackerHeight,
      trackerRadius,
      0xf0f0f0,
      0.4
    );

    const thumbWidth = 0;
    const thumbHeight = 0;
    const thumbRadius = 10;
    const thumbnail = scene.rexUI.add.roundRectangle(
      xPos,
      yPos,
      thumbWidth,
      thumbHeight,
      thumbRadius,
      0xffffff
    );
    return { tracker, thumbnail };
  }
}
