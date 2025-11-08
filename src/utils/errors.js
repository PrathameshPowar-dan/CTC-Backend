function createError(message, statusCode = 500, code = 'INTERNAL_ERROR') {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  err.isOperational = true;
  return err;
}

const badRequest = (msg = 'Bad Request') => createError(msg, 400, 'BAD_REQUEST');
const unauthorized = (msg = 'Unauthorized') => createError(msg, 401, 'UNAUTHORIZED');
const forbidden = (msg = 'Forbidden') => createError(msg, 403, 'FORBIDDEN');
const notFound = (msg = 'Not Found') => createError(msg, 404, 'NOT_FOUND');
const conflict = (msg = 'Conflict') => createError(msg, 409, 'CONFLICT');
const internal = (msg = 'Internal Server Error') => createError(msg, 500, 'INTERNAL_ERROR');

module.exports = {
  createError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  internal
};
