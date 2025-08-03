import express from 'express';
import { getStoreDashboard, getAllStoresWithUserRating, getFilteredStores } from '../controllers/store.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/dashboard', verifyToken, checkRole('store_owner'), getStoreDashboard);
router.get('/', verifyToken, checkRole('user'), getAllStoresWithUserRating);
router.get('/', verifyToken, checkRole('user'), getFilteredStores);

export default router;
