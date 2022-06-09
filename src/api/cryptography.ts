import { Buffer } from 'buffer/';
import { HmacSHA256 } from 'crypto-js';

export function signMessage(message: string, secret: string) {
  const hash = HmacSHA256(message, secret);
  // hmac.update(message);
  return hash;
}

interface APISignatureParams {
  timestamp: string;
  bodyPayload: object;
}

export function createAPISignature({ timestamp, bodyPayload }: APISignatureParams) {
  const bodyPayloadBuffer = Buffer.from(JSON.stringify(bodyPayload));
  const bodyToHash = bodyPayloadBuffer.toString('utf-8');
  const version = 'v0';
  const signatureBase = `${version}:${timestamp}:${bodyToHash}`;
  console.log({ signatureBase });
  return `${version}=${signMessage(signatureBase, __API_SIGNING_SECRET__)}`;
}
