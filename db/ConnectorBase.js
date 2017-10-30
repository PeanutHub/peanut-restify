const CONFIG = require('./../config');
/**
 * Abstract Class for connector implementations
 * @class ConnectorBase
 */
class ConnectorBase {

  /**
   * Creates an instance of ConnectorBase.
   * @param {any} settings Configured Settings 
   * @memberof ConnectorBase
   */
  constructor(settings) {
    this.settings = settings;
    this.connectionString = CONFIG.get("DATASOURCE_CONNECTION_STRING");
  }

  /**
   * Get the Connector Implementation according the connector specified
   * @memberof ConnectorBase
   */
  getConnection() {
    throw new Error("getConnection method not implemented for connector!");
  }

}

module.exports = ConnectorBase;
