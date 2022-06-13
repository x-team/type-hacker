import axiosImport from 'axios';
import { getConfig } from '../config';
import { GamesAPISession } from '../game/utils/types';
import { createAPISignature } from './cryptography';

export const gamesHqUrl = getConfig('VITE_API_HOST');

interface AxiosParams {
  hasSignature: boolean;
  body?: object;
}

export const getAxiosInstance = async ({ hasSignature, body }: AxiosParams) => {
  const session = localStorage.getItem('session');
  const timestamp = String(Date.now() / 1000);
  let headers: { [key: string]: string } = {
    'xtu-client-secret': getConfig('VITE_API_CLIENT_SECRET'),
    'xtu-request-timestamp': timestamp,
  };
  if (hasSignature) {
    const XTUSignature = createAPIRequestSignature({ timestamp, bodyPayload: body });
    headers = {
      ...headers,
      ...XTUSignature,
    };
  }

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

interface APISignatureParams {
  timestamp: string;
  bodyPayload?: object;
}

function createAPIRequestSignature({
  timestamp,
  bodyPayload = {},
}: APISignatureParams): SignatureHeader {
  const hashedBody = createAPISignature({ timestamp, bodyPayload });
  return { 'xtu-signature': `${hashedBody}` };
}
