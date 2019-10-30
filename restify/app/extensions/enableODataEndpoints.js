const ExtensionBase = require("./../ExtensionBase");
const lodash = require("lodash");
/**
 * Support for queryable ODATA endpoints
 *
 * @class EnableODataEndpointsExtension
 * @extends {ExtensionBase}
 */
class EnableODataEndpointsExtension extends ExtensionBase {
  /**
   * Add a static file route
   * @param {any} config Configuration Settings
   * @memberof EnableODataEndpointsExtension
   */
  execute(config) {
    const createQuery = require("odata-v4-mongodb").createQuery;

    this.app.enableODataEndpoint = _config => {
      const settings = lodash.defaultsDeep(_config, {
        debug: false,
        route: null,
        public: false,
        beforeExecute: query => {
          if (settings.debug) {
            console.log(query);
          }
        }
      });

      if (!settings.collection) {
        throw new Error("collection for ODATA is not configured");
      }

      if (!settings.route) {
        throw new Error("route prefix is not configured");
      }

      const DB = require("./../../../db");

      this.app.addRouteOptions({
        method: "GET",
        route: settings.route,
        public: true
      });

      this.server.get(
        {
          path: settings.route
        },
        (req, res, next) => {
          const query = createQuery(req.getQuery());

          // Before the chaining
          if (typeof settings.beforeExecute === "function") {
            settings.beforeExecute(req, query);
          }

          DB.getConnection()
            .query(settings.collection, query)
            .toArray()
            .then(
              response => {
                res.send(200, response);
                next();
              },
              err => {
                next(new errors.InternalServerError(err));
              }
            );
        }
      );
    };
  }
}

module.exports = EnableODataEndpointsExtension;
