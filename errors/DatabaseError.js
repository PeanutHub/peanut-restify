'use strict';
const AbstractError = require('./AbstractError');
const logger = require('peanut-restify/logger');
/**
 * Define a Generic Error
 */
class DatabaseError extends AbstractError {
  /**
   * Create a Database Error
   * @param {String} errorDescription Error message description for verbose description
   * @param {Error} error Error associated with the error
   */
  constructor(errorDescription, error) {
    super('DATABASE_ERROR', errorDescription, {});

    // Check
    if (!error) {
      throw new Error('the parameter error in DatabaseError cant be null');
    }

    if (!(error instanceof Error)) {
      throw new Error('Database Error need an error associated to the db error');
    }

    // Add associated error
    this['meta_data'] = {
      message: error.message,
    };

    logger.error(error.message);
    logger.debug(this);
  }
}

module.exports = DatabaseError;
