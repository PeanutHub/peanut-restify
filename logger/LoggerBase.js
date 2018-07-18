'use strict';

/**
 * Logger Base
 */
let previousLevel = null;
class LoggerBase {

  /**
   * Constructor
   * @param {*} logger Logger Interface
   */
  constructor(logger) {
    // Set Instance
    this.logger = logger;

    // ENUM Levels
    this.LEVELS = {
      'DEBUG': 'debug',
      'INFO': 'info',
      'NONE': 'none'
    };
  }

  /**
   * Set level for logger
   * @param {('debug'|'info'|'none')} level level to set
   */
  setLevel(level) {
    previousLevel = this.logger.level;
    this.logger.level = level;
  }

  /**
   * Mute all logging process from show in STDIN
   */
  mute() {
    this.setLevel(this.LEVELS.NONE);
  }

  /**
   * Unmute logging and set level to Debug
   */
  unmute() {
    this.setLevel(previousLevel || this.LEVELS.DEBUG);
  }

  /**
   * Debug Message
   * @param {string} message Message for log
   * @param {any} metadata Object to log
   */
  debug(message, metadata) {
    this.logger.debug(message, metadata);
  }

  /**
   * Error Message
   * @param {string} message Message for log
   * @param {any} metadata Object to log
   */
  error(message, metadata) {
    this.logger.error(message, metadata);
  }

  /**
   * Info Message
   * @param {string} message Message for log
   * @param {any} metadata Object to log
   */
  info(message, metadata) {
    this.logger.info(message, metadata);
  }
};

module.exports = LoggerBase;