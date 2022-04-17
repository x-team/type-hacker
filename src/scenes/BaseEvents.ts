import Background from "../game/entities/Background";
import onDamageMonitor from "../game/events/onDamageMonitor";
import onScoreWin from "../game/events/onScoreWin";
import SceneKeys from "../game/utils/SceneKeys";
import { TMonitorData, TMonitorsNames } from "../game/utils/types";
import TFBaseScene from "./TFBaseScene";

export default class BaseEventsScene extends TFBaseScene {
  constructor() {
    super(SceneKeys.BaseEvents);
  }

  create() {
    this.prepareEvents();
    this.addBackground();
  }

  prepareEvents() {
    // GENERAL EVENTS
    this.events.on(
      "damage-monitor",
      ({ monitorToBeDamaged }: { monitorToBeDamaged: TMonitorsNames }) => {
        onDamageMonitor({ scene: this, monitorToBeDamaged });
      }
    );

    this.events.on(
      "score-win",
      ({
        scoreIncrement,
        combo,
        monitorData,
      }: {
        scoreIncrement: number;
        combo: number;
        monitorData: TMonitorData;
      }) => {
        onScoreWin({
          scene: this,
          scoreIncrement,
          combo,
          monitorData,
        });
      }
    );

    // this.events.on("score-lost", (score: number) => {
    //   onScoreLost({ scene: this, score });
    // });

    this.events.on("game-over", () => {
      console.log("game over dude");
      this.getPlayerData().data.isGameOver = true;
      this.scene.get(SceneKeys.Smoke).events.emit("game-over");
    });

    this.events.on("reset-game", () => {
      this.restartPlayerData();
      this.scene
        .get(SceneKeys.NewLevel)
        .events.emit("level-end", { skipAnimations: true });
    });
  }

  addBackground = () => {
    new Background(this, 0, 0, "hacker-background", {
      isGif: true,
    });
  };
}
