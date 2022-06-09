import { gamesHqUrl, getAxiosInstance } from './utils';

export async function submitScore() {
  const axios = await getAxiosInstance({ hasSignature: true });
  console.log({ axios });
  const endpoint = gamesHqUrl + `/webhooks/game-dev/achievements`;
  const response = await axios.get(endpoint);
  return response.data;
}
