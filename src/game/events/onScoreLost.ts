import TFBaseScene from "../../scenes/TFBaseScene";
import SceneKeys from "../utils/SceneKeys";

// TODO: Apparently not being used. Please double-check
const onScoreLost = ({
  scene,
  score,
}: {
  scene: TFBaseScene;
  score: number;
}) => {
  scene.scene.get(SceneKeys.Score).events.emit("update-score", { score });
};

export default onScoreLost;
