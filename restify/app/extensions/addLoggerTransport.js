const logger = require('../../../logger');
const ExtensionBase = require('./../ExtensionBase');

/**
 * Add Custom Transport to logger
 * @class AddCustomFormatterExtension
 * @extends {ExtensionBase}
 */
class AddLoggerTransport extends ExtensionBase {

  /**
   * Add Transport to Logger
   * @param {any} config Configuration Settings
   * @memberof AddLoggerTransport
   */
  execute(callback) {
		const winston = require('winston')
    logger.addTransport(callback(winston));
  };

}

module.exports = AddLoggerTransport;
