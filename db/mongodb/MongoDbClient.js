'use strict';
const ConnectorClientBase = require('./../ConnectorClientBase');
const mongoose = require('mongoose');

let mongoDbClient

/**
 * Connect to the mongo DB
 * @param {String} connectionString Connection String
 * @returns {Promise<MongoClient>} Returns a MongoClient
 */
function _connect(connectionString, mongoDbClientInstance) {
  return new Promise((resolve, reject) => {
    try {
      if (!mongoDbClient) {
        require('mongodb')
          .MongoClient
          .connect(connectionString, { useNewUrlParser: true }, (err, connection) => {
            if (err) { return reject(err); }
            // Resolve with the connection
            mongoDbClient = connection;

            mongoose.connection.on('disconnected', () => mongoDbClientInstance.emit('connection:disconnected'))
            mongoose.connection.on('reconnected', () => mongoDbClientInstance.emit('connection:reconnected'))
            mongoose.connection.on('connected', () => mongoDbClientInstance.emit('connection:connected'))

            mongoose.connect(connectionString, { useNewUrlParser: true, useCreateIndex: true })
              .then(() => resolve(connection))
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
      .then(() => { return null })
      .catch(console.error);
  }

  /**
   * Useful for check the connection before any request 
   */
  init() {
    return _connect(this.connectionString, this);
  }

  /**
   * Get the native (mongodb client) for weird stuff
   */
  native() {
    return this.init();
  }
}

module.exports = MongoDbClient;