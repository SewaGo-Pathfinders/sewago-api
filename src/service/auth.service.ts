import type { Request, Response } from 'express';

import { getAuth } from 'firebase-admin/auth';

import { createToken, verifyToken } from '../lib/token';
import { addressRef, storeRef, userRef } from '../database';

type RequestTokenPayload = {
  name: string,
  uid: string,
  email: string,
  storeId: string | null,
}

const auth = getAuth();

export async function signUp(req: Request, res: Response) {
  const {
    username,
    email,
    password,
  } = req.body;

  const { uid } = await auth.createUser({
    email,
    password,
    displayName: username,
    emailVerified: false,
  });

  await userRef.doc(uid).set({
    rating: 0,
    refreshToken: null,
  });

  res.status(201).json({ message: 'Akun telah dibuat! Silahkan login' });
}

export async function signIn(req: Request, res: Response) {
  const { token } = req.query;

  try {
    const decodedToken = await auth.verifyIdToken(token as string);
    const { uid, email, displayName } = await auth.getUser(decodedToken.uid);
    const userFromDB = await userRef.doc(uid).get();

    if (!userFromDB.exists)
      userRef.doc(uid).set({
        rating: 0,
        refreshToken: null,
      });
    
    const store = await storeRef.where('userId', '==', uid).get();
    let storeId = null;

    if (!store.empty)
      store.forEach((store) => storeId = store.id);

    const refreshToken = createToken({ license: 'sewago-app 2024' }, 'refresh');
    const requestToken = createToken({
      name: displayName,
      uid,
      email,
      storeId,
    }, 'request');

    res.cookie('sewago_refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    });

    res.status(200).json({ payload: { requestToken } });
  } catch (error) {
    console.error(error);
    res.status(404).json(error);
  }
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
