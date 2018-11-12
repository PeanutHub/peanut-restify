'use strict';
const AbstractError = require('./AbstractError');
const logger = require('peanut-restify/logger');
/**
 * Define a Generic Error
 */
class UnknowError extends AbstractError {
  /**
   * Create a Unknow Error
   * @param {String} errorDescription Error message description for verbose description
   * @param {Error} error Error associated with the error
   */
  constructor(errorDescription, error) {
    super('GENERAL_SYSTEM_ERROR', errorDescription, {});

    // Check
    if (!error) {
      throw new Error('the parameter error in UnknowError cant be null');
    }

    if (!(error instanceof Error)) {
      throw new Error('Unknow Error need an error associated to the db error');
    }

    // Add associated error
    this['meta_data'] = {
      message: error.message,
    };

    logger.error(error.message);
    logger.debug(error);
  }
}

module.exports = UnknowError;
