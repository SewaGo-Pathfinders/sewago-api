import type { JwtPayload } from 'jsonwebtoken';
import { sign, verify, decode } from 'jsonwebtoken';

export function createToken(payload: any, type: 'request' | 'refresh') {
  if (type === 'request')
    return sign(payload, <string>process.env.JSON_SECRET_KEY, { expiresIn: '10m' });

  return sign(payload, <string>process.env.JSON_SECRET_KEY, { expiresIn: '30 days' });
}

export function verifyToken<T = string | JwtPayload>(token: string) {
  return verify(token, <string>process.env.JSON_SECRET_KEY) as T;
}

export function parseToken(token: string) {
  return decode(token);
}
