import SceneKeys from "../../game/utils/SceneKeys";
import { TMonitorsNames } from "../../game/utils/types";
import TFBaseScene from "../TFBaseScene";

// const keyCode = {
//   bottom: 36,
//   left: 37,
//   top: 38,
//   right: 39,
// };

const nextScreen = (scene: TFBaseScene) => {
  const getNextRightScreen = (monitor: TMonitorsNames): TMonitorsNames => {
    const { left, center, right } =
      scene.getPlayerData().configuration.pointsPerLevel[
        scene.getPlayerData().data.currentLevel - 1
      ].monitors;

    if (monitor === "left") {
      if (center) return "center";
      if (right) return "right";
      if (left) return "left";
    }
    if (monitor === "center") {
      if (right) return "right";
      if (left) return "left";
      if (center) return "center";
    }
    if (monitor === "right") {
      if (left) return "left";
      if (center) return "center";
      if (right) return "right";
    }

    return monitor;
  };

  scene.getPlayerData().data.currentMonitor = getNextRightScreen(
    scene.getPlayerData().data.currentMonitor
  );
};

const prevScreen = (scene: TFBaseScene) => {
  const getNextLeftScreen = (monitor: TMonitorsNames): TMonitorsNames => {
    const { left, center, right } =
      scene.getPlayerData().configuration.pointsPerLevel[
        scene.getPlayerData().data.currentLevel - 1
      ].monitors;

    if (monitor === "left") {
      if (right) return "right";
      if (center) return "center";
      if (left) return "left";
    }
    if (monitor === "center") {
      if (left) return "left";
      if (right) return "right";
      if (center) return "center";
    }
    if (monitor === "right") {
      if (center) return "center";
      if (left) return "left";
      if (right) return "right";
    }

    return monitor;
  };

  scene.getPlayerData().data.currentMonitor = getNextLeftScreen(
    scene.getPlayerData().data.currentMonitor
  );
};

export const onKeyTabDown = ({
  scene,
  event,
}: {
  scene: TFBaseScene;
  event: { shiftKey: boolean };
}) => {
  if (event.shiftKey) {
    prevScreen(scene);
  } else {
    nextScreen(scene);
  }

  scene.scene.get(SceneKeys.Panels).events.emit("update-currentMonitor");
};
