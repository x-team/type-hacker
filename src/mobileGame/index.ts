// import KioskBoard from 'kioskboard';
// import { keyboardSettings } from './virtualKeyboard';

const renderVirtualKeyboard = () => {
  const selectAppElement = document.getElementById('app') as HTMLDivElement;
  if (selectAppElement) {
    selectAppElement.style.height = '90vh';
    selectAppElement.style.maxHeight = '90vh';
  }
  // const selectElement = document.getElementById('user-name') as HTMLInputElement;
  // KioskBoard.run('#user-name', keyboardSettings);
  // setTimeout(() => selectElement?.focus(), 1000);
};

export const checkIfMobile = (): boolean => {
  const windowWidth = window.innerWidth;
  const isMobile = windowWidth <= 480;
  if (isMobile) {
    return true;
  }
  return false;
};

window.addEventListener(
  'resize',
  function () {
    checkIfMobile() && renderVirtualKeyboard();
  },
  true
);

const main = () => {
  checkIfMobile() && renderVirtualKeyboard();
  // if (document.getElementById('virtual-keyboard') == document.activeElement) {
  //   document.getElementById('fixed').class += 'absolute';
  // }
};

main();
