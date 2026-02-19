const pool = require('../../db/pool');

async function createJob(payload) {
  const query = `
    INSERT INTO jobs (
      id, client_id, worker_id, service_id, title, description, budget, status,
      latitude, longitude, address_text, scheduled_at, created_at, updated_at
    ) VALUES ($1, $2, NULL, $3, $4, $5, $6, 'open', $7, $8, $9, $10, NOW(), NOW())
    RETURNING *
  `;
  const { rows } = await pool.query(query, [
    payload.id,
    payload.clientId,
    payload.serviceId,
    payload.title,
    payload.description,
    payload.budget,
    payload.latitude,
    payload.longitude,
    payload.addressText,
    payload.scheduledAt
  ]);
  return rows[0];
}

async function assignJob(jobId, workerId) {
  const { rows } = await pool.query(
    `UPDATE jobs SET worker_id = $2, status = 'accepted', updated_at = NOW() WHERE id = $1 AND status = 'open' RETURNING *`,
    [jobId, workerId]
  );
  return rows[0] || null;
}

async function updateJobStatus(jobId, status) {
  const { rows } = await pool.query(
    `UPDATE jobs
     SET status = $2,
         started_at = CASE WHEN $2 = 'in_progress' THEN NOW() ELSE started_at END,
         completed_at = CASE WHEN $2 = 'completed' THEN NOW() ELSE completed_at END,
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [jobId, status]
  );
  return rows[0] || null;
}

async function listMyJobs(userId, role) {
  const field = role === 'client' ? 'client_id' : 'worker_id';
  const { rows } = await pool.query(`SELECT * FROM jobs WHERE ${field} = $1 ORDER BY created_at DESC`, [userId]);
  return rows;
}

module.exports = { createJob, assignJob, updateJobStatus, listMyJobs };
