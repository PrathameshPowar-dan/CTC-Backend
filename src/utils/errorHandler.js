const { internal } = require('../utils/errors');

function errorHandler(err, req, res, next) {
  if (!err.statusCode) {
    console.error('💥 Unexpected Error:', err);
    err = internal();
  }

  const response = {
    status: false,
    code: err.code,
    message: err.message,
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  return res.status(err.statusCode).json(response);
}

module.exports = errorHandler;
