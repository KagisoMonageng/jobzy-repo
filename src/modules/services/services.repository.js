const pool = require('../../db/pool');

async function listActiveServices() {
  const { rows } = await pool.query(
    'SELECT id, name, description, icon, is_active, created_at FROM services WHERE is_active = true ORDER BY name ASC'
  );
  return rows;
}

async function createService(service) {
  const { rows } = await pool.query(
    `INSERT INTO services (id, name, description, icon, is_active, created_at)
     VALUES ($1, $2, $3, $4, true, NOW())
     RETURNING id, name, description, icon, is_active, created_at`,
    [service.id, service.name, service.description, service.icon]
  );
  return rows[0];
}

module.exports = { listActiveServices, createService };
