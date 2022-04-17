import Graphics from "../../game/entities/Graphics";
import Word from "../../game/entities/Word";
import SceneKeys from "../../game/utils/SceneKeys";
import TFBaseScene from "../TFBaseScene";

export default class NewLevelScene extends TFBaseScene {
  constructor() {
    super(SceneKeys.NewLevel);
  }

  create() {
    const startingNewLevelWordY = 400;
    const newLevelWord = new Word(
      this,
      977,
      startingNewLevelWordY,
      "Level X",
      "#FDFDFD",
      false,
      "92px",
      true
    ).setOrigin(0.5);
    newLevelWord.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
    newLevelWord.setDepth(101);

    const blackBackground = new Graphics(this as Phaser.Scene, 0, 0);
    blackBackground.fillStyle(0x000000, 1);
    blackBackground.fillRect(0, 0, 9999, 9999);
    blackBackground.setDepth(100);
    blackBackground.setAlpha(0);

    this.events.on(
      "level-end",
      async ({ skipAnimations }: { skipAnimations?: boolean }) => {
        this.scene.get(SceneKeys.Panels).events.emit("level-end");
        this.scene.get(SceneKeys.Keyboards).events.emit("level-end");
        if (skipAnimations) {
          this.scene.get(SceneKeys.Score).events.emit("new-level-start");
          return;
        }
        newLevelWord.setText(`Level ${this.getPlayerData().data.currentLevel}`);
        newLevelWord.setY(newLevelWord.y - 60);
        newLevelWord.setAlpha(0);
        newLevelWord.setVisible(true);

        const newLevelWordTimeline = this.tweens.createTimeline();

        newLevelWordTimeline.add({
          targets: [newLevelWord],
          y: {
            from: newLevelWord.y,
            to: newLevelWord.y + 60,
          },
          duration: 600,
          alpha: {
            from: 0,
            to: 1,
          },
          ease: "cubic.inout",
        });
        newLevelWordTimeline.add({
          targets: [newLevelWord],
          y: {
            from: newLevelWord.y + 60,
            to: newLevelWord.y + 120,
          },
          duration: 600,
          alpha: {
            from: 1,
            to: 0,
          },
          ease: "cubic.inout",
          delay: 900,
        });

        newLevelWordTimeline.play();

        const blackBackgroundTimeline = this.tweens.createTimeline();

        blackBackgroundTimeline.add({
          targets: [blackBackground],
          duration: 600,
          alpha: {
            from: 0,
            to: 0.5,
          },
          ease: "cubic.inout",
        });
        blackBackgroundTimeline.add({
          targets: [blackBackground],
          duration: 600,
          alpha: {
            from: 0.5,
            to: 0,
          },
          ease: "cubic.inout",
          delay: 1600,
        });
        blackBackgroundTimeline.play();

        setTimeout(() => {
          this.scene.get(SceneKeys.Keyboards).events.emit("new-level-start");
          this.scene.get(SceneKeys.Panels).events.emit("new-level-start");
          this.scene.get(SceneKeys.Score).events.emit("new-level-start");
          newLevelWord.setY(startingNewLevelWordY);
        }, 2800);
      }
    );
  }
}
