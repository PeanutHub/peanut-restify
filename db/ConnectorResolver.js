const ConnectorClientBase = require('./ConnectorClientBase');
const CONFIG = require('./../config');

class ConnectorResolver {

  constructor(settings) {
    this.connectorType = CONFIG.get('DATASOURCE_TYPE', 'dummydb').toLowerCase();

    const ConnectorClass = require(`./connectors/${this.connectorType}`);
    this.connector = new ConnectorClass(settings);
  }

  /**
   * Get the Connector Type for the DB
   * @returns {String} Connector Type
   * @memberof ConnectorResolver
   */
  getConnectorType() {
    return this.connectorType;
  }

  /**
   * Get the Raw Connector implementation
   * @returns {ConnectorClientBase} Connector Implementation
   * @memberof ConnectorResolver
   */
  getConnection(app) {
    return this.connector.getConnection(app);
  }

}

module.exports = ConnectorResolver;
