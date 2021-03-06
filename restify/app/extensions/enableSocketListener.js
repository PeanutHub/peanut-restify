const ExtensionBase = require('./../ExtensionBase');
const lodash = require('lodash');
const winston = require('winston');
const RedisClient = require("ioredis");
let CONNECTIONREFUSED_THROWED = false;
/**
 * Enable command listener via Socket Pub/sub Provider (like redis, etc)
 * 
 * @class EnableSocketListener
 * @extends {ExtensionBase}
 */
class EnableSocketListener extends ExtensionBase {

  /**
   * Enable Socket Interaction for commander pattern
   * @param {any} config Configuration Settings
   * @memberof EnableSocketListener
   */
  execute(config) {
    var settings = lodash.defaultsDeep(config, {
      provider: 'redis',
      host: 'localhost',
      port: 6379,
      enableVerboseLoggingCommands: true,
    });

    if (!settings.port) {
      throw new Error('You need to set the port for Socket Listener')
    }

    if (!settings.host) {
      throw new Error('You need to set the host for Socket Listener')
    }

    if (settings.packageJSON) {
      const packageJSON = require(settings.packageJSON);

      if (!packageJSON.name) {
        throw new Error('The name variable is not found in package.json and it\`s required');
      }

      if (!packageJSON.version) {
        throw new Error('The version variable is not found in package.json and it\`s required');
      }

      this.appName = packageJSON.name;
      this.appVersion = packageJSON.version;
    }

    if (!this.appName) {
      throw new Error('The appName is not setted for socket listener');
    }

    if (!this.appVersion) {
      throw new Error('The appVersion is not setted for socket listener');
    }


    // Connect to a Redis Client
    this.redisClient = new RedisClient({
      showFriendlyErrorStack: true,
      port: settings.port,          // Redis port
      host: settings.host,   // Redis host
      family: 4,           // 4 (IPv4) or 6 (IPv6)
      db: 0
    });


    //Subscribe to appname, appname:version and appname:latest channels
    this.redisClient.subscribe(`${this.appName}`, `${this.appName}:${this.appVersion}`, (err, count) => {
      if (err) {
        if (settings.muteErrors) {
          winston.error('can\`t connect to socket for command instructions');
          winston.debug(err);
        } else {
          throw err;
        }
      }
    });

    this.redisClient.on('error', (ex) => {
      // CONNECTION REFUSED, THROW TOO MANY ERROR (Threads..) , soo
      // recognize the error, and throw only one type error
      if (ex.code === 'ECONNREFUSED') {
        if (!CONNECTIONREFUSED_THROWED) {
          winston.error('a connection error ocurred in the socket listener for command instructions (ECONNREFUSED)');
          winston.debug(ex);
        }
        CONNECTIONREFUSED_THROWED = true;
      } else {
        // If not send the error to log central
        winston.error('a socket command listener error has ocurred');
        winston.debug(ex);
      }
    });

    this.redisClient.on('message', (channel, message = '') => {
      let command = message;
      let argument = null;
      const symbol = ':=';

      if (message.indexOf(symbol) > 0) {
        const pieces = message.split(symbol);

        command = pieces[0];
        argument = pieces[1];
      }

      // Broadcast the socket command
      this.app.emit(`command:${command}`, argument);
    });

    if (settings.enableVerboseLoggingCommands) {
      this.app.on('command:enable-debug-level', (arg) => {
        winston.level = 'debug';
      });

      this.app.on('command:enable-info-level', (arg) => {
        winston.level = 'info';
      });

      this.app.on('command:disable-debug-level', (arg) => {
        winston.level = 'info';
      });
    }

    // Gracefully shutdown
    this.app.on('application:shutdown', (arg) => {
      this.redisClient.disconnect() 
    });
  };
}

module.exports = EnableSocketListener;
