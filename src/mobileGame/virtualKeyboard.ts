import { IKioskBoardOptions } from 'kioskboard';

const virtualKeyboard: { [key: string]: string }[] = [
  {
    '0': 'Q',
    '1': 'W',
    '2': 'E',
    '3': 'R',
    '4': 'T',
    '5': 'Y',
    '6': 'U',
    '7': 'I',
    '8': 'O',
    '9': 'P',
    '10': '{',
    '11': '}',
  },
  {
    '0': 'A',
    '1': 'S',
    '2': 'D',
    '3': 'F',
    '4': 'G',
    '5': 'H',
    '6': 'J',
    '7': 'K',
    '8': 'L',
    '9': ':',
    '10': '"',
  },
  {
    '0': 'Z',
    '1': 'X',
    '2': 'C',
    '3': 'V',
    '4': 'B',
    '5': 'N',
    '6': 'M',
    '7': '<',
    '8': '>',
  },
];

export const keyboardSettings: IKioskBoardOptions = {
  keysArrayOfObjects: virtualKeyboard,

  /*!
   * Required only if "keysArrayOfObjects" is "null".
   * The path of the "kioskboard-keys-${langugage}.json" file must be set to the "keysJsonUrl" option. (XMLHttpRequest to get the keys from JSON file.)
   * e.g. '/Content/Plugins/KioskBoard/dist/kioskboard-keys-english.json'
   */
  // keysJsonUrl: null,

  /*
   * Optional: An Array of Strings can be set to override the built-in special characters.
   * e.g. ["#", "€", "%", "+", "-", "*"]
   */
  // keysSpecialCharsArrayOfStrings: null,

  /*
   * Optional: An Array of Numbers can be set to override the built-in numpad keys. (From 0 to 9, in any order.)
   * e.g. [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
   */
  // keysNumpadArrayOfNumbers: null,

  // Optional: (Other Options)

  // Language Code (ISO 639-1) for custom keys (for language support) => e.g. "de" || "en" || "fr" || "hu" || "tr" etc...
  language: 'en',

  // The theme of keyboard => "light" || "dark" || "flat" || "material" || "oldschool"
  theme: 'dark',

  // Uppercase or lowercase to start. Uppercased when "true"
  capsLockActive: false,

  /*
   * Allow or prevent real/physical keyboard usage. Prevented when "false"
   * In addition, the "allowMobileKeyboard" option must be "true" as well, if the real/physical keyboard has wanted to be used.
   */
  allowRealKeyboard: false,

  // Allow or prevent mobile keyboard usage. Prevented when "false"
  allowMobileKeyboard: false,

  // CSS animations for opening or closing the keyboard
  cssAnimations: true,

  // CSS animations duration as millisecond
  cssAnimationsDuration: 360,

  // CSS animations style for opening or closing the keyboard => "slide" || "fade"
  cssAnimationsStyle: 'slide',

  // Enable or Disable Spacebar functionality on the keyboard. The Spacebar will be passive when "false"
  keysAllowSpacebar: true,

  // Text of the space key (Spacebar). Without text => " "
  keysSpacebarText: 'Space',

  // Font family of the keys
  keysFontFamily: 'sans-serif',

  // Font size of the keys
  keysFontSize: '22px',

  // Font weight of the keys
  keysFontWeight: 'normal',

  // Size of the icon keys
  keysIconSize: '25px',

  // Scrolls the document to the top or bottom(by the placement option) of the input/textarea element. Prevented when "false"
  autoScroll: true,
};
