const pool = require('../../db/pool');

async function createReview(payload) {
  const query = `
    INSERT INTO reviews (id, job_id, reviewer_id, reviewee_id, rating, comment, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING *
  `;
  const { rows } = await pool.query(query, [
    payload.id,
    payload.jobId,
    payload.reviewerId,
    payload.revieweeId,
    payload.rating,
    payload.comment
  ]);
  return rows[0];
}

async function refreshWorkerRating(workerId) {
  await pool.query(
    `UPDATE worker_profiles wp
     SET rating_avg = COALESCE(sub.avg_rating, 0),
         total_reviews = COALESCE(sub.total_reviews, 0),
         updated_at = NOW()
     FROM (
       SELECT reviewee_id, AVG(rating)::numeric(3,2) AS avg_rating, COUNT(*)::int AS total_reviews
       FROM reviews
       WHERE reviewee_id = $1
       GROUP BY reviewee_id
     ) sub
     WHERE wp.user_id = sub.reviewee_id`,
    [workerId]
  );
}

module.exports = { createReview, refreshWorkerRating };
