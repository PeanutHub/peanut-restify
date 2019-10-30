const ExtensionBase = require("./../ExtensionBase");
const jwt = require("peanut-restify-jwt");
const fileSystem = require("fs");
const lodash = require("lodash");
const getRouteOptions = require("./getRouteOptions");

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
    jwtConfig.getRouteOptions = this.app.getRouteOptions;

    this.server.use(
      jwt(jwtConfig).unless({
        custom: req => {
          const fullPathId = `${req.route.method.toUpperCase()} ${req.route.path}`;
          const opts = this.app.getRouteOptions(fullPathId);
          const inWhiteList = opts && opts.public === true;

          return inWhiteList;
        },
        path: [new RegExp("/docs/swagger")]
      })
    );
  }
}

module.exports = AddJWTSecurityExtension;
