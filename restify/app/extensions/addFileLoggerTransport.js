const logger = require('../../../logger');
const ExtensionBase = require('./../ExtensionBase');

/**
 * Add File Transport to logger
 * @class AddCustomFormatterExtension
 * @extends {ExtensionBase}
 */
class AddFileLoggerTransport extends ExtensionBase {

  /**
   * Add Transport to Logger
   * @param {object} options Configuration Settings (winston file transport options)
   * @memberof AddFileLoggerTransport
   */
  execute(options = {filename: 'app-logs.log'}) {
    const winston = require('winston');
    logger.addTransport(new winston.transports.File({...options}));
  };

}

module.exports = AddFileLoggerTransport;
