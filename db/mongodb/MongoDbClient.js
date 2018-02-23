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

  /**
   * Get Document Collection by his Token
   * @param {*} collection Collection Name
   * @param {*} id Document Id
   */
  getById(collection, id) {
    return this.init()
      .then((db) => {
        return db
          .collection(collection)
          .findAsync({ '_id': id })
          .then((cursor) => {
            return cursor
              .toArrayAsync();
          });
      });
  };

  /**
   * Insert a new Document in the mongoose schema
   * @param {Object} documents Document or documents to insert
   */
  create(document) {
    return new Promise((resolve, reject) => {
      this.init()
        .then((db) => {
          document
            .save((error, replaced) => {
              if (error) {
                reject(error);
              } else {
                resolve(replaced);
              }
            })
        });
    })
  };

  /**
  * Update Document
  * @param {Object} document Document to update
  */
  update(document) {
    return new Promise((resolve, reject) => {
      this.init()
        .then((db) => {
          document
            .save((error, replaced) => {
              if (error) {
                reject(error);
              } else {
                resolve(replaced);
              }
            })
        });
    })
  };

  /**
  * Delete Document
  * @param {String} document Document model
  */
  delete(document) {
    return new Promise((resolve, reject) => {
      return this.init()
        .then((db) => {
          return document
            .remove((error, removed) => {
              if (error) {
                reject(error);
              } else {
                resolve(removed);
              }
            });
        });
    });
  };

  /**
   * Chainnable Query
   * @returns {ChainnableQuery} Connector Type
   * @param {*} collection collection to query
   * @param {*} query Query Object
   */
  query(collection, query = null) {
    return new ChainnableQuery(this, collection, query);
  }

  /*
    filter(collection, filters) {
      const createFilter = require('odata-v4-mongodb').createFilter;
      const filter = createFilter(filters);
      // collection instance from MongoDB Node.JS Driver
      return this.init()
        .then((db) => {
          return db
            .collection(collection)
            .findAsync(filter)
            .then((cursor) => {
              return cursor
                .toArrayAsync();
            });
        });
    }
    */
}

module.exports = MongoDbClient;