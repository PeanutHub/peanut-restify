const ConnectorBase = require('./../ConnectorBase');
const CONFIG = require('./../../config');
const logger = require('./../../logger');
const MongoDbClient = require('./../mongodb/MongoDbClient');
let _client = null;

class MongoDB extends ConnectorBase {

  constructor(settings) {
    super(settings);

    // Process the connection String
    //this.connectionString = settings.connectionString;
  }

  /**
   * Get Datasource client
   */
  getDatasourceClient() {
    try {
      require('mongodb');
      require('bluebird');
      require('odata-v4-mongodb');
      require('mongoose');
    } catch (ex) {
      logger.error(`you need to install 'Mongo DB Client' before you can use it (npm install --save bluebird mongodb@2.2.33 odata-v4-mongodb mongoose)`);
    }
    return new MongoDbClient(this.connectionString);
  }

  /**
   * Get the Connection for the connector
   * @returns {ConnectorClientBase} Connector Client Base
   * @memberof DocumentDB
   */
  getConnection() {
    if (!_client) {
      const mongoFacadeClient = this.getDatasourceClient();
      _client = mongoFacadeClient;
    }

    return _client;
  }

}

module.exports = MongoDB;
