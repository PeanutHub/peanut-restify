'use strict';

/**
 * Peinau Base Class Error
 */
class AbstractError extends Error {
  /**
   * Create a Peinau Generic Error
   * @param {String} errorCode Error code for the exception (useful for localization independency error)
   * @param {String} errorDescription Error message description for verbose description
   * @param {Object} metaData single object with additional data to attach in the exception
   */
  constructor(errorCode, errorDescription, metaData) {
    super(errorDescription);

    if (!errorCode) {
      throw new Error('errorCode is required');
    }

    if (!errorDescription) {
      throw new Error('errorDescription is required');
    }

    // Set in the snake case format for better readable in JSON
    this['error_code'] = errorCode;
    this['error_description'] = errorDescription;
    this['meta_data'] = metaData || {};
  }

  toJSON() {
    delete this.statusCode; // Remove this property, only for internal restify
    return this;
  }
}

module.exports = AbstractError;
