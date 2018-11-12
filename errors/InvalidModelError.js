'use strict';
const AbstractError = require('./AbstractError');

/**
 * Define a Invalid model error
 */
class InvalidModelError extends AbstractError {
  /**
   * Create a invalid model Error
   * @param {Object} invalidModel Invalid model
   */
  constructor(invalidModel) {
    super('INVALID_MODEL', 'the requested model has invalid properties', {});

    if (!invalidModel || (invalidModel && !invalidModel.getValidationErrors)) {
      throw new Error('InvalidModel error need an invalid model');
    }

    // set the invalid properties in the metadata
    this['meta_data'] = {
      validations: invalidModel.getValidationErrors(),
    };

    // Set the http status code
    this.statusCode = 400;
  }
}

module.exports = InvalidModelError;
