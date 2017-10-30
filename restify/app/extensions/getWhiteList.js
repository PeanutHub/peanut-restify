const ExtensionBase = require('./../ExtensionBase');
const addToWhiteList = require('./addToWhiteList');

/**
 * Support for whitelist Operations
 * 
 * @class GetWhiteListExtension
 * @extends {ExtensionBase}
 */
class GetWhiteListExtension extends ExtensionBase {

  /**
   * Get Whitelist Routes
   * @param {any} config Configuration Settings
   * @memberof GetWhiteListExtension
   */
  execute(config) {
    return addToWhiteList.routes;
  };

}

module.exports = GetWhiteListExtension;
