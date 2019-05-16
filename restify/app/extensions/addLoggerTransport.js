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
  execute(getTransportFn) {
    logger.addTransport(getTransportFn());
  };

}

module.exports = AddLoggerTransport;
