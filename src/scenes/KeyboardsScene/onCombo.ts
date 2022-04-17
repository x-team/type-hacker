import Phaser from "phaser";

export const getMaxComboPerLevel = (_level: number) => {
  return 30;
};

// TODO: Apparently not nbeing used. Please double-check
const onCombo = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentTime,
  userWord,
}: {
  currentTime: number;
  userWord: Phaser.GameObjects.Text;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentTime = 10;
  userWord.setText("");
};

export default onCombo;
