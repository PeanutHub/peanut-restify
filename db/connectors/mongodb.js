const ConnectorBase = require('./../ConnectorBase');
const logger = require('./../../logger');
const MongoDbClient = require('./../mongodb/MongoDbClient');
let _client = null;

class MongoDB extends ConnectorBase {

  constructor(settings) {
    super(settings);
  }

  /**
   * Get Datasource client
   */
  getDatasourceClient(app) {
    try {
      require('mongodb');
      require('odata-v4-mongodb');
      require('mongoose');
      
      return new MongoDbClient(this.connectionString, app);
    } catch (error) {
      logger.error(`you need to install 'Mongo DB Client' before you can use it (npm install --save mongodb@3 odata-v4-mongodb mongoose@5)`);
      throw error
    }
  }

  /**
   * Get the Connection for the connector
   * @returns {ConnectorClientBase} Connector Client Base
   * @memberof DocumentDB
   */
  getConnection(app) {
    if (!_client) {
      const mongoFacadeClient = this.getDatasourceClient(app);
      _client = mongoFacadeClient;
    }

    return _client;
  }

}

module.exports = MongoDB;
