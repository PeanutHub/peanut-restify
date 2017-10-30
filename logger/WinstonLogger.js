'use strict';
const logger = require('winston');

/**
 * Winston Logger
 */
class WinstonLogger {

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * Debug Message
   * @param {string} message Message for log
   * @param {any} metadata Object to log
   */
  debug(message, metadata) {
    logger.debug(message, metadata);
  }

  /**
   * Error Message
   * @param {string} message Message for log
   * @param {any} metadata Object to log
   */
  error(message, metadata) {
    logger.error(message, metadata);
  }

  /**
   * Info Message
   * @param {string} message Message for log
   * @param {any} metadata Object to log
   */
  info(message, metadata) {
    logger.info(message, metadata);
  }
};

module.exports = WinstonLogger;