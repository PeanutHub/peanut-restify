'use strict';
const AbstractError = require('./AbstractError');

/**
 * Define a Generic Error
 */
class UnloggedError extends AbstractError {
  /**
   * Create a Unlogged Generic Error
   * @param {String} errorCode Error code for the exception s(useful for localization independency error)
   * @param {String} errorDescription Error message description for verbose description
   * @param {Object} metaData single object with additional data to attach in the exception
   */
  constructor(errorCode, errorDescription, metaData) {
    super(errorCode, errorDescription, metaData);
  }
}

module.exports = UnloggedError;