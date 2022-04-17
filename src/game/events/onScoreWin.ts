import TFBaseScene from "../../scenes/TFBaseScene";
import { monitorConfiguration } from "../utils/consts";
import {
  calculateCurrentTimeout,
  generateLevelProgressionFunctionParams,
} from "../utils/generators";
import SceneKeys from "../utils/SceneKeys";
import { LevelSettings, TMonitorData } from "../utils/types";
import { newLevel } from "./onNewLevel";

export const calculateScoreRequirementForLevel = (level: number) => {
  if (level <= 1) {
    return 0;
  }
  /*
    Level Progression Function

    f(x) = Math.Floor( (A * ln(x + C)) + B );
    
    Where
    A: speed of growth between each level
    B: Amplitude between each level
    C: Stabilizer for the natural logarithm function
    ln: Natural Logarithm to start growing fast and stabilize in higher levels to slow down.

    Given f(x) = Y,
    
    x = Math.Ceil( Math.exp( ( Y - B ) / A ) - C )
    
    Where
    Y: A given level.
    x: The minimum score to get yo level "Y"
  */

  const levelProgressionParams = generateLevelProgressionFunctionParams();
  const A = levelProgressionParams.speedOfGrowth;
  const B = levelProgressionParams.amplitude;
  const C = levelProgressionParams.stabilizer;

  const eulerValue = Math.exp((level - B) / A);

  return Math.ceil(eulerValue - C);
};

export const calculateEnabledMonitors = (level: number) => {
  return {
    centerMonitorEnabled: true,
    leftMonitorEnabled: level >= 2,
    rightMonitorEnabled: level >= 5,
  };
};

const calculateLevelSettings = (level: number): LevelSettings => {
  return {
    levelNumber: level,
    wordLength: {
      minLength: 2 + Math.floor(level / 5),
      randomLengthAddMin: 0,
      randomLengthAddMax: 4,
      randomLengthSubMin: 0,
      randomLengthSubMax: Math.min(Math.floor(level / 15), 3),
    },
    monitorConfiguration,
    levelProgressionParams: generateLevelProgressionFunctionParams(),
  };
};

const onScoreWin = ({
  scene,
  scoreIncrement,
  combo,
  monitorData,
}: {
  scene: TFBaseScene;
  scoreIncrement: number;
  combo: number;
  monitorData: TMonitorData;
}) => {
  scene.scene.get(SceneKeys.Score).events.emit("update-score", {
    score: scoreIncrement,
    combo,
    monitorData,
  });
  const newLevelToUpdate = newLevel({ scene });
  if (scene.getPlayerData().data.currentLevel != newLevelToUpdate) {
    scene.getPlayerData().configuration.levelSettings.levelNumber++;
    const currentTimeout = calculateCurrentTimeout(scene.getPlayerData());

    scene.getPlayerData().data.monitors.left.currentTimeout = currentTimeout;
    scene.getPlayerData().data.monitors.center.currentTimeout = currentTimeout;
    scene.getPlayerData().data.monitors.right.currentTimeout = currentTimeout;

    // We need to update also the total current time
    // so we can calculate the completeWordSpeedCoefficient and the currentimeout on reset-clock
    scene.getPlayerData().data.monitors.left.totalCurrentTimeout =
      currentTimeout;
    scene.getPlayerData().data.monitors.center.totalCurrentTimeout =
      currentTimeout;
    scene.getPlayerData().data.monitors.right.totalCurrentTimeout =
      currentTimeout;

    scene.getPlayerData().configuration.levelSettings = calculateLevelSettings(
      scene.getPlayerData().configuration.levelSettings.levelNumber
    );
    scene.getPlayerData().data.currentLevel = newLevelToUpdate;
    scene.scene
      .get(SceneKeys.NewLevel)
      .events.emit("level-end", { skipAnimations: false });
  }
};

export default onScoreWin;
