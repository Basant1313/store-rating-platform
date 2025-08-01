
import express from 'express';
import {
  createUser,
  createStore,
  getDashboardStats
} from '../controllers/admin.controller.js';

import { verifyToken, checkRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin-only routes
router.post('/users', verifyToken, checkRole('admin'), createUser);
router.post('/stores', verifyToken, checkRole('admin'), createStore);
router.get('/stats', verifyToken, checkRole('admin'), getDashboardStats);

export default router;
