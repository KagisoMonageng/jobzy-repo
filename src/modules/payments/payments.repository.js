const pool = require('../../db/pool');

async function createPlan(payload) {
  const { rows } = await pool.query(
    `INSERT INTO subscription_plans (id, name, price_zar, billing_cycle, is_active, created_at)
     VALUES ($1, $2, $3, 'monthly', true, NOW())
     RETURNING *`,
    [payload.id, payload.name, payload.priceZar]
  );
  return rows[0];
}

async function listPlans() {
  const { rows } = await pool.query(
    `SELECT id, name, price_zar, billing_cycle, is_active, created_at
     FROM subscription_plans WHERE is_active = true ORDER BY price_zar ASC`
  );
  return rows;
}

async function findPlan(planId) {
  const { rows } = await pool.query('SELECT * FROM subscription_plans WHERE id = $1 AND is_active = true LIMIT 1', [planId]);
  return rows[0] || null;
}

async function createPendingSubscription(payload) {
  const { rows } = await pool.query(
    `INSERT INTO worker_subscriptions (
      id, worker_id, plan_id, status, current_period_start, current_period_end,
      next_billing_at, cancel_at_period_end, created_at, updated_at
    ) VALUES ($1, $2, $3, 'past_due', NOW(), NOW() + INTERVAL '1 month', NOW() + INTERVAL '1 month', false, NOW(), NOW())
    RETURNING *`,
    [payload.id, payload.workerId, payload.planId]
  );
  return rows[0];
}

async function createTransaction(payload) {
  const { rows } = await pool.query(
    `INSERT INTO payment_transactions (
      id, worker_subscription_id, worker_id, amount, currency, status, provider, created_at
    ) VALUES ($1, $2, $3, $4, 'ZAR', 'pending', $5, NOW())
    RETURNING *`,
    [payload.id, payload.workerSubscriptionId, payload.workerId, payload.amount, payload.provider]
  );
  return rows[0];
}

async function confirmTransaction(payload) {
  const status = payload.paid ? 'paid' : 'failed';
  const { rows } = await pool.query(
    `UPDATE payment_transactions
     SET status = $2,
         provider_reference = $3,
         paid_at = CASE WHEN $2 = 'paid' THEN NOW() ELSE paid_at END
     WHERE id = $1
     RETURNING *`,
    [payload.transactionId, status, payload.providerReference]
  );
  return rows[0] || null;
}

async function activateSubscriptionForTransaction(transactionId) {
  await pool.query(
    `UPDATE worker_subscriptions ws
     SET status = 'active',
         last_payment_at = NOW(),
         current_period_start = NOW(),
         current_period_end = NOW() + INTERVAL '1 month',
         next_billing_at = NOW() + INTERVAL '1 month',
         updated_at = NOW()
     FROM payment_transactions pt
     WHERE pt.id = $1
       AND pt.worker_subscription_id = ws.id
       AND pt.status = 'paid'`,
    [transactionId]
  );
}

async function listWorkerTransactions(workerId) {
  const { rows } = await pool.query(
    `SELECT id, worker_subscription_id, amount, currency, status, provider, provider_reference, paid_at, created_at
     FROM payment_transactions WHERE worker_id = $1 ORDER BY created_at DESC`,
    [workerId]
  );
  return rows;
}

module.exports = {
  createPlan,
  listPlans,
  findPlan,
  createPendingSubscription,
  createTransaction,
  confirmTransaction,
  activateSubscriptionForTransaction,
  listWorkerTransactions
};
