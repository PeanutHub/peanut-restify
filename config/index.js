'use strict';
const ConfigurationClient = require('./ConfigurationClient');

// Singleton instances
const client = new ConfigurationClient();

module.exports = client;
