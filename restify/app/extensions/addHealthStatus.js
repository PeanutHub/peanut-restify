const ExtensionBase = require('./../ExtensionBase');
const lodash = require('lodash');
const winston = require('winston');
const expr = require('./../../../expressions');

/**
 * Add health status for APIs
 * @class AddHealthEndpointExtension
 * @extends {ExtensionBase}
 */
class addHealthStatusExtension extends ExtensionBase {

  /**
   * Add health status for the API (default: /health)
   * @param {any} config Configuration Settings
   * @memberof addHealthStatusExtension
   */
  execute(config) {
    this.config = lodash.defaultsDeep(config, {
      route: "/health",
      method: "GET",
      packagePath: `${this.serverPath}/../package.json`
    });

    // check if the package.json exists
    try {
      var info = require(config.packagePath);
    } catch (ex) {
      console.error('[addHealthStatus] the package json not exists in the path!');
      console.debug(ex);
      process.exit();
    }

    this.app.addToWhiteList(this.config);
    this.server.get({
      path: this.config.route,
    }, (req, res, next) => {

      this.getStatus()
        .then(function (status) {

          let labels = config.labels;
          if (typeof labels === 'function') {
            labels = labels();
          };

          expr.whenTrue(labels, () => {
            // merge with some additional data
            status = lodash.defaultsDeep(status, {
              labels: labels
            });
          });

          res.send(200, status);
          next();
        }, function (status) {
          res.send(200, status);
          next();
        });

    });
  };

  /**
   * Format to semantic time
   * @param {any} seconds second started
   * @returns Time format
   * @memberof addHealthStatusExtension
   */
  formatTime(seconds) {
    function pad(s) {
      return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor(seconds % (60 * 60) / 60);
    var seconds = Math.floor(seconds % 60);

    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
  }

  /**
   * Get status for each important part for the system
   * @returns 
   * @memberof addHealthStatusExtension
   */
  getStatus() {
    return new Promise((resolve, reject) => {
      var status = {
        status: "UP",
        up_time: this.formatTime(process.uptime())
      };
      var _resolve = function (resolves) {
        resolves.forEach(function (fragment) {
          status[fragment.name] = fragment.values;
        }, this);
        resolve(status);
      };

      Promise.all([
        this.getInfo()
      ]).then(_resolve, (ex) => {
        console.error(ex);
        throw ex;
      });

    });
  };

  /**
   * Get information about the environment 
   * @returns Environment Information
   * @memberof addHealthStatusExtension
   */
  getInfo() {
    return new Promise((resolve, reject) => {
      const info = require(this.config.packagePath);

      resolve({
        name: "info",
        values: {
          profile: this.settings.env,
          name: info.name,
          version: info.version,
          routePrefix: this.settings.routePrefix,
          logging: {
            level: winston.level,
          },
        }
      });
    });
  };
}

module.exports = addHealthStatusExtension;