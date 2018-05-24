const ConnectorBase = require('./../ConnectorBase');
const CONFIG = require('./../../config');
const logger = require('./../../logger');

let _client = null;

class DummyDb extends ConnectorBase {

  constructor(settings) {
    process.env.DATASOURCE_CONNECTION_STRING = '';
    super(settings);
  }

  /**
   * Get the Connection for the connector
   * @returns {ConnectorClientBase} Connector Client Base
   * @memberof DummyDb
   */
  getConnection() {
    throw new Error('connection is not configure (you need to set DATASOURCE_TYPE)');
  }

}

module.exports = DummyDb