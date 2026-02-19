const pool = require('../../db/pool');

async function upsertProfile(payload) {
  const query = `
    INSERT INTO worker_profiles (
      id, user_id, bio, years_experience, base_hourly_rate, rating_avg, total_reviews,
      is_verified, is_available, latitude, longitude, address_text, created_at, updated_at
    )
    VALUES ($1, $2, $3, $4, $5, 0, 0, false, $6, $7, $8, $9, NOW(), NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      bio = EXCLUDED.bio,
      years_experience = EXCLUDED.years_experience,
      base_hourly_rate = EXCLUDED.base_hourly_rate,
      is_available = EXCLUDED.is_available,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      address_text = EXCLUDED.address_text,
      updated_at = NOW()
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    payload.id,
    payload.userId,
    payload.bio,
    payload.yearsExperience,
    payload.baseHourlyRate,
    payload.isAvailable,
    payload.latitude,
    payload.longitude,
    payload.addressText
  ]);

  return rows[0];
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
      AND ($1::uuid IS NULL OR ws.service_id = $1)
    ORDER BY distance_km ASC
    LIMIT 100
  `;
  const { rows } = await pool.query(query, params);
  return rows.filter((r) => Number(r.distance_km) <= Number(filters.radiusKm || 20));
}

module.exports = { upsertProfile, replaceWorkerServices, discoverWorkers };
