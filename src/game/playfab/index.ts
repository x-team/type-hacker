import { faker } from '@faker-js/faker';

export const getPlayfabUUID = () => {
  const existingUUID = localStorage.getItem('playfab-uuid');
  if (!existingUUID) {
    const UUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    localStorage.setItem('playfab-uuid', UUID);

    return UUID;
  }

  return existingUUID;
};

export const hasPlayerName = () => {
  return !!localStorage.getItem('player-name');
};

export const getPlayerName = () => {
  const existingPlayerName = localStorage.getItem('player-name');
  if (existingPlayerName) {
    return existingPlayerName;
  }

  const newPlayerName = `${faker.word.adjective()} ${faker.word.noun()}`.substring(0, 24);
  localStorage.setItem('player-name', newPlayerName);

  return newPlayerName;
};

export const setPlayerName = (playerName: string) => {
  localStorage.setItem('player-name', playerName.substring(0, 24));
};

export const submitPlayerEvent = async (
  eventName: string,
  body: { [s: string]: number | string }
) => {
  console.log('Submitting event: ' + eventName);
  try {
    return new Promise(() => {
      PlayFabClientSDK.WritePlayerEvent({
        EventName: eventName,
        Body: body,
      });
    });
  } catch (e) {
    return new Error(`submitPlayerEvent Failed ${e}`);
  }
};

export const setupPlayfab = async () => {
  console.log('Setting playfab');
  const playfabId = getPlayfabUUID();
  const playerName = getPlayerName();

  let titleId;
  if (import.meta.env.DEV) {
    titleId = 'A3A68';
  } else {
    titleId = 'B3FFB';
  }

  PlayFab.settings.titleId = titleId;
  try {
    console.log('Logging in...');
    PlayFabClientSDK.LoginWithCustomID(
      {
        TitleId: titleId,
        CreateAccount: true,
        CustomId: playfabId,
      },
      async () => {
        console.log('logged in YAY');
        PlayFabClientSDK.UpdateUserTitleDisplayName({
          DisplayName: playerName,
        });
      }
    );
  } catch (e) {
    return new Error('setupPlayFab Failed');
  }
  return;
};
