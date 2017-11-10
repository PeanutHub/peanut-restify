const ExtensionBase = require('./../ExtensionBase');
const UdpTransport = require('./../../../logger/transports/UdpTransport')
const lodash = require('lodash');
const winston = require('winston');

/**
 * Add UDP Logging to Restify
 * 
 * @class AddUdpLoggerToWinston
 * @extends {ExtensionBase}
 */
class AddUdpLoggerToWinston extends ExtensionBase {

  /**
   * Enable JWT Security for request's
   * @param {any} config Configuration Settings
   * @memberof AddUdpLoggerToWinston
   */
  execute(config) {

    if (!config.port) {
      throw new Error('You need to set the port for UDP logger')
    }

    if (!config.host) {
      throw new Error('You need to set the host for UDP logger')
    }

    // Set the env from server
    config.env = this.app.getSettings().env;

    // Turn on debugs on default logger console transport
    winston.add(UdpTransport, config);
  };

}

module.exports = AddUdpLoggerToWinston;
