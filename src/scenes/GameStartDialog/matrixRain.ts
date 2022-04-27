export const matrixRain = {
  startingPoint: 0, // 30
  width: 120, // Fullscreen width
  height: 70, // Fullscreen height
  cellWidth: 16, //16
  cellHeight: 16, //16
  spacingXMultiplier: 16, // 16
  spacingYMultiplier: 16, // 16
  getPoints: function (quantity: number) {
    const cols = new Array(matrixRain.width).fill(0);
    const lastCol = cols.length - 1;
    const Between = Phaser.Math.Between;
    const RND = Phaser.Math.RND;
    const points = [];

    for (let i = 0; i < quantity; i++) {
      const col = Between(matrixRain.startingPoint, lastCol);
      let row = (cols[col] += 1);

      if (RND.frac() < 0.01) {
        row *= RND.frac();
      }

      row %= matrixRain.height;
      row |= 0;

      points[i] = new Phaser.Math.Vector2( // spacing between letters
        matrixRain.spacingXMultiplier * col,
        matrixRain.spacingYMultiplier * row
      );
    }
    return points;
  },
};
