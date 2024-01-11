import express from 'express';

import { signIn, signUp, createAddress } from '../service/auth.service';

const authRoutes = express.Router();

authRoutes.get('/auth/sign-in', signIn);
authRoutes.post('/auth/sign-up', signUp);
authRoutes.post('/auth/address', createAddress);

export default authRoutes;
