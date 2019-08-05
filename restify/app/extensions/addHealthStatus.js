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
      require(config.packagePath);
    } catch (exception) {
      console.error('[addHealthStatus] the package json not exists in the path!');
      console.debug(exception);
      throw exception;
    }

    this.app.addToWhiteList(this.config);
    this.server.get(
      {path: this.config.route},
      (req, res, next) => {
        this.getStatus()
          .then(status => {
            let labels = config.labels;
            if (typeof labels === 'function') {
              labels = labels();
            };

            expr.whenTrue(labels, () => {
              // merge with some additional data
              status = lodash.defaultsDeep(status, { labels });
            });

            res.send(200, status);
            next();
          })
          .catch(error => {
            res.send(200, error);
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
    const pad = s => (s < 10 ? '0' : '') + s;
    const hours = Math.floor(seconds / (60 * 60));
    const mins = Math.floor(seconds % (60 * 60) / 60);
    const secs = Math.floor(seconds % 60);

    return pad(hours) + ':' + pad(mins) + ':' + pad(secs);
  }

  /**
   * Get status for each important part for the system
   * @returns 
   * @memberof addHealthStatusExtension
   */
  getStatus() {
    return new Promise((resolve, reject) => {
      let status = {
        status: "UP",
        up_time: this.formatTime(process.uptime()),
      };

      this.getInfo()
        .then(info => {
          status[info.name] = info.values;
          resolve(status);
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  };

  /**
   * Get information about the environment 
   * @returns Environment Information
   * @memberof addHealthStatusExtension
   */
  getInfo() {
    return new Promise(resolve => {
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