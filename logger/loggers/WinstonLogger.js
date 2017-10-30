'use strict';
const LoggerBase = require('./../LoggerBase');
const winston = require('winston');

/**
 * Winston Logger
 */
class WinstonLogger extends LoggerBase {

  /**
   * Constructor
   */
  constructor() {
    super(winston);
  }
};

module.exports = WinstonLogger;
