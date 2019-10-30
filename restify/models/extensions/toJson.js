const ExtensionBase = require("./../ExtensionBase");

/**
 * Support for ToJson Format
 *
 * @class ToJsonExtension
 * @extends {ExtensionBase}
 */
class ToJsonExtension extends ExtensionBase {
  /**
   * Remove _id attribute
   * @param {any} config Configuration Settings
   * @param {any} model Model instance
   * @memberof ToJsonExtension
   */
  execute(config, model) {
    var object = model.toObject();
    delete object._id;
    return object;
  }
}

module.exports = ToJsonExtension;
