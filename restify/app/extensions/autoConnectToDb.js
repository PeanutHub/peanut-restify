const expr = require('../../../expressions')
const ExtensionBase = require('./../ExtensionBase');
const connection = require('./../../../db')

/**
 * Add database auto connection, for checking a connection in bootstrap
 * @class AutoConnectToDbExtension
 * @extends {ExtensionBase}
 */
class AutoConnectToDbExtension extends ExtensionBase {

  /**
   * Add Custom Content-types for others mime types
   * @param {any} config Configuration Settings
   * @memberof AutoConnectToDbExtension
   */
  execute(config) {
    // try to connect at startup
    expr.whenTrue(config.onConnectionChanged === undefined, () => {
      config.onConnectionChanged = (arg) => null
    })

    const conn = connection.getConnection();
    const { app } = this;

    conn.on('connection:reconnected', () => {
      config.onConnectionChanged('reconnected')
      app.emit('connection:reconnected')
    })
    conn.on('connection:connected', () => {
      config.onConnectionChanged('connected')
      app.emit('connection:connected')
    })
    conn.on('connection:disconnected', () => {
      config.onConnectionChanged('disconnected')
      app.emit('connection:disconnected')
    })
  };
}

module.exports = AutoConnectToDbExtension;
