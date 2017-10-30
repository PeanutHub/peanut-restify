const ExtensionBase = require('./../ExtensionBase');
const restify = require('restify');
const jwt = require('restify-jwt');
const fileSystem = require('fs');

/**
 * Add JWT Security to restify
 * 
 * @class AddJWTSecurityExtension
 * @extends {ExtensionBase}
 */
class AddJWTSecurityExtension extends ExtensionBase {

  /**
   * Enable JWT Security for request's
   * @param {any} config Configuration Settings
   * @memberof AddJWTSecurityExtension
   */
  execute(config) {
    const app = this.app;
    const publicKey = fileSystem.readFileSync(`${this.serverPath}/config/certs/falabella_rsa.pub`);
    this.server.use(jwt({
        secret: publicKey
      })
      .unless({
        custom: (req) => {
          const fullPath = req.route.method + " " + req.route.path;
          const inWhiteList = app.getWhiteList().indexOf(fullPath) >= 0;
          return inWhiteList;
        },
        path: [
          new RegExp("/docs/swagger")
        ]
      })
    );
  };

}

module.exports = AddJWTSecurityExtension;
