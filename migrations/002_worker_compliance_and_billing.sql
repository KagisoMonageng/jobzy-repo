ALTER TABLE users
  ADD COLUMN IF NOT EXISTS south_african_id_number TEXT,
  ADD COLUMN IF NOT EXISTS passport_number TEXT;

ALTER TABLE worker_profiles
  ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS background_check_status TEXT NOT NULL DEFAULT 'pending' CHECK (background_check_status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS application_submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  price_zar NUMERIC(10,2) NOT NULL,
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS worker_subscriptions (
  id UUID PRIMARY KEY,
  worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'cancelled', 'expired')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  next_billing_at TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  last_payment_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY,
  worker_subscription_id UUID REFERENCES worker_subscriptions(id) ON DELETE SET NULL,
  worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ZAR',
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  provider TEXT NOT NULL,
  provider_reference TEXT UNIQUE,
  paid_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_sa_id ON users(south_african_id_number);
CREATE INDEX IF NOT EXISTS idx_users_passport ON users(passport_number);
CREATE INDEX IF NOT EXISTS idx_worker_profiles_verification ON worker_profiles(verification_status, background_check_status);
CREATE INDEX IF NOT EXISTS idx_worker_subscriptions_worker ON worker_subscriptions(worker_id, status, current_period_end);
CREATE INDEX IF NOT EXISTS idx_payments_worker ON payment_transactions(worker_id, status);
