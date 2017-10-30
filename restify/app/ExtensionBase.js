'use strict';
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const restifyRouter = require('restify-router');
const logger = require('./../../logger');

class ExtensionBase {

  /**
   * Creates an instance of ExtensionBase.
   * @param {any} app Application instance
   * @param {any} server Server instance
   * @param {Object} settings Configured Setting in the boot step
   * @param {String} serverPath server.js path (for context)
   * @memberof ExtensionBase
   */
  constructor(app, server, settings, serverPath) {
    this.app = app;
    this.server = server;
    this.settings = settings;
    this.serverPath = serverPath;

    // Add some logging function's
    ['debug', 'error', 'info'].forEach((level) => {
      this[level] = (message, metadata) => {
        if (this.settings.debug) {
          logger[level](message, metadata);
        }
      }
    });

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
   * Register extension use for later use
   * (Can be use to check if extension is called maybe :P)
   * @param {String} name Extension name
   * @param {Object} values View bag of values
   * @memberof AddSwaggerDocsExtension
   */
  registerUse(name, values) {
    this.app.extensions[name] = values;
  }

  /**
   * Abstract Method: Extends the server component
   * @param {any} config Extension Configuration
   * @memberof ExtensionBase
   */
  execute(config) {
    throw new Error("execute method not implemented!");
  }

}

module.exports = ExtensionBase;
