const { v4: uuidv4 } = require('uuid');
const repository = require('./reviews.repository');

async function create(req, res, next) {
  try {
    const review = await repository.createReview({
      id: uuidv4(),
      reviewerId: req.user.sub,
      ...req.body
    });

    await repository.refreshWorkerRating(req.body.revieweeId);
    return res.status(201).json(review);
  } catch (error) {
    return next(error);
  }
}

module.exports = { create };
