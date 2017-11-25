const ExtensionBase = require('./../ExtensionBase');
const corsMiddleware = require('restify-cors-middleware');
const lodash = require('lodash');
/**
 * Enable CORS for restify
 * 
 * @class EnableCORSExtension
 * @extends {ExtensionBase}
 */
class EnableCorsExtension extends ExtensionBase {

  /**
   * Enable CORS
   * @param {any} config Configuration Settings
   * @memberof EnableCorsExtension
   */
  execute(config) {
    const settings = lodash.defaultsDeep(config, {
      origins: ['*'],
      allowedHeaders: []
    });

    const allowedHeaders = ['X-Api-Key', 'Access-Control-Allow-Origin', 'Authorization']
    lodash.forEach(settings.allowedHeaders, (headerSupported) => {
      allowedHeaders.push(headerSupported);
    });

    const cors = corsMiddleware({
      preflightMaxAge: 5, //Optional
      origins: settings.origins,
      allowedHeaders: allowedHeaders
    });
    this.server.pre(cors.preflight);
    this.server.use(cors.actual);
  };

}

module.exports = EnableCorsExtension;