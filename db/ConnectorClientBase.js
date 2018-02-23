const ChainnableQuery = require('./mongodb/ChainnableQuery');

class ConnectorClientBase {
  /**
     * Useful for check the connection before any request 
     */
  init() {
    throw new Error('NOT_IMPLEMENTED_EXCEPTION: you must override this method in order to use it')
  }

  /**
   * Get the native (mongodb client) for weird stuff
   */
  native() {
    throw new Error('NOT_IMPLEMENTED_EXCEPTION: you must override this method in order to use it')
  }

  /**
   * Get Document Collection by his Token
   * @param {*} collection Collection Name
   * @param {*} token Document Id
   * @returns {Promise} Process Promise
   */
  getById(collection, token) {
    throw new Error('NOT_IMPLEMENTED_EXCEPTION: you must override this method in order to use it')
  };

  /**
   * Insert a new Document in the target Collection
   * @param {*} collection Collection Name
   * @param {Object|Object[]} documents Document or documents to insert
   * @returns {Promise} Process Promise
   */
  create(collection, documents) {
    throw new Error('NOT_IMPLEMENTED_EXCEPTION: you must override this method in order to use it')
  };

   /**
   * Insert a new Document in the mongoose schema
   * @param {Object|Object[]} documents Document or documents to insert
   * @returns {Promise} Process Promise
   */
  create(documents) {
    throw new Error('NOT_IMPLEMENTED_EXCEPTION: you must override this method in order to use it')
  };

  /**
  * Update Document By his Id
  * @param {String} collection Collection Name
  * @param {String} token Token
  * @param {Object} document Document to update
  * @returns {Promise} Process Promise
  */
  updateById(collection, token, document) {
    throw new Error('NOT_IMPLEMENTED_EXCEPTION: you must override this method in order to use it')
  };

  /**
  * Delete Document By his Id
  * @param {String} collection Collection Name
  * @param {String} token Token to delete
  * @returns {Promise} Process Promise
  */
  deleteById(collection, token) {
    throw new Error('NOT_IMPLEMENTED_EXCEPTION: you must override this method in order to use it')
  };

  /**
   * Chainnable Query
   * @returns {ChainnableQuery} Connector Type
   * @param {*} collection collection to query
   * @param {*} query Query Object
   * @returns {Promise} Process Promise
   */
  query(collection, query) {
    throw new Error('NOT_IMPLEMENTED_EXCEPTION: you must override this method in order to use it')
  }
}

module.exports = ConnectorClientBase;