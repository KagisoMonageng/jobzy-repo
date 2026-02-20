const { v4: uuidv4 } = require('uuid');
const repository = require('./payments.repository');
const { AppError } = require('../../utils/errors');

async function createPlan(req, res, next) {
  try {
    const plan = await repository.createPlan({ id: uuidv4(), ...req.body });
    return res.status(201).json(plan);
  } catch (error) {
    return next(error);
  }
}

async function listPlans(req, res, next) {
  try {
    const plans = await repository.listPlans();
    return res.json(plans);
  } catch (error) {
    return next(error);
  }
}

async function subscribe(req, res, next) {
  try {
    const plan = await repository.findPlan(req.body.planId);
    if (!plan) throw new AppError(404, 'Subscription plan not found');

    const subscription = await repository.createPendingSubscription({
      id: uuidv4(),
      workerId: req.user.sub,
      planId: plan.id
    });

    const transaction = await repository.createTransaction({
      id: uuidv4(),
      workerSubscriptionId: subscription.id,
      workerId: req.user.sub,
      amount: plan.price_zar,
      provider: req.body.provider
    });

    return res.status(201).json({ subscription, transaction });
  } catch (error) {
    return next(error);
  }
}

async function confirm(req, res, next) {
  try {
    const tx = await repository.confirmTransaction(req.body);
    if (!tx) throw new AppError(404, 'Transaction not found');
    if (tx.status === 'paid') {
      await repository.activateSubscriptionForTransaction(tx.id);
    }
    return res.json(tx);
  } catch (error) {
    return next(error);
  }
}

async function listMine(req, res, next) {
  try {
    const txs = await repository.listWorkerTransactions(req.user.sub);
    return res.json(txs);
  } catch (error) {
    return next(error);
  }
}

module.exports = { createPlan, listPlans, subscribe, confirm, listMine };
