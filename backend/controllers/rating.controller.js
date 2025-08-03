import pool from '../db.js';


export const rateStore = async (req, res, next) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id;

  if (!store_id || !rating) {
    return res.status(400).json({ error: 'Store ID and rating are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    // Check if store exists
    const storeExists = await pool.query('SELECT id FROM stores WHERE id = $1', [store_id]);
    if (storeExists.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Check if the user already rated this store
    const existing = await pool.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [user_id, store_id]
    );

    if (existing.rows.length > 0) {
      // Update existing rating
      await pool.query(
        'UPDATE ratings SET rating = $1, updated_at = NOW() WHERE user_id = $2 AND store_id = $3',
        [rating, user_id, store_id]
      );
      return res.status(200).json({ message: 'Rating updated successfully' });
    } else {
      // Insert new rating
      await pool.query(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3)',
        [user_id, store_id, rating]
      );
      return res.status(201).json({ message: 'Rating submitted successfully' });
    }
  } catch (err) {
    next(err);
  }
};
