const ExtensionBase = require("./../ExtensionBase");
const fileSystem = require("fs");

/**
 * Support for configure a static file in restify
 *
 * @class staticFileExtension
 * @extends {ExtensionBase}
 */
class staticFileExtension extends ExtensionBase {
  /**
   * Add a static file route
   * @param {any} config Configuration Settings
   * @memberof staticFileExtension
   */
  execute(config) {
    this.app.addRouteOptions({
      route: config.route,
      method: "GET",
      public: true
    });

    this.server.get(
      {
        path: config.route
      },
      (req, res, next) => {
        var content = fileSystem.readFileSync(config.path, "utf-8");
        res.setHeader("content-type", config.contentType || "text/html");
        res.setHeader("cache-control", "public, max-age=3600"); //1hr cache control
        res.send(200, content);
      }
    );
  }
}

module.exports = staticFileExtension;
