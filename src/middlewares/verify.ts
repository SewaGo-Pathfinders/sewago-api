import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/token';

export async function verify(req: Request, res: Response, next: NextFunction) {
  const pathname = req.path;
  
  if (pathname === '/auth/sign-in' || pathname === '/auth/sign-up' || pathname === '/auth/request-token') {
    next();
    return;
  }

  const requestToken = req.headers.authorization?.split(' ')[1];

  try {
    if (typeof requestToken !== 'string')
      throw new Error();

    verifyToken(requestToken);

    next();
  } catch {
    res.json({ message: 'Request token expired!' });
  }
}
