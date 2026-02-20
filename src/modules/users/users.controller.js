const usersRepository = require('./users.repository');

async function me(req, res, next) {
  try {
    const user = await usersRepository.findUserById(req.user.sub);
    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

module.exports = { me };
