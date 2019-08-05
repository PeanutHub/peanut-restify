const ExtensionBase = require('./../ExtensionBase');

/**
 * Add health status for APIs
 * @class addPingEndpointExtension
 * @extends {ExtensionBase}
 */
class addReadinesProve extends ExtensionBase {

  /**
   * Add /ready endpoint with a valid "ready" response when dependencies are available
   * @param {any} config Configuration Settings
   * @memberof addPingEndpointExtension
   */
  execute(config) {
    const routeConfig = {
      route: config.route || '/ready',
      method: config.method || 'GET'
    };

    this.app.addToWhiteList(routeConfig);
    this.server.get({ path: routeConfig.route }, (req, res, next) => {
			const statusCode = this.app.isReady() ? 200 : 500
			res.send(statusCode, { ready: this.app.isReady() });
		});
  };
}

module.exports = addReadinesProve;
