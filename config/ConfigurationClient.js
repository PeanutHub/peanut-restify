'use strict';

/**
 * Configuration Client for ensure consistency
 * @class ConfigurationClient
 * PD: Today is option works only for ENVIRONMENT Variables
 */
class ConfigurationClient {
  constructor() { };

  /**
   * Get Setting Value By Name
   * @param {String} settingName Setting to Get
   * @param {String} defaultValue Default value if not set
   * @memberof ConfigurationClient
   * @returns {String} return string value
   */
  get(settingName, defaultValue) {
    var setting = process.env[settingName];
    if (typeof setting === 'undefined' && typeof defaultValue === 'undefined') {
      throw new Error(`Environment Setting ${settingName} is undefined`);
    }
    return (setting || defaultValue);
  }

  /**
   * Get Setting Value By Name
   * @param {String} settingName Setting to Get
   * @param {Boolean} defaultValue Default value if not set
   * @memberof ConfigurationClient
   * @returns {Boolean} returns the boolean value
   */
  getBoolean(settingName, defaultValue) {
    var setting = this.get(settingName, defaultValue);
    if (typeof defaultValue === 'boolean') {
      return setting;
    }
    return setting === 'true' || setting === '1';
  }

  /**
   * Get Setting Value By Name
   * @param {String} settingName Setting to Get
   * @param {Number} defaultValue Default value if not set
   * @memberof ConfigurationClient
   * @returns {Number} return the number value
   */
  getNumber(settingName, defaultValue) {
    var setting = this.get(settingName, defaultValue);
    if (typeof defaultValue === 'number') {
      return setting;
    }
    return parseInt(setting);
  }

  /**
   * Check if a setting name exist in the configuration
   * @param {String} settingName Setting Name to check
   * @returns {Boolean} existence
   */
  exists(settingName) {
    return this.get(settingName, null) !== null;
  }
}

module.exports = ConfigurationClient;
