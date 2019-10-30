const ExtensionBase = require('peanut-restify/restify/app/ExtensionBase');
const addRouteOptions = require('peanut-restify/restify/app/extensions/addRouteOptions');

/**
 * Support for Get Route Operations
 *
 * @class GetRouteOptions
 * @extends {ExtensionBase}
 */
class GetRouteOptions extends ExtensionBase {
  /**
   * Get Get Route Routes
   * @param {any} config Configuration Settings
   * @memberof GetRouteOptions
   */
  execute(fullRoutePath) {
    return addRouteOptions.routes[fullRoutePath] || null;
  }
}

module.exports = GetRouteOptions;
