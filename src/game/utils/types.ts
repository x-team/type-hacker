export type TMonitorsNames = "left" | "center" | "right";

export interface LevelProgressionFunction {
  speedOfGrowth: number;
  stabilizer: number;
  amplitude: number;
}

export type TMonitorConfiguration = {
  isDamaged: boolean;
  timeout: number;
  userWord: string;
  guessWord: string;
  timeoutLostPoints: number;
  timeoutLostPointsForDamagedMonitor: number;
  rightKeyStrokeWinPoints: number;
  rightKeyStrokeWinPointsForDamagedMonitor: number;
  comboWinPoints: number;
  comboWinPointsForDamagedMonitor: number;
  wrongKeyStrokeLostPoints: number;
  wrongKeyStrokeLostPointsForDamagedMonitor: number;
};

export type TMonitorCoordinates = {
  topLeft: Phaser.Math.Vector2;
  topRight: Phaser.Math.Vector2;
  bottomLeft: Phaser.Math.Vector2;
  bottomRight: Phaser.Math.Vector2;
  clockX: number;
  clockY: number;
  clockRadiusX: number;
  clockRadiusY: number;
  smokeX: number;
  smokeY: number;
  userWordX: number;
  userWordY: number;
  guessWordX: number;
  guessWordY: number;
};

export type TMonitorData = {
  isDamaged: boolean;
  isBurning: boolean; // used to trigger animation once for performance reasons
  isTimoutAfterFirstdamaged: boolean;
  currentTimeout: number;
  totalCurrentTimeout: number; // refers to the total timeout before substracting time
  currentUserWord: string;
  currentGuessWord: string;
  userText?: Phaser.GameObjects.Text;
  guessText?: Phaser.GameObjects.Text;
  name: TMonitorsNames;
  coordinates: TMonitorCoordinates;
};

export type LevelSettings = {
  levelNumber: number;

  /** Word Length modifiers */
  wordLength: {
    minLength: number;
    randomLengthAddMin: number;
    randomLengthAddMax: number;
    randomLengthSubMin: number;
    randomLengthSubMax: number;
  };
  monitorConfiguration: TMonitorConfiguration;
  levelProgressionParams: LevelProgressionFunction;
};

export type PlayerDataConfiguration = {
  score: number;
  level: number;
  combo: number;
  levelSettings: LevelSettings;
  pointsPerLevel: {
    maxWordLenght: number;
    score: number;
    monitorSecondLost: number;
    keystrokeWon: number;
    keystrokeLost: number;
    finishWordBonus: number;
    comboBonus: number;
    maxCombo: number;
    monitors: {
      left?: TMonitorConfiguration;
      center?: TMonitorConfiguration;
      right?: TMonitorConfiguration;
    };
  }[];
};

export type PlayerDataData = {
  currentLevel: number;
  isFocusingOnWord: boolean;
  currentFocusedGuessWord?: string;
  currentWordsDisplayed: string[];
  currentMonitor: TMonitorsNames;
  currentCharacterStreak: number;
  currentScoreMultiplier: number;
  currentScore: number;
  isGameOver: boolean;
  monitors: {
    left: TMonitorData;
    center: TMonitorData;
    right: TMonitorData;
  };
};

export type PlayerDataSettings = {
  soundEnabled: boolean;
};

export type PlayerDataHelpers = {
  getNextWord: ({
    levelSettings,
    guessWord,
    userWord,
  }: {
    levelSettings: LevelSettings;
    guessWord?: Phaser.GameObjects.Text;
    userWord?: Phaser.GameObjects.Text;
  }) => void;
};

export type PlayerData = {
  settings: PlayerDataSettings;
  configuration: PlayerDataConfiguration;
  data: PlayerDataData;
  helpers: PlayerDataHelpers;
};
