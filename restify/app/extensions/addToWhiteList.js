const ExtensionBase = require('./../ExtensionBase');
const PUBLIC_ROUTES = [];
/**
 * Support for whitelist Operations
 * 
 * @class AddToWhiteListExtension
 * @extends {ExtensionBase}
 */
class AddToWhiteListExtension extends ExtensionBase {
  
  /**
   * Insert a URI registry in the whitelist table
   * @param {any} config Configuration Settings
   * @memberof AddToWhiteListExtension
   */
  execute(config) {
    var _method = (config.method || "GET");
    //ADD to Whitelist
    PUBLIC_ROUTES.push(_method.toUpperCase() + " " + config.route);
  };

}

module.exports = {
  extension: AddToWhiteListExtension,
  routes: PUBLIC_ROUTES
};
