const ExtensionBase = require("./../ExtensionBase");
const restify = require("restify");
const jwt = require("peanut-restify-jwt");
const fileSystem = require("fs");
const lodash = require("lodash");

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
    const jwtConfig = lodash.defaultsDeep(config, {
      publicKeyPath: null,
      allowedClientIds: null
    });

    // Convert to array if not
    if (jwtConfig.allowedClientIds && typeof jwtConfig.allowedClientIds == "string") {
      jwtConfig.allowedClientIds = [jwtConfig.allowedClientIds];
    }

    // If the allowedClientIds is null , disable
    if (jwtConfig.allowedClientIds && jwtConfig.allowedClientIds.length === 0) {
      jwtConfig.allowedClientIds = null;
    }

    if (!jwtConfig.publicKeyPath) {
      throw new Error("PublicKeyPath for JWT Auth is not configured");
    }

    jwtConfig.secret = fileSystem.readFileSync(jwtConfig.publicKeyPath);

    this.server.use(
      jwt(jwtConfig).unless({
        custom: req => {
          const fullPath = req.route.method + " " + req.route.path;
          const inWhiteList = this.app.getWhiteList().indexOf(fullPath) >= 0;

          return inWhiteList;
        },
        path: [new RegExp("/docs/swagger")]
      })
    );
  }
}

module.exports = AddJWTSecurityExtension;
