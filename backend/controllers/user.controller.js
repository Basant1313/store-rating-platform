// controllers/user.controller.js

import bcrypt from 'bcrypt';
import pool from '../db.js';

export const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new passwords are required' });
    }

    // Validate new password format
    const passwordRegex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ error: 'New password must be 8–16 chars with 1 uppercase & 1 special char' });
    }

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, userId]);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};
