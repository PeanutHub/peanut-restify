const ExtensionBase = require('./../ExtensionBase');
const lodash = require('lodash');

/**
 * Check if the model Schema definition is Invalid
 * for the current Model
 * @class IsInvalidExtension
 * @extends {ExtensionBase}
 */
class IsInvalidExtension extends ExtensionBase {

  /**
   * Check if a model is Invalid against his Schema definition
   * @param {any} config Configuration Settings
   * @param {any} model Model instance
   * @returns {Boolean} if the model is Invalid
   * @memberof IsInvalidExtension
   */
  execute(config, model) {
    const hasErrors = model.validateSync();
    if (hasErrors) {
      return true;
    }
    return false;
  };

}

module.exports = IsInvalidExtension;
