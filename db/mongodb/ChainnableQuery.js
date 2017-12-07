const expr = require('./../../expressions');

let _client;
let _collection;
let _query;
/**
 * Chainnable Query for deconstruct an advanced query
 */
class ChainnableQuery {

  /**
   * Create a new instance 
   * @param {ConnectorClientBase} rawClient  DB Client (ConnectorClientBase)
   * @param {String} collection Collection to query
   * @param {Object} query Query
   */
  constructor(rawClient, collection, query) {
    _client = rawClient;
    _collection = collection;
    _query = query || {};
  }

  /**
   * Filter expressions
   * @param {Object} filters All filters for the determined query
   */
  filter(filters) {
    _query.query = filters;
    return this;
  }

  /**
   * Skip X records in the query
   * @param {Number} skippedItems 
   */
  skip(skippedItems) {
    _query.skip = skippedItems;
    return this;
  }

  /**
   * Constraint the records returned by the query
   * @param {Number} topCount 
   */
  top(topCount) {
    _query.limit = topCount;
  }

  /**
   * List of returned fields
   * @param {Object} fields 
   */
  fields(fields) {
    _query.project = fields;
  }

  /**
   * Order the query
   * @param {String} orderBy 
   */
  orderBy(orderBy) {
    _query.sort = orderBy;
  }

  /**
   * Execute the query againt the DB Client
   */
  toArray() {
    return _client
      .init()
      .then((db) => {
        const chain = db
          .collection(_collection)
          .find(_query.query || {});

        expr.whenTrue(_query.projection, () => {
          chain.project(_query.projection);
        });
        expr.whenTrue(_query.sort, () => {
          chain.sort(_query.sort);
        });
        expr.whenTrue(_query.skip, () => {
          chain.skip(_query.skip);
        });
        expr.whenTrue(_query.limit, () => {
          chain.limit(_query.limit);
        });

        return chain
          .toArrayAsync();
      });
  }
}

module.exports = ChainnableQuery;