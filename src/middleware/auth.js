const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { AppError } = require('../utils/errors');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError(401, 'Missing or invalid authorization header'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.accessTokenSecret);
    req.user = payload;
    return next();
  } catch {
    return next(new AppError(401, 'Invalid access token'));
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, 'Forbidden'));
    }
    return next();
  };
}

module.exports = { authenticate, authorize };
