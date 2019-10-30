const ExtensionBase = require("peanut-restify/restify/app/ExtensionBase");
const CUSTOM_ROUTE_OPTIONS = {};
/**
 * Support for overrides specific routes to accept other clientIds
 *
 * @class AddRouteOptions
 * @extends {ExtensionBase}
 */
class AddRouteOptions extends ExtensionBase {
  /**
   * Insert a URI registry in the override table
   * @param {any} config Configuration Settings
   * @memberof AddRouteOptions
   */
  execute(config) {
    config.id = `${config.method} ${config.route}`;

    // ADD to Store
    CUSTOM_ROUTE_OPTIONS[config.id] = config;
  }
}

module.exports = {
  extension: AddRouteOptions,
  routes: CUSTOM_ROUTE_OPTIONS
};
