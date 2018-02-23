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
   * @param {Object|Object[]} documents Document or documents to insert
   */
  create(documents) {
    return new Promise((resolve, reject) => {
      this.init()
        .then((db) => {
          let arrayToInsert = documents;
          if (!Array.isArray(documents)) {
            arrayToInsert = [documents];
          }

          const defers = [];
          arrayToInsert.forEach((doc) => {
            defers.push(new Promise((resolve, reject) => {
              doc.save((error, replaced) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(replaced);
                }
              })
            }));
          });

          Promise
            .all(defers)
            .then(resolve, reject);
        });
    })
  };

  /**
  * Update Document By his Id
  * @param {String} collection Collection Name
  * @param {String} id Document Id
  * @param {Object} document Document to update
  */
  updateById(collection, id, document) {
    collection
    const ObjectId = require('mongodb').ObjectId;
    return this.init()
      .then((db) => {
        delete document._id;  // for clean step!
        return db
          .collection(collection)
          .updateOneAsync({ '_id': id }, { '$set': document });
      });
  };

  /**
  * Delete Document By his Id
  * @param {String} collection Collection Name
  * @param {String} token Token to delete
  */
  deleteById(collection, token) {
    const ObjectId = require('mongodb').ObjectId;
    return this.init()
      .then((db) => {
        return db
          .collection(collection)
          .deleteOneAsync({ '_id': new ObjectId(token) });
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