import SceneKeys from "../../game/utils/SceneKeys";
import TFBaseScene from "../TFBaseScene";

const keyCode = {
  bottom: 36,
  left: 37,
  top: 38,
  right: 39,
};

const onKeyArrowDown = ({
  scene,
  event,
}: {
  scene: TFBaseScene;
  event: { keyCode: number };
}) => {
  if (event.keyCode === keyCode.left || event.keyCode === keyCode.right) {
    if (
      event.keyCode === keyCode.left &&
      scene.getPlayerData().data.currentMonitor === "center"
    ) {
      scene.getPlayerData().data.currentMonitor = "left";
    } else if (
      event.keyCode === keyCode.right &&
      scene.getPlayerData().data.currentMonitor === "center"
    ) {
      scene.getPlayerData().data.currentMonitor = "right";
    } else if (
      (event.keyCode === keyCode.right &&
        scene.getPlayerData().data.currentMonitor === "left") ||
      (event.keyCode === keyCode.left &&
        scene.getPlayerData().data.currentMonitor === "right")
    ) {
      scene.getPlayerData().data.currentMonitor = "center";
    }
    scene.scene.get(SceneKeys.Panels).events.emit("update-currentMonitor");
  }
};

export default onKeyArrowDown;
