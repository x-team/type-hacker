import { setPlayerName, setupPlayfab } from './game/playfab';

setTimeout(() => {
  const usernameInput = document.getElementById('#username-input-container');
  if (usernameInput) {
    usernameInput.style.visibility = 'visible';
  }
}, 1250);

const submitButton = document.getElementById('#submit-button');
if (submitButton) {
  submitButton.onclick = function () {
    const usernameInput = document.getElementById('#user-name') as HTMLInputElement;
    const usernameLabel = document.getElementById('#username-label');
    const username = usernameInput?.value;
    setPlayerName(username);
    setupPlayfab();
    usernameInput.remove();
    submitButton.remove();
    usernameLabel?.remove();
  };
}
