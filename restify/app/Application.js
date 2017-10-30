'use strict';
const restify = require('restify');
const events = require('events');

/**
 * Application Wrapper
 * @class App
 */
class App {

  constructor() {
    this.emitter = new events.EventEmitter();
    this.server = restify.createServer(this.settings);
    this.extensions = {};
    this.decorators = {};
    this.models = {};
  }

  /**
   * Emit Event
   * @param {(string | symbol)} event Event Name
   * @param {...any[]} args Arguments
   * @memberof App
   */
  emit(event, args) {
    this.emitter.emit(event, args);
  }

  /**
   * Get value of something in the Core App , like some settings or maybe 
   * if a extension has been called!
   * @param {String} name Name of the setting to retrieve
   * @returns {Object} Setting Value
   * @memberof App
   */
  get(name) {
    const extensionPrefix = 'extension-';

    // Ask for a Extension Use??
    if (name.startsWith(extensionPrefix)) {
      // Get the values
      const extension = this.extensions[name.substring(extensionPrefix.length)];
      return extension;
    }

    switch (name) {
      case "is-dev-mode":
        return this.getSettings().env == "DEV";;
      case "family":
        return this.server.address().family;
      case "host":
        let url = this.server.address().address;
        if (url === "::") {
          url = "localhost"
        }
        return url;
      case "port":
        return this.server.address().port;
      case "url":
        return `http://${this.get('host')}:${this.get('port')}`;
    }
  }

  /**
   * Return the server instance
   * @returns Server Instance
   * @memberof App
   */
  getServer() {
    return this.server;
  }

  /**
   * Retrieve the configured settings for the Application
   * @returns {any}
   * @memberof App
   */
  getSettings() {
    return this.settings;
  }

  /**
   * Set Settings environment from the boot
   * @param {any} settings Boot settings
   * @memberof App
   */
  setSettings(settings) {
    this.settings = settings;
  }

  /**
   * Start Web server
   * 
   * @param {any} callback 
   * @memberof App
   */
  listen(callback) {
    this.server
      .listen(this.settings.port, () => {
        callback(this.server);
      });
  }
}

let app;
/**
 * Get Application Wrapper
 * @returns {App} Application Wrapper
 * @memberof App
 */
module.exports = () => {
  if (!app) {
    app = new App();
  }
  return app;
};
