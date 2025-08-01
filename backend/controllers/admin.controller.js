
import pool from '../db.js';
import bcrypt from 'bcrypt';

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || name.length < 20 || name.length > 60)
      return res.status(400).json({ error: 'Name must be 20–60 characters' });

    if (!password.match(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/))
      return res.status(400).json({ error: 'Invalid password format' });

    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role`,
      [name, email, hashed, address, role]
    );

    res.status(201).json({ message: 'User created', user: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const createStore = async (req, res, next) => {
  try {
    const { name, email, address, owner_id } = req.body;

    const result = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, address, owner_id]
    );

    res.status(201).json({ message: 'Store created', store: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const storeCount = await pool.query('SELECT COUNT(*) FROM stores');
    const ratingCount = await pool.query('SELECT COUNT(*) FROM ratings');

    res.json({
      users: parseInt(userCount.rows[0].count),
      stores: parseInt(storeCount.rows[0].count),
      ratings: parseInt(ratingCount.rows[0].count)
    });
  } catch (err) {
    next(err);
  }
};
