const ExtensionBase = require('./../ExtensionBase');
const restify = require('restify');

/**
 * Add Standards plugins like queryparser , and bodyparsers for restify
 * 
 * @class AddStandardPluginsExtension
 * @extends {ExtensionBase}
 */
class AddStandardPluginsExtension extends ExtensionBase {

  /**
   * Add Standard Plugin's
   * @param {any} config Configuration Settings
   * @memberof AddStandardPluginsExtension
   */
  execute(config) {
    this.server.use(restify.plugins.bodyParser({
      mapParams: false
    }));
    this.server.use(restify.plugins.queryParser());
  };

}

module.exports = AddStandardPluginsExtension;
