import axiosImport from 'axios';
import { getConfig } from '../config';
import { GamesAPISession } from '../game/utils/types';

export const gamesHqUrl = getConfig('VITE_API_HOST');

export const getAxiosInstance = async (body?: object) => {
  const session = localStorage.getItem('session');
  let headers: { [key: string]: string } = {
    'xtu-client-secret': getConfig('VITE_API_CLIENT_SECRET'),
    'xtu-request-timestamp': String(Date.now() / 1000),
  };
  const XTUSignature = createAPIRequestSignature(body);
  headers = {
    ...headers,
    ...XTUSignature,
  };

  if (session) {
    const JSONSession = JSON.parse(session) as GamesAPISession;
    headers = {
      ...headers,
      'xtu-session-token': JSONSession.token,
    };
  }
  return axiosImport.create({
    baseURL: gamesHqUrl,
    headers,
  });
};

interface SignatureHeader {
  'xtu-signature': string;
}

function createAPIRequestSignature(_body: object = {}): SignatureHeader {
  const apiVersion = 'v0';
  const hashedBody = '';
  return { 'xtu-signature': `${apiVersion}=${hashedBody}` };
}
