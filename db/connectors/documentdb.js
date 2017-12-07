const ConnectorBase = require('./../ConnectorBase');
const CONFIG = require('./../../config');
const logger = require('./../../logger');

let _client = null;

class DocumentDB extends ConnectorBase {

  constructor(settings) {
    super(settings);

    // Process the connection String
    var parsed = this._parseConnectionString(this.connectionString);
    this.accountEndpoint = parsed.AccountEndpoint;
    this.accountKey = parsed.AccountKey;
  }

  /**
   * Get Datasource client
   */
  getDatasourceClient() {
    try {
      var test = require('documentdb');
    } catch (ex) {
      logger.error(`you need to install 'Azure Document Client' before you can use it (npm install --save documentdb)`);
    }
    const azureDocumentDB = require('documentdb');
    return azureDocumentDB;
  }

  /**
   * Get the Connection for the connector
   * @returns {ConnectorClientBase} Connector Client Base
   * @memberof DocumentDB
   */
  getConnection() {
    if (!_client) {
      const azureDocumentDB = this.getDatasourceClient();
      var DocumentClient = azureDocumentDB.DocumentClient;
      _client = new DocumentClient(
        this.accountEndpoint, {
          "masterKey": this.accountKey
        }
      );
    }

    return _client;
  }

  /**
   * Parse connection string into "AZURE DEFAULT"
   * @param {any} connectionString 
   * @returns Parsed Values
   * @memberof DocumentDB
   */
  _parseConnectionString(connectionString) {
    const splitted = connectionString.split(";");
    const parsed = {};
    splitted.forEach((rawValue) => {

      const key = rawValue.substring(0, rawValue.indexOf('='));
      const value = rawValue.substring(key.length + 1);
      parsed[key] = value;

    });

    return parsed;
  }

}

module.exports = DocumentDB