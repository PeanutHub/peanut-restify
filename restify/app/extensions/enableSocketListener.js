const ExtensionBase = require('./../ExtensionBase');
const lodash = require('lodash');
const winston = require('winston');
const redis = require("ioredis");

/**
 * Enable command listener via Socket Pub/sub Provider (like redis, etc)
 * 
 * @class EnableSocketListener
 * @extends {ExtensionBase}
 */
class EnableSocketListener extends ExtensionBase {

  /**
   * Enable Socket Interaction
   * @param {any} config Configuration Settings
   * @memberof EnableSocketListener
   */
  execute(config) {
    this.config = lodash.defaultsDeep(config, {
      provider: 'redis',
      host: 'localhost',
      port: 6379,
      enableVerboseLoggingCommands: true
    });

    this.redisClient = new Redis({
      port: this.config.port,          // Redis port
      host: this.config.host,   // Redis host
      family: 4,           // 4 (IPv4) or 6 (IPv6)
      db: 0
    });

    this.redisClient.subscribe('news', function (err, count) {
      // Now we are subscribed to both the 'news' and 'music' channels.
      // `count` represents the number of channels we are currently subscribed to.
      debugger;

    });

  };
}

module.exports = EnableSocketListener;
