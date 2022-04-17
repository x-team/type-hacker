import TFBaseScene from "../../scenes/TFBaseScene";
import { calculateScoreRequirementForLevel } from "./onScoreWin";

export const newLevel = ({ scene }: { scene: TFBaseScene }): number => {
  const currentScore = scene.getPlayerData().data.currentScore;
  const nextLevelScore = calculateScoreRequirementForLevel(
    scene.getPlayerData().data.currentLevel + 1
  );
  if (currentScore >= nextLevelScore) {
    return scene.getPlayerData().data.currentLevel + 1;
  }

  return scene.getPlayerData().data.currentLevel;
};
