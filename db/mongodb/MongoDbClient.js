'use strict';
const expr = require('./../../expressions/Expressions');
const ChainnableQuery = require('./ChainnableQuery');
const ConnectorClientBase = require('./../ConnectorClientBase');
const mongoose = require('mongoose');

let mongoDbClient = null;

/**
 * Connect to the mongo DB
 * @param {String} connectionString Connection String
 * @returns {Promise<MongoClient>} Returns a MongoClient
 */
function _connect(connectionString) {
  return new Promise((resolve, reject) => {
    try {
      if (!mongoDbClient) {
        const _promise = require('bluebird');
        _promise.promisifyAll(require('mongodb'))
          .MongoClient
          .connect(connectionString, (err, connection) => {
            if (err) {
              return reject(err);
            }
            // Resolve with the connection
            mongoDbClient = connection;

            mongoose.Promise = _promise;
            mongoose.connect(connectionString, {
              useMongoClient: true,
            });
            resolve(connection);
          });
      } else {
        resolve(mongoDbClient);
      }

    } catch (ex) {
      reject(ex);
    }
  })
}

class MongoDbClient extends ConnectorClientBase {

  constructor(connectionString) {
    super();
    this.connectionString = connectionString;

    // Call inmediately to connect mongoose
    this.init()
      .then(() => {
        // Do Nothing
      }, (err) => {
        console.error(err);
      });
  }

  /**
   * Useful for check the connection before any request 
   */
  init() {
    return _connect(this.connectionString);
  }

  /**
   * Get the native (mongodb client) for weird stuff
   */
  native() {
    return this.init();
  }
}

module.exports = MongoDbClient;