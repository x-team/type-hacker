import { PlayerData } from "../../game/utils/types";
import { words } from "./words";

export function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export const getMinimumWordLengthByLevel = (level: number): number => {
  return level;
};

export const generateNewWord = (
  length: number,
  existingWords: string[]
): string => {
  // `existingWords` should be used to not create words that start with the same later (which would generate a conflict for the game's autofocus)
  console.log({ existingWords });

  let wordLength = length;
  if (length < 2) {
    wordLength = 2;
  } else if (length > 15) {
    wordLength = 15;
  }

  const existingFirstLetters = existingWords.map((word) => word.charAt(0));
  const possibleWords = words[wordLength].filter((word) => {
    const firstLetter = word.charAt(0);
    if (existingFirstLetters.includes(firstLetter)) {
      return false;
    }

    return true;
  });

  const chosenWordIndex = getRandomInteger(0, possibleWords.length - 1);

  return possibleWords[chosenWordIndex];
};

export const getDelayBetweenWords = (playerData: PlayerData) => {
  /*
    f(x) = A * ln(x * B);

    for levels higher than 15 we will add

    f(x) = ( A * ln(x * B) ) / ( x / 8)
    => This will help the decrease value to grow faster but stable in higher levels

    Where
    1000: Constant to increase the value to milliseconds
    A: How fast it will decrease. The bigger = the slower it will decrease
    B: Changes the amplitude of the result to calculate the ln()
    ln: Natural Logarithm to start growing fast and stabilize in higher levels to slow down.
  */
  const baseDelayMilliseconds = 1300;
  const { currentLevel } = playerData.data;

  if (currentLevel <= 0) {
    return baseDelayMilliseconds;
  }

  const minDelayMilliseconds = 50;
  const maxLevelToCalculate = 30;
  const levelStep = 15;
  const levelStepDivider = 8;

  if (currentLevel > maxLevelToCalculate) {
    return minDelayMilliseconds;
  }

  const A = 230;
  const B = 2.5;
  const logarithmicDecrease = Math.log(currentLevel * B);
  const progressiveDelay = A * logarithmicDecrease;
  let mutableDelayInMillis = baseDelayMilliseconds - progressiveDelay;

  if (currentLevel >= levelStep) {
    const stepper = currentLevel / levelStepDivider;
    mutableDelayInMillis /= stepper;
  }

  return mutableDelayInMillis;
};
