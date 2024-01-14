import type { Request, Response } from 'express';

import { verifyToken } from '../lib/token';
import { addressRef } from '../database';

type RequestTokenPayload = {
  name: string,
  uid: string,
  email: string,
  storeId: string | null,
}

export async function createAddress(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(403).json({ message: 'Request token tidak tercantum' });
    return;
  }
  
  const isLegal = verifyToken<RequestTokenPayload>(token);
  
  const { city, province, address, postalCode } = req.body;

  await addressRef.doc().set({
    userId: isLegal.uid,
    storeId: null,
    longitude: null,
    latitude: null,
    address,
    province,
    city,
    postalCode,
  });

  res.status(201).json({ message: 'Alamat akun Anda telah dibuat' });
}
