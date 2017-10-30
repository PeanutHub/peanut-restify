const ExtensionBase = require('./../ExtensionBase');

/**
 * Add extension to retrieve the boot information
 * 
 * @class GetSettingsExtension
 * @extends {ExtensionBase}
 */
class GetSettingsExtension extends ExtensionBase {

  /**
   * Get Boot Setting's
   * @param {any} config Configuration Settings
   * @returns Settings
   * @memberof GetSettingsExtension
   */
  execute(config) {
    return this.settings;
  };

}

module.exports = GetSettingsExtension;
