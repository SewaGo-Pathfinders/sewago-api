import express from 'express';

import { generateRequestToken, signIn, signUp } from '../service/auth.service';

const authRoutes = express.Router();

authRoutes.get('/auth/sign-in', signIn);
authRoutes.post('/auth/sign-up', signUp);
authRoutes.get('/auth/request-token', generateRequestToken);

export default authRoutes;
