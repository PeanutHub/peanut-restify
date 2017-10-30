'use strict';

class ExtensionBase {

  /**
   * Creates an instance of ExtensionBase.
   * @param {any} app Application instance
   * @param {Object} settings Configured Setting in the boot step
   * @memberof ExtensionBase
   */
  constructor(app, settings) {
    this.app = app;
    this.settings = settings;
  }

  /**
   * Abstract Method: Extends the server component
   * @param {any} config Configuration 
   * @param {any} model Model instance
   * @memberof ExtensionBase
   */
  execute(config, model) {
    throw new Error("execute method not implemented!");
  }

}

module.exports = ExtensionBase;
