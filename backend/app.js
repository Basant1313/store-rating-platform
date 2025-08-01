import adminRoutes from './routes/admin.routes.js';

import express from 'express';import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import pool from './db.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Test route to check DB
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// Routes
app.use('/api/auth', authRoutes);

// Error handler
app.use(errorHandler);

app.use('/api/admin', adminRoutes);

export default app;
