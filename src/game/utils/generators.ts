import { monitorConfiguration } from './consts';
import {
  LevelProgressionFunction,
  PlayerData,
  TMonitorCoordinates,
  TMonitorData,
  TMonitorsNames,
} from './types';

function getStartingLevelTimeout() {
  // This only runs on the initial load
  return 10;
}

export function generatePlayerDataSeed(): PlayerData {
  return {
    settings: {
      soundEnabled: true,
    },
    configuration: {
      score: 0,
      level: 1,
      combo: 0,

      // Initial, level 1 settings:
      levelSettings: {
        levelNumber: 1,
        wordLength: {
          minLength: 2,
          randomLengthAddMin: 0,
          randomLengthAddMax: 4,
          randomLengthSubMin: 0,
          randomLengthSubMax: 0,
        },
        monitorConfiguration,
        levelProgressionParams: generateLevelProgressionFunctionParams(),
      },
      pointsPerLevel: [],
    },
    helpers: { getNextWord: () => null },
    data: {
      isFocusingOnWord: false,
      currentFocusedGuessWord: undefined,
      currentMonitor: 'center' as TMonitorsNames,
      currentLevel: 1,
      currentCharacterStreak: 0,
      longestStreak: 0,
      currentScoreMultiplier: 1,
      currentScore: 0,
      isGameOver: false,
      currentWordsDisplayed: [],
      monitors: {
        left: generateMonitorData('left'),
        center: generateMonitorData('center'),
        right: generateMonitorData('right'),
      },
      session: {
        isLoggedIn: false,
        user: {
          displayName: '',
          email: '',
          slackId: undefined,
          firebaseUserUid: undefined,
          profilePictureUrl: undefined,
          role: 1,
        },
        data: {
          token: '',
          expireTime: 0,
        },
      },
    },
  };
}

export const calculateCurrentTimeout = (playerData: PlayerData) => {
  const HUNDRED = 100; // Round to 2 decimal numbers x.xx
  /*
    f(x) = (1000 / C) * ( ln(x + A) / x );

    Where
    1000: Constant to increase the value to milliseconds
    C: How fast it will decrease. The bigger = the slower it will decrease
    A: Stabilizer for the natural logarithm function
    ln: Natural Logarithm to start growing fast and stabilize in higher levels to slow down.
  */

  const TO_MILLIS = 1000;
  // Here C and A change meanings between each other.
  // C: Speed of Growth
  // A: Stabilizer
  const C = playerData.configuration.levelSettings.levelProgressionParams.stabilizer;
  const A = playerData.configuration.levelSettings.levelProgressionParams.speedOfGrowth;
  const { currentLevel, currentMonitor } = playerData.data;
  const actualCurrentTimeout = playerData.data.monitors[currentMonitor].totalCurrentTimeout;

  const DEFAULT_TIMEOUT = 10; // Secs

  if (currentLevel <= 1) {
    return DEFAULT_TIMEOUT;
  }

  const speedOfGrowth = TO_MILLIS / C;
  const logarithmicDecrease = Math.log(currentLevel + A) / currentLevel;
  const newCurrentTimeout = actualCurrentTimeout - speedOfGrowth * logarithmicDecrease;
  return Math.round(newCurrentTimeout * HUNDRED) / HUNDRED;
};

export function generateMonitorCoordinates(name: TMonitorsNames): TMonitorCoordinates {
  const monitorCoordinates: Partial<TMonitorCoordinates> = {};

  // TODO: Refactor this it should be an object instead of this if else pattern
  if (name === 'center') {
    // 🖥️ Monitor
    monitorCoordinates.topLeft = new Phaser.Math.Vector2(835, 333);
    monitorCoordinates.topRight = new Phaser.Math.Vector2(1148, 333);
    monitorCoordinates.bottomRight = new Phaser.Math.Vector2(1148, 520);
    monitorCoordinates.bottomLeft = new Phaser.Math.Vector2(835, 520);

    // 🕑 Clock
    monitorCoordinates.clockX = 800;
    monitorCoordinates.clockY = 310;
    monitorCoordinates.clockRadiusX = 799;
    monitorCoordinates.clockRadiusY = 310;
  } else if (name === 'left') {
    // 🖥️ Monitor
    monitorCoordinates.topLeft = new Phaser.Math.Vector2(360, 558);
    monitorCoordinates.topRight = new Phaser.Math.Vector2(575, 530);
    monitorCoordinates.bottomRight = new Phaser.Math.Vector2(575, 690);
    monitorCoordinates.bottomLeft = new Phaser.Math.Vector2(360, 725);

    // 🕑 Clock
    monitorCoordinates.clockX = 320;
    monitorCoordinates.clockY = 535;
    monitorCoordinates.clockRadiusX = 319;
    monitorCoordinates.clockRadiusY = 535;

    // name === 'right'
  } else {
    // 🖥️ Monitor
    monitorCoordinates.topLeft = new Phaser.Math.Vector2(1260, 440);
    monitorCoordinates.topRight = new Phaser.Math.Vector2(1468, 468);
    monitorCoordinates.bottomRight = new Phaser.Math.Vector2(1466, 635);
    monitorCoordinates.bottomLeft = new Phaser.Math.Vector2(1260, 600);

    // 🕑 Clock
    monitorCoordinates.clockX = 1254;
    monitorCoordinates.clockY = 411;
    monitorCoordinates.clockRadiusX = 1254;
    monitorCoordinates.clockRadiusY = 411;
  }

  // 🧨Explotion 🌫️ Smoke
  monitorCoordinates.explosionSmokeX = monitorCoordinates.topRight.x - 30;
  monitorCoordinates.explosionSmokeY = monitorCoordinates.topRight.y - 100;

  // 🌫️ Smoke
  monitorCoordinates.smokeX = monitorCoordinates.topRight.x - 15;
  monitorCoordinates.smokeY = monitorCoordinates.topRight.y - 95;

  // 🔠 Words
  const middleXPoint = (monitorCoordinates.bottomLeft.x + monitorCoordinates.topLeft.x) / 2;
  const middleYPoint = (monitorCoordinates.bottomLeft.y + monitorCoordinates.topLeft.y) / 2;
  const offsetY = 30;
  const offsetX = 30;
  monitorCoordinates.guessWordX = middleXPoint + offsetX;
  monitorCoordinates.guessWordY = middleYPoint - offsetY;

  monitorCoordinates.userWordX = middleXPoint + offsetX;
  monitorCoordinates.userWordY = middleYPoint - offsetY;

  return monitorCoordinates as TMonitorCoordinates;
}

export function generateMonitorData(name: TMonitorsNames): TMonitorData {
  return {
    coordinates: generateMonitorCoordinates(name),
    currentTimeout: getStartingLevelTimeout(),
    totalCurrentTimeout: getStartingLevelTimeout(),
    currentUserWord: '',
    currentGuessWord: '',
    guessText: undefined,
    isDamaged: false,
    isTimoutAfterFirstdamaged: false,
    name,
    userText: undefined,
  };
}

export function generateLevelProgressionFunctionParams(): LevelProgressionFunction {
  /*
    f(x) = Math.Floor( (A * ln(x + C)) + B );

    Where
    A: speed of growth between each level
    B: Amplitude between each level
    C: Stabilizer for the natural logarithm function
    ln: Natural Logarithm to start growing fast and stabilize in higher levels to slow down.
  */
  const A = 9.5;
  const B = -69.2;
  const C = Math.exp((1 - B) / A);

  return {
    speedOfGrowth: A,
    amplitude: B,
    stabilizer: C,
  };
}

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
