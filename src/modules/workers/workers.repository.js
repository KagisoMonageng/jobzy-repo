const { v4: uuidv4 } = require('uuid');
const pool = require('../../db/pool');

async function createPendingWorkerApplication(userId) {
  await pool.query(
    `INSERT INTO worker_profiles (
      id, user_id, rating_avg, total_reviews, is_verified, is_available,
      verification_status, background_check_status, application_submitted_at,
      created_at, updated_at
    ) VALUES ($1, $2, 0, 0, false, false, 'pending', 'pending', NOW(), NOW(), NOW())
    ON CONFLICT (user_id) DO NOTHING`,
    [uuidv4(), userId]
  );
}

async function upsertProfile(payload) {
  const query = `
    UPDATE worker_profiles
    SET bio = $2,
        years_experience = $3,
        base_hourly_rate = $4,
        is_available = $5,
        latitude = $6,
        longitude = $7,
        address_text = $8,
        updated_at = NOW()
    WHERE user_id = $1
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    payload.userId,
    payload.bio,
    payload.yearsExperience,
    payload.baseHourlyRate,
    payload.isAvailable,
    payload.latitude,
    payload.longitude,
    payload.addressText
  ]);

  return rows[0] || null;
}

async function getWorkerAccessState(userId) {
  const { rows } = await pool.query(
    `SELECT wp.user_id,
            wp.verification_status,
            wp.background_check_status,
            ws.status AS subscription_status,
            ws.current_period_end,
            ws.id AS subscription_id
     FROM worker_profiles wp
     LEFT JOIN worker_subscriptions ws
       ON ws.worker_id = wp.user_id
      AND ws.status = 'active'
      AND ws.current_period_end > NOW()
     WHERE wp.user_id = $1
     ORDER BY ws.current_period_end DESC NULLS LAST
     LIMIT 1`,
    [userId]
  );

  return rows[0] || null;
}

async function replaceWorkerServices(workerId, serviceIds) {
  await pool.query('DELETE FROM worker_services WHERE worker_id = $1', [workerId]);
  for (const serviceId of serviceIds) {
    await pool.query('INSERT INTO worker_services (worker_id, service_id) VALUES ($1, $2)', [workerId, serviceId]);
  }
}

async function discoverWorkers(filters) {
  const params = [filters.serviceId || null, filters.lat, filters.lng, filters.radiusKm || 20];
  const query = `
    SELECT
      wp.user_id,
      u.fname,
      u.lname,
      wp.bio,
      wp.base_hourly_rate,
      wp.rating_avg,
      wp.total_reviews,
      wp.latitude,
      wp.longitude,
      wp.address_text,
      (6371 * acos(
        cos(radians($2)) * cos(radians(wp.latitude)) *
        cos(radians(wp.longitude) - radians($3)) +
        sin(radians($2)) * sin(radians(wp.latitude))
      )) AS distance_km
    FROM worker_profiles wp
    INNER JOIN users u ON u.id = wp.user_id
    LEFT JOIN worker_services ws ON ws.worker_id = wp.user_id
    WHERE wp.is_available = true
      AND wp.verification_status = 'approved'
      AND wp.background_check_status = 'approved'
      AND ($1::uuid IS NULL OR ws.service_id = $1)
    ORDER BY distance_km ASC
    LIMIT 100
  `;
  const { rows } = await pool.query(query, params);
  return rows.filter((r) => Number(r.distance_km) <= Number(filters.radiusKm || 20));
}

async function listPendingApplications() {
  const { rows } = await pool.query(
    `SELECT wp.user_id, wp.verification_status, wp.background_check_status, wp.application_submitted_at,
            u.email, u.fname, u.lname, u.south_african_id_number, u.passport_number
     FROM worker_profiles wp
     INNER JOIN users u ON u.id = wp.user_id
     WHERE wp.verification_status = 'pending' OR wp.background_check_status = 'pending'
     ORDER BY wp.application_submitted_at ASC`
  );
  return rows;
}

async function reviewApplication({ workerId, adminId, verificationStatus, backgroundCheckStatus, rejectionReason }) {
  const { rows } = await pool.query(
    `UPDATE worker_profiles
     SET verification_status = $2,
         background_check_status = $3,
         rejection_reason = $4,
         is_verified = CASE WHEN $2 = 'approved' AND $3 = 'approved' THEN true ELSE false END,
         approved_at = CASE WHEN $2 = 'approved' AND $3 = 'approved' THEN NOW() ELSE approved_at END,
         approved_by = $5,
         updated_at = NOW()
     WHERE user_id = $1
     RETURNING *`,
    [workerId, verificationStatus, backgroundCheckStatus, rejectionReason || null, adminId]
  );
  return rows[0] || null;
}

module.exports = {
  createPendingWorkerApplication,
  upsertProfile,
  getWorkerAccessState,
  replaceWorkerServices,
  discoverWorkers,
  listPendingApplications,
  reviewApplication
};
