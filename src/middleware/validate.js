const { AppError } = require('../utils/errors');

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
    if (error) {
      return next(new AppError(400, error.details.map((d) => d.message).join(', ')));
    }

    req[source] = value;
    return next();
  };
}

module.exports = validate;
