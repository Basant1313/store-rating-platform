
import express from 'express';
import {
  createUser,
  createStore,
  getDashboardStats,
  getAllStoresWithRatings,
  getAllUsers,
  getUserById,
  getStoreById
} from '../controllers/admin.controller.js';

import { verifyToken, checkRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin-only routes
router.post('/users', verifyToken, checkRole('admin'), createUser);
router.post('/stores', verifyToken, checkRole('admin'), createStore);
router.get('/stats', verifyToken, checkRole('admin'), getDashboardStats);
router.get('/stores', verifyToken, checkRole('admin'), getAllStoresWithRatings);
router.get('/users', verifyToken, checkRole('admin'), getAllUsers);
router.get('/users/:id', verifyToken, checkRole('admin'), getUserById);
router.get('/stores/:id', verifyToken, checkRole('admin'), getStoreById);




export default router;
