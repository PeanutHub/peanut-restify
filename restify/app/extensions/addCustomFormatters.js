const ExtensionBase = require('./../ExtensionBase');
/**
 * Add Custom Formatters For content-types
 * @class AddCustomFormatterExtension
 * @extends {ExtensionBase}
 */
class AddCustomFormatterExtension extends ExtensionBase {

  /**
   * Add Custom Content-types for others mime types
   * @param {any} config Configuration Settings
   * @memberof AddCustomFormatterExtension
   */
  execute(config) {
    //Add Property Return for Some Response Types
    var defaultPlainFormatter = this.server.formatters["text/plain"];
    this.server.formatters["text/html"] = defaultPlainFormatter;
    this.server.formatters["text/css"] = defaultPlainFormatter;
  };

}

module.exports = AddCustomFormatterExtension;
