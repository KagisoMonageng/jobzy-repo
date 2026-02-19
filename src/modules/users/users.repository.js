const pool = require('../../db/pool');

async function createUser(user) {
  const query = `
    INSERT INTO users (
      id, email, password_hash, role, fname, lname, phone,
      email_verified, phone_verified, is_active, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, false, false, true, NOW(), NOW())
    RETURNING id, email, role, fname, lname, phone, email_verified, phone_verified,
              is_active, profile_photo_url, profile_photo_public_id, profile_photo_updated_at,
              last_login, created_at, updated_at
  `;

  const { rows } = await pool.query(query, [
    user.id,
    user.email,
    user.passwordHash,
    user.role,
    user.fname,
    user.lname,
    user.phone || null
  ]);

  return rows[0];
}

async function findUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
  return rows[0] || null;
}

async function findUserById(id) {
  const { rows } = await pool.query(
    `SELECT id, email, role, fname, lname, phone, email_verified, phone_verified, is_active,
            profile_photo_url, profile_photo_public_id, profile_photo_updated_at, last_login,
            created_at, updated_at
     FROM users WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function updateLastLogin(userId) {
  await pool.query('UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = $1', [userId]);
}

module.exports = { createUser, findUserByEmail, findUserById, updateLastLogin };
