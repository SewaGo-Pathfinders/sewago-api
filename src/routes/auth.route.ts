import express from 'express';

import { signIn, signUp } from '../service/auth.service';

const authRoutes = express.Router();

authRoutes.get('/auth/sign-in', signIn);
authRoutes.post('/auth/sign-up', signUp);

export default authRoutes;
