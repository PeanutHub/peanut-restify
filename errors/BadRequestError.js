'use strict';
const AbstractError = require('./AbstractError');

/**
 * Define a Generic Error
 */
class BadRequestError extends AbstractError {
  /**
   * Create a Bad Request Generic Error
   * @param {String} errorCode Error code for the exception (useful for localization independency error)
   * @param {String} errorDescription Error message description for verbose description
   * @param {Object} metaData single object with additional data to attach in the exception
   */
  constructor(errorCode, errorDescription, metaData) {
    super(errorCode, errorDescription, metaData);

    // Set the http status code
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;