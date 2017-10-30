const ExtensionBase = require('./../ExtensionBase');
const lodash = require('lodash');

/**
 * Get the validation errors against the Schema defintion
 * @class GetValidationErrorsExtension
 * @extends {ExtensionBase}
 */
class GetValidationErrorsExtension extends ExtensionBase {

  /**
   * Get Validation Error for the Schema definition
   * @param {any} config Configuration Settings
   * @param {any} model Model instance
   * @returns {Array} Validations list
   * @memberof GetValidationErrorsExtension
   */
  execute(config, model) {
    const validation = model.validateSync();
    if (validation) {
        return lodash.map(validation.errors, function (error) {
            return {
                message: error.message,
                kind: error.kind,
                path: error.path
            };
        });
    }
    return [];
  };

}

module.exports = GetValidationErrorsExtension;
