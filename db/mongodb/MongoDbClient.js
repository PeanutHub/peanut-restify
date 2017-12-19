'use strict';
const expr = require('./../../expressions/Expressions');
const ChainnableQuery = require('./ChainnableQuery');
const ConnectorClientBase = require('./../ConnectorClientBase');

let mongoDbClient = null;
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
   * @param {*} token Document Id
   */
  getById(collection, token) {
    const ObjectId = require('mongodb').ObjectId;
    return this.init()
      .then((db) => {
        return db
          .collection(collection)
          .findAsync({ '_id': new ObjectId(token) })
          .then((cursor) => {
            return cursor
              .toArrayAsync();
          });
      });
  };

  /**
   * Insert a new Document in the target Collection
   * @param {*} collection Collection Name
   * @param {Object|Object[]} documents Document or documents to insert
   */
  create(collection, documents) {
    return this.init()
      .then((db) => {
        let arrayToInsert = documents;
        if (!Array.isArray(documents)) {
          arrayToInsert = [documents];
        }
        return db
          .collection(collection)
          .insertManyAsync(arrayToInsert);
      });
  };

  /**
  * Update Document By his Id
  * @param {String} collection Collection Name
  * @param {String} token Token
  * @param {Object} document Document to update
  */
  updateById(collection, token, document) {
    collection
    const ObjectId = require('mongodb').ObjectId;
    return this.init()
      .then((db) => {
        delete document._id;  // for clean step!
        return db
          .collection(collectionName)
          .updateOneAsync({ '_id': new ObjectId(token) }, { '$set': document });
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