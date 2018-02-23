const ExtensionBase = require('./../ExtensionBase');
const connection = require('./../../../db')
/**
 * Add database auto connection, for checking a connection in bootstrap
 * @class AutoConnectToDbExtension
 * @extends {ExtensionBase}
 */
class AutoConnectToDbExtension extends ExtensionBase {

  /**
   * Add Custom Content-types for others mime types
   * @param {any} config Configuration Settings
   * @memberof AutoConnectToDbExtension
   */
  execute(config) {
    // try to connect at startup
    connection.getConnection();
  };

}

module.exports = AutoConnectToDbExtension;
