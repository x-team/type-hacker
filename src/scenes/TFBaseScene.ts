import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import { FullPlayerData } from "../game/entities/FullPlayerData";
import SceneKeys from "../game/utils/SceneKeys";

export default class TFBaseScene extends Phaser.Scene {
  rexUI!: RexUIPlugin;
  playerData: FullPlayerData;

  baseEventsScene = (event: string, data?: any) =>
    this.scene.get(SceneKeys.BaseEvents).events.emit(event, data);

  constructor(key: string) {
    super({ key });
    this.playerData = FullPlayerData.getPlayerData();
  }

  restartPlayerData() {
    this.playerData = FullPlayerData.getPlayerData(true);
  }

  getPlayerData() {
    return FullPlayerData.getPlayerData();
  }
}
