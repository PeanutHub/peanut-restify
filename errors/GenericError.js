'use strict';
const AbstractError = require('./AbstractError');
const logger = require('peanut-restify/logger');

/**
 * Define a Generic Error
 */
class GenericError extends AbstractError {
  /**
   * Create a Peinau Generic Error
   * @param {String} errorCode Error code for the exception (useful for localization independency error)
   * @param {String} errorDescription Error message description for verbose description
   * @param {Object} metaData single object with additional data to attach in the exception
   */
  constructor(errorCode, errorDescription, metaData) {
    super(errorCode, errorDescription, metaData);

    logger.error(errorDescription);
    logger.debug(this);
  }
}

module.exports = GenericError;
