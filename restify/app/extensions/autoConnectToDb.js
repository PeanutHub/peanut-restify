const logger = require('../../../logger');
const expr = require('../../../expressions')
const ExtensionBase = require('./../ExtensionBase');
const connectorResolver = require('./../../../db')

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

    const { app } = this;
    const connection = connectorResolver.getConnection(app);
    connection.init()
      .then(() => logger.info('DB connected'))
      .catch(error => {
        logger.error('Error connecting to DB', error);
        process.emit('SIGTERM');
      })

    connection.on('connection:reconnected', () => {
      config.onConnectionChanged('reconnected')
      app.emit('connection:reconnected')
    })
    connection.on('connection:connected', () => {
      config.onConnectionChanged('connected')
      app.emit('connection:connected')
    })
    connection.on('connection:disconnected', () => {
      config.onConnectionChanged('disconnected')
      app.emit('connection:disconnected')
    })
  };
}

module.exports = AutoConnectToDbExtension;
