const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/jobzy',
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'replace-me-access',
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'replace-me-refresh',
  accessTokenTtl: process.env.JWT_ACCESS_TTL || '15m',
  refreshTokenTtlDays: Number(process.env.JWT_REFRESH_TTL_DAYS || 30),
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 12),
  corsOrigin: process.env.CORS_ORIGIN || '*'
};

module.exports = env;
