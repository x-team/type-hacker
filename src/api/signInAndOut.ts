import { gamesHqUrl, getAxiosInstance } from './utils';

export const checkSession = async () => {
  const axios = await getAxiosInstance({ hasSignature: false });

  const endpoint = gamesHqUrl + `/general/login/session`;
  const response = await axios.get(endpoint);
  return response.data;
};

export const logOutFromGamesAPI = async () => {
  const axios = await getAxiosInstance({ hasSignature: false });

  const endpoint = gamesHqUrl + `/general/logout`;
  const response = await axios.get(endpoint);
  return response.data;
};
