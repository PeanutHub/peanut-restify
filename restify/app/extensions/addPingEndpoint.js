const ExtensionBase = require('./../ExtensionBase');
const lodash = require('lodash');
const winston = require('winston');

/**
 * Add health status for APIs
 * @class addPingEndpointExtension
 * @extends {ExtensionBase}
 */
class addPingEndpointExtension extends ExtensionBase {

  /**
   * Add /ping endpoint with a valid "pong" response
   * @param {any} config Configuration Settings
   * @memberof addPingEndpointExtension
   */
  execute() {
    const config = {
      route: '/ping',
      method: 'GET'
    };

    this.app.addToWhiteList(config);
    this.server.get({
      path: config.route,
    }, (req, res, next) => {
      res.send(200, 'pong');
    });
  };
}

module.exports = addPingEndpointExtension;
