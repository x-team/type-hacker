import { setPlayerName, setupPlayfab } from './game/playfab';

setTimeout(() => {
  const name = localStorage.getItem('player-name');
  const usernameInputContainer = document.getElementById('#username-input-container');
  if (usernameInputContainer) {
    usernameInputContainer.style.visibility = 'visible';
  }
  if (name) {
    const usernameInput = document.getElementById('#user-name') as HTMLInputElement;
    if (usernameInput) {
      usernameInput.value = name;
    }

    setupPlayfab();
  }
}, 1250);

const submitButton = document.getElementById('#submit-button');
if (submitButton) {
  submitButton.onclick = function () {
    const usernameInput = document.getElementById('#user-name') as HTMLInputElement;
    const usernameInfoText = document.getElementById('username-info-text');
    const usernameLabel = document.getElementById('#username-label');
    const username = usernameInput?.value;
    if (username.length <= 2) {
      return;
    }
    setPlayerName(username);
    setupPlayfab();
    usernameInput.remove();
    submitButton.remove();
    usernameLabel?.remove();
    usernameInfoText?.remove();
  };
}
