// routes/user.routes.js

import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { updatePassword } from '../controllers/user.controller.js';

const router = express.Router();

router.patch('/update-password', verifyToken, updatePassword);

export default router;
