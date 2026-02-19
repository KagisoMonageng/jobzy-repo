const authService = require('./auth.service');

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const data = await authService.login(req.body);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const data = await authService.refresh(req.body.refreshToken);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    await authService.logout(req.body.refreshToken);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login, refresh, logout };
