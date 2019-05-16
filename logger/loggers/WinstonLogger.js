'use strict';
const LoggerBase = require('./../LoggerBase');
const winston = require('winston');
const { combine, timestamp, colorize, printf } = winston.format;

/**
 * Winston Logger
 */
class WinstonLogger extends LoggerBase {

  /**
   * Constructor
   */
  constructor() {
    const formatLog = (info) => `${info.timestamp} ${info.level}: ${info.message}`

    const logger = winston.createLogger({
      level: 'debug',
      format: winston.format.json(),
      transports: [new winston.transports.Console({
        format: combine(
          colorize(),
          timestamp(),
          printf(formatLog)
        ),
      })]
    });

    super(logger);
  }

  addTransport(transport) {
    this.logger.add(transport);
  }
};

module.exports = WinstonLogger;
