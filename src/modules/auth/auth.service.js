const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const env = require('../../config/env');
const usersRepository = require('../users/users.repository');
const authRepository = require('./auth.repository');
const workersRepository = require('../workers/workers.repository');
const { AppError } = require('../../utils/errors');

function buildAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, env.accessTokenSecret, {
    expiresIn: env.accessTokenTtl
  });
}

function buildRefreshToken(user) {
  return jwt.sign({ sub: user.id, type: 'refresh' }, env.refreshTokenSecret, {
    expiresIn: `${env.refreshTokenTtlDays}d`
  });
}

function computeRefreshExpiry() {
  const expires = new Date();
  expires.setDate(expires.getDate() + env.refreshTokenTtlDays);
  return expires;
}

async function register(payload) {
  const existing = await usersRepository.findUserByEmail(payload.email);
  if (existing) {
    throw new AppError(409, 'Email already exists');
  }

  const passwordHash = await bcrypt.hash(payload.password, env.bcryptRounds);
  const user = await usersRepository.createUser({
    id: uuidv4(),
    email: payload.email,
    passwordHash,
    role: payload.role,
    fname: payload.fname,
    lname: payload.lname,
    phone: payload.phone,
    southAfricanIdNumber: payload.southAfricanIdNumber,
    passportNumber: payload.passportNumber
  });

  if (user.role === 'worker') {
    await workersRepository.createPendingWorkerApplication(user.id);
  }

  return user;
}

async function login(payload) {
  const user = await usersRepository.findUserByEmail(payload.email);
  if (!user || !user.is_active) {
    throw new AppError(401, 'Invalid credentials');
  }

  const ok = await bcrypt.compare(payload.password, user.password_hash);
  if (!ok) {
    throw new AppError(401, 'Invalid credentials');
  }

  await usersRepository.updateLastLogin(user.id);

  const accessToken = buildAccessToken(user);
  const refreshToken = buildRefreshToken(user);

  await authRepository.createRefreshToken({
    id: uuidv4(),
    userId: user.id,
    token: refreshToken,
    expiresAt: computeRefreshExpiry()
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      fname: user.fname,
      lname: user.lname
    }
  };
}

async function refresh(refreshToken) {
  const tokenRecord = await authRepository.findRefreshToken(refreshToken);
  if (!tokenRecord || tokenRecord.revoked || new Date(tokenRecord.expires_at) < new Date()) {
    throw new AppError(401, 'Invalid refresh token');
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, env.refreshTokenSecret);
  } catch {
    throw new AppError(401, 'Invalid refresh token');
  }

  const user = await usersRepository.findUserById(payload.sub);
  if (!user) {
    throw new AppError(401, 'Invalid refresh token');
  }

  const accessToken = buildAccessToken(user);
  return { accessToken };
}

async function logout(refreshToken) {
  await authRepository.revokeRefreshToken(refreshToken);
}

module.exports = { register, login, refresh, logout };
