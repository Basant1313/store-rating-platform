import express from 'express';
import { getRatingsForOwnerStore } from '../controllers/owner.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/ratings', verifyToken, checkRole('store_owner'), getRatingsForOwnerStore);

export default router;
