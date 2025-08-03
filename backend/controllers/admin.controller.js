
import pool from '../db.js';
import bcrypt from 'bcrypt';

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || name.length < 20 || name.length > 60)
      return res.status(400).json({ error: 'Name must be 20–60 characters' });

    if (!email || !password || !role)
      return res.status(400).json({ error: 'Email, password, and role are required' });

    if (!password.match(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/))
      return res.status(400).json({ error: 'Invalid password format' });

    if (!address || address.trim() === '')
       return res.status(400).json({ error: 'Address is required' });

    if (address.length > 400)
        return res.status(400).json({ error: 'Address too long' });

    const validRoles = ['user', 'admin', 'store_owner'];
    if (!validRoles.includes(role))
      return res.status(400).json({ error: 'Invalid role' });

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

    // Validate input fields
    if (!name || name.trim() === '')
      return res.status(400).json({ error: 'Store name is required' });

    if (!address || address.trim() === '')
      return res.status(400).json({ error: 'Address is required' });

    if (!owner_id)
      return res.status(400).json({ error: 'Owner ID is required' });

    // Optional: Validate email format if email is provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ error: 'Invalid email format' });

    // Check if owner exists and is a store_owner
    const ownerCheck = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND role = $2',
      [owner_id, 'store_owner']
    );

    if (ownerCheck.rows.length === 0)
      return res.status(404).json({ error: 'Store owner not found or invalid role' });

    // Insert into stores table
    const result = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name.trim(), email || null, address.trim(), owner_id]
    );

    res.status(201).json({ message: 'Store created', store: result.rows[0] });

  } catch (err) {
    next(err);
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [users, stores, ratings] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM stores'),
      pool.query('SELECT COUNT(*) FROM ratings')
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers: Number(users.rows[0].count),
        totalStores: Number(stores.rows[0].count),
        totalRatings: Number(ratings.rows[0].count)
      }
    });
  } catch (err) {
    console.error('Dashboard Error:', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getAllStoresWithRatings = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id, s.name, s.email, s.address,
        COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
      ORDER BY s.name
    `);

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { name, email, address, role} = req.query; 

    let query = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
    const values = [];
    let count = 1;

    if (name) {
      query += ` AND name ILIKE $${count++}`;
      values.push(`%${name}%`);
    }
    if (email) {
      query += ` AND email ILIKE $${count++}`;
      values.push(`%${email}%`);
    }
    if (address) {
      query += ` AND address ILIKE $${count++}`;
      values.push(`%${address}%`);
    }
    if (role) {
      query += ` AND LOWER(role) = LOWER($${count++})`;
      values.push(role);
    }

    // console.log('Final SQL Query:', query);
    // console.log('Query Parameters:', values);

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Step 1: Fetch user details
    const userResult = await pool.query(
      'SELECT id, name, email, address, role FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Step 2: If store owner, fetch average rating
    if (user.role === 'store_owner') {
      const ratingResult = await pool.query(
        `SELECT ROUND(AVG(r.rating), 2) AS store_rating
         FROM ratings r
         JOIN stores s ON r.store_id = s.id
         WHERE s.owner_id = $1`,
        [userId]
      );

      user.store_rating = parseFloat(ratingResult.rows[0].store_rating) || 0;
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getStoreById = async (req, res, next) => {
  try {
    const storeId = req.params.id;

    const result = await pool.query(
      `
      SELECT 
        s.id, s.name, s.email, s.address, s.owner_id,
        COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = $1
      GROUP BY s.id
      `,
      [storeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
