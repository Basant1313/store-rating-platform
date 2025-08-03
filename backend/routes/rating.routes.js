import express from 'express';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';
import { rateStore } from '../controllers/rating.controller.js';

const router = express.Router();

router.post('/', verifyToken, checkRole('user'), rateStore);

export default router;
