import type { Request, Response } from 'express';

import { getAuth } from 'firebase-admin/auth';

import { createToken, verifyToken } from '../lib/token';
import { storeRef, userRef } from '../database';
import { TokenPayload } from '../type';

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
    const user = await auth.getUser(decodedToken.uid);
    const userFromDB = await userRef.doc(user.uid).get();

    if (!userFromDB.exists)
      userRef.doc(user.uid).set({
        rating: 0,
        refreshToken: null,
      });
    
    const store = await storeRef.where('userId', '==', user.uid).get();
    let storeId = null;

    if (!store.empty)
      store.forEach((store) => storeId = store.id);

    const payload: TokenPayload = {
      name: user.displayName!,
      uid: user.uid,
      email: user.email!,
      storeId,
    }

    const refreshToken = createToken(payload, 'refresh');
    const requestToken = createToken(payload, 'request');

    userRef.doc(user.uid).update({ refreshToken });

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

export async function generateRequestToken(req: Request, res: Response) {
  const refreshToken = req.cookies.sewago_refreshToken;

  try {
    const refreshTokenPayload = verifyToken<TokenPayload>(refreshToken);
    const user = (await userRef.doc(refreshTokenPayload.uid).get()).data();

    if (!user)
      throw new Error('user doesnt exist');
 
    if (user.refreshToken !== refreshToken)
      throw new Error('refresh token doesnt same');

    const requestToken = createToken({
      name: refreshTokenPayload.name,
      uid: refreshTokenPayload.uid,
      email: refreshTokenPayload.email,
      storeId: refreshTokenPayload.storeId,
    }, 'request');

    res.json({ requestToken });
  } catch (error: any) {
    console.log(error);
    res.status(404).json(error.message);
  }
}
