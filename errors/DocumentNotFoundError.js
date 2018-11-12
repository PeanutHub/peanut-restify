'use strict';
const AbstractError = require('./AbstractError');

/**
 * Define a Document Not Found model error
 */
class DocumentNotFoundError extends AbstractError {
  /**
   * Create a Document Not Found model Error
   * @param {String} idNotFound Document Id not found
   * @param {String} collectionName Collection name searched
   */
  constructor(idNotFound, collectionName) {
    super('DOCUMENT_NOT_FOUND', 'the document you requested is not found', {
      'id_not_found': idNotFound,
      'collection_name': collectionName,
    });

    // Set the http status code
    this.statusCode = 404;
  }
}

module.exports = DocumentNotFoundError;
