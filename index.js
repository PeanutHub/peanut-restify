'use strict';
const boot = require('./restify/Boot');
const app = require('./restify/app/Application');

module.exports = {
  boot: boot,
  app: app
};
