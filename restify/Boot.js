'use strict';
const fs = require('fs');
const path = require('path');
const logger = require('./../logger');
const lodash = require('lodash');

/**
 * Get Caller File for the function file 
 */
const _getCallerFile = () => {
  var originalFunc = Error.prepareStackTrace;
  var callerfile;
  try {
    var err = new Error();
    var currentfile;

    Error.prepareStackTrace = function (err, stack) {
      return stack;
    };

    currentfile = err.stack.shift().getFileName();

    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName();

      if (currentfile !== callerfile) break;
    }
  } catch (e) {}

  Error.prepareStackTrace = originalFunc;

  return callerfile;
}

/**
 * Simple Boot Loader for Restify Core
 * @class Boot
 */
class Boot {

  /**
   * Creates an instance of Boot.
   * @param {any} settings Settings for the boot system
   * @memberof Boot
   */
  constructor(settings) {
    const defaultSettings = require('./defaults/boot-settings.json');

    // remove each undefined variable before merge
    Object.keys(settings).forEach((key) => {
      if (typeof settings[key] === 'undefined') {
        delete settings[key];
      }
    });

    // Configure some variables
    this.settings = lodash.defaultsDeep(settings, defaultSettings); // Default Settings

    // Try to get from caller stack!
    if (!this.settings.appRootDir) {
      const serverFile = _getCallerFile(); // Point to server file
      const indexOfPathSeparator = serverFile.lastIndexOf("/") > 0 ? serverFile.lastIndexOf("/") : serverFile.lastIndexOf("\\");
      const appRootDir =  serverFile.substring(0, indexOfPathSeparator);
      this.settings.appRootDir = appRootDir;
    }

    if (!this.settings.endpointsPath) {
      this.settings.endpointsPath = `${this.settings.appRootDir}/endpoints`;
    }

    this.discoveredModels = [];

    // Add some logging function's
    ['debug', 'error', 'info'].forEach((level) => {
      this[level] = (message, metadata) => {
        if (this.settings.debug) {
          logger[level](message, metadata);
        }
      }
    });
  };

  /**
   * Initialize Booting Process
   * @param {any} app Application
   * @param {(error,app)=>void} callback Callback function
   * @returns 
   * @memberof Boot
   */
  start(app, callback = () => {}) {
    try {
      app.emit('boot started');

      app.setSettings(this.settings); // Settings
      this.app = app; // Application Server Wrapper

      // Start Booting Process
      this.info('');
      this.info('[Boot started ...]');
      this.discoverDecorators();
      this.info('');
      this.discoverExtensions();
      this.info('');
      this.info('[Boot finished ...]')

      app.emit('boot finished');
      this.info('');

      callback(null, app);

    } catch (ex) {
      callback(ex, null);
    }
  }

  /**
   * Get Folders list inside a target folder
   * @param {String} endpointsPath Folder to get the paths
   * @returns {Array<String>} Array of paths
   * @memberof Boot
   */
  getPaths(folderPath) {
    if (!fs.existsSync(folderPath)) {
      return [];
    }

    return fs
      .readdirSync(folderPath)
      .filter((file) => {
        return fs
          .statSync(path.join(folderPath, file))
          .isDirectory();
      });
  }

  /**
   * Get Files list inside a target folder
   * @param {String} folderPath Folder to get the files
   * @returns {Array<String>} Array of files
   * @memberof Boot
   */
  getFiles(folderPath) {
    if (!fs.existsSync(folderPath)) {
      return [];
    }

    return fs
      .readdirSync(folderPath)
      .filter((file) => {
        var isFile = fs
          .statSync(path.join(folderPath, file))
          .isFile();
        return isFile && file.endsWith('.js')
      });
  }

  /**
   * Load all decorators before start boot
   * @memberof Boot
   */
  discoverDecorators() {
    // Get all endpoints folders
    const fullPath = `${__dirname}/app/decorators`;
    const decorators = this.getFiles(fullPath);
    this.info(`* Discovering Decorators...(${decorators.length} founds)`);

    decorators
      .forEach((decorator) => {
        this.configureDecorator(path.join(fullPath, decorator));
      })
  }

  /**
   * Load all extension before start boot
   * @memberof Boot
   */
  discoverExtensions() {
    // Get all endpoints folders
    const fullPath = `${__dirname}/app/extensions`;
    const extensions = this.getFiles(fullPath);
    this.info(`* Discovering Extensions...(${extensions.length} founds)`);
    this.info('');
    extensions
      .forEach((extension) => {
        this.configureExtension(path.join(fullPath, extension), extension);
      });
  }


  /**
   * Load the specific Decorator
   * @memberof Boot
   */
  configureDecorator(fullPath) {
    const decorator = require(fullPath);
    decorator(this.app, this.app.getServer(), this.settings, this.settings.appRootDir);
  }

  /**
   * Load the specific Extension
   * 
   * @param {String} fullPath Extension Full Path
   * @param {any} extensionFile Extension File Name
   * @memberof Boot
   */
  configureExtension(fullPath, extensionFile) {
    try {
      // Get the extension class
      let ExtensionClass = require(fullPath);
      if (typeof ExtensionClass !== 'function' && typeof ExtensionClass.extension == 'function') {
        // Extended Object 
        ExtensionClass = ExtensionClass.extension;
      }

      // Create an instance Method
      const extension = new ExtensionClass(this.app, this.app.getServer(), this.settings, this.settings.appRootDir);

      // Extend by Name
      const extensionName = extensionFile.replace(/.js/, '');

      this.info(`  - Extension [${extensionName}] loaded`);
      this.app[extensionName] = (cfg) => {
        cfg = (cfg || {});
        return extension.execute(cfg);
      };

    } catch (ex) {
      this.debug(`Failed to load extension ${extensionFile}.`)
      throw ex;
    }
  };

}

/**
 * Return Booting Process
 */
module.exports = (app, settings, callback) => {

  settings = (settings || {});

  // Set some default configurations like NODE_ENV && NODE_PORT
  if (!settings.env && process.env.NODE_ENV) {
    settings.env = process.env.NODE_ENV;
  }

  if (!settings.port && process.env.NODE_PORT) {
    settings.port = process.env.NODE_PORT;
  }

  const boot = new Boot(settings);
  return boot.start(app, callback);
};
