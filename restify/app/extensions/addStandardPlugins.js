const ExtensionBase = require('./../ExtensionBase');
const restify = require('restify');
const restifyValidation = require('node-restify-validation');
const corsMiddleware = require('restify-cors-middleware');

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

    const cors = corsMiddleware({
      preflightMaxAge: 5, //Optional
      origins: ['*'],
      allowHeaders: ['X-Api-Key']
    })

    this.server.use(restify.plugins.bodyParser({
      mapParams: false
    }));
    this.server.use(restify.plugins.queryParser());
    this.server.use(restifyValidation.validationPlugin({
      errorsAsArray: false
    }));

    this.server.pre(cors.preflight);
    this.server.use(cors.actual);
  };

}

module.exports = AddStandardPluginsExtension;