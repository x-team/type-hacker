import KioskBoard from 'kioskboard';
import { keyboardSettings } from './virtualKeyboard';

const renderVirtualKeyboard = () => {
  KioskBoard.run('#user-name', keyboardSettings);
  const selectElement = document.getElementById('user-name') as HTMLInputElement;
  setTimeout(() => selectElement?.focus(), 1000);
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
};

main();
