import pool from '../db.js';

export const getRatingsForOwnerStore = async (req, res, next) => {
  try {
    const ownerId = req.user.id;

    // Get the store owned by the logged-in store_owner
    const storeResult = await pool.query(
      'SELECT id FROM stores WHERE owner_id = $1',
      [ownerId]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found for this owner' });
    }

    const storeId = storeResult.rows[0].id;

    // Get users who rated the store
    const ratingsResult = await pool.query(
      `SELECT 
         u.name AS user_name,
         r.rating,
         r.updated_at
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = $1
       ORDER BY r.updated_at DESC`,
      [storeId]
    );

    res.json({ storeId, ratings: ratingsResult.rows });

  } catch (err) {
    next(err);
  }
};
