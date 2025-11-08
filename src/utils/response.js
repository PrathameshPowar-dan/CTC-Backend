/**
 * Sends a standardized success response
 * 
 * @param {Response} res - Express response object
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status (default 200)
 * @param {object} data - Optional payload
 */
function success(res, message = 'Success', statusCode = 200, data = {}) {
  return res.status(statusCode).json({
    status: true,
    code: 'SUCCESS',
    message,
    data
  });
}

/**
 * Sends a standardized failure response (if you ever want to send it manually)
 */
function failure(res, message = 'Failure', statusCode = 400, code = 'FAILED', data = {}) {
  return res.status(statusCode).json({
    status: false,
    code,
    message,
    data
  });
}

module.exports = { success, failure };
