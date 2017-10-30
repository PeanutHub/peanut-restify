const ExtensionBase = require('./../ExtensionBase');
const lodash = require('lodash');

/**
 * Check if the model Schema definition is Valid
 * for the current Model
 * @class IsValidExtension
 * @extends {ExtensionBase}
 */
class IsValidExtension extends ExtensionBase {

  /**
   * Check if a model is Valid against his Schema definition
   * @param {any} config Configuration Settings
   * @param {any} model Model instance
   * @returns {Boolean} if the model is Valid
   * @memberof IsValidExtension
   */
  execute(config, model) {
    const hasErrors = model.validateSync();
    if (!hasErrors) {
      return true;
    }
    return false;
  };

}

module.exports = IsValidExtension;
