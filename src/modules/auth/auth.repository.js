const pool = require('../../db/pool');

async function createRefreshToken(tokenRecord) {
  const query = `
    INSERT INTO refresh_tokens (id, user_id, token, expires_at, revoked, created_at)
    VALUES ($1, $2, $3, $4, false, NOW())
    RETURNING id, user_id, token, expires_at, revoked, created_at
  `;

  const { rows } = await pool.query(query, [
    tokenRecord.id,
    tokenRecord.userId,
    tokenRecord.token,
    tokenRecord.expiresAt
  ]);

  return rows[0];
}

async function findRefreshToken(token) {
  const { rows } = await pool.query(
    `SELECT id, user_id, token, expires_at, revoked FROM refresh_tokens WHERE token = $1 LIMIT 1`,
    [token]
  );
  return rows[0] || null;
}

async function revokeRefreshToken(token) {
  await pool.query('UPDATE refresh_tokens SET revoked = true WHERE token = $1', [token]);
}

module.exports = { createRefreshToken, findRefreshToken, revokeRefreshToken };
