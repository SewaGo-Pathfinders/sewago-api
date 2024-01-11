import express from 'express';
import authRoutes from './auth.route';

const router = express.Router();

router.use(authRoutes);

export default router;
