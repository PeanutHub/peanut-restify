const ExtensionBase = require('./../ExtensionBase');

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
    this.server.on('MethodNotAllowed', function (req, res) {
      if (req.method.toLowerCase() === 'options') {
        var allowHeaders = ['Accept', 'Authorization', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin']; // added Origin & X-Requested-With

        if (res.methods.indexOf('OPTIONS') === -1) {
          res.methods.push('OPTIONS');
        }

        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
        res.header('Access-Control-Allow-Methods', res.methods.join(', '));
        res.header('Access-Control-Allow-Origin', req.headers.origin);

        return res.send(204);
      } else
        return res.send(405, 'Method is not allowed');
    });
  };

}

module.exports = EnableCorsExtension;
