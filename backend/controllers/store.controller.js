import pool from '../db.js';

export const getStoreDashboard = async (req, res, next) => {
  try {
    const ownerId = req.user.id;

    // Get the store owned by this user
    const storeResult = await pool.query(
      `SELECT id, name FROM stores WHERE owner_id = $1`,
      [ownerId]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'No store found for this owner' });
    }

    const store = storeResult.rows[0];

    // Get average rating and users who rated
    const ratingResult = await pool.query(
      `SELECT 
        u.id AS user_id,
        u.name AS user_name,
        u.email,
        r.rating
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = $1`,
      [store.id]
    );

    const ratings = ratingResult.rows;
    const averageRating =
      ratings.length > 0
        ? (
            ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          ).toFixed(2)
        : 0;

    res.json({
      storeId: store.id,
      storeName: store.name,
      averageRating,
      ratings,
    });
  } catch (err) {
    next(err);
  }
};


// export const getAllStoresWithUserRating = async (req, res, next) => {
//   try {
//     const userId = req.user.id;

//     const result = await pool.query(
//       `
//       SELECT 
//         s.id,
//         s.name,
//         s.address,
//         COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating,
//         COALESCE(
//           (
//             SELECT rating FROM ratings 
//             WHERE ratings.user_id = $1 AND ratings.store_id = s.id
//           ), 
//           NULL
//         ) AS user_rating
//       FROM stores s
//       LEFT JOIN ratings r ON s.id = r.store_id
//       GROUP BY s.id
//       ORDER BY s.name
//       `,
//       [userId]
//     );

//     res.json(result.rows);
//   } catch (err) {
//     next(err);
//   }
// };


export const getAllStoresWithUserRating = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT 
        s.id AS store_id,
        s.name,
        s.address,
        COALESCE(ROUND(AVG(r.rating), 2), 0) AS averageRating,
        COALESCE(
          (
            SELECT rating FROM ratings 
            WHERE ratings.user_id = $1 AND ratings.store_id = s.id
          ), 
          NULL
        ) AS userRating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id, s.name, s.address
      ORDER BY s.name
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};



export const getFilteredStores = async (req, res, next) => {
  try {
    const { name, address } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT 
        s.id, 
        s.name, 
        s.address, 
        COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating,
        ur.rating AS user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = $1
    `;

    const values = [userId];
    const conditions = [];

    if (name) {
      conditions.push(`LOWER(s.name) LIKE $${values.length + 1}`);
      values.push(`%${name.toLowerCase()}%`);
    }

    if (address) {
      conditions.push(`LOWER(s.address) LIKE $${values.length + 1}`);
      values.push(`%${address.toLowerCase()}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` GROUP BY s.id, ur.rating ORDER BY s.name`;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};