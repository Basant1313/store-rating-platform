
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Validation
    if (!name || name.length < 20 || name.length > 60)
      return res.status(400).json({ error: 'Name must be 20-60 characters' });

    if (address && address.length > 400)
      return res.status(400).json({ error: 'Address too long' });

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/;
    if (!passwordRegex.test(password))
      return res.status(400).json({ error: 'Password must be 8–16 chars with 1 uppercase & 1 special char' });

    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0)
      return res.status(409).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });

  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    next(err);
  }
};
