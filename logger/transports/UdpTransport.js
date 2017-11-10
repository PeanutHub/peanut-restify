/**
 * (C) 2013 Sazze, Inc.
 * MIT LICENSE
 *
 * Based on a gist by mbrevoort.
 * Available at: https://gist.github.com/mbrevoort/5848179
 *
 * Inspired by winston-logstash
 * Available at: https://github.com/jaakkos/winston-logstash
 */

// Really simple Winston Logstash UDP Logger
const dgram = require('dgram');
const util = require('util');
const os = require('os');
const winston = require('winston');
const common = require('winston/lib/winston/common');
const cycle = require('cycle');

class PeanutUDPTransport {
  constructor(settings) {
    winston.Transport.call(this, settings);

    this.name = 'peanut_udp_transport';
    this.udpType = 'udp4';
    this.trailingLineFeed = true;
    this.trailingLineFeedChar = os.EOL;
    this.host = settings.host;
    this.port = settings.port;

    // Set some data
    this.app_environment = settings.env;
    this.server_name = os.hostname();

    if (settings.packageJSON) {
      const packageJSON = require(settings.packageJSON);

      if (!packageJSON.name) {
        throw new Error('The name variable is not found in package.json and it\`s required');
      }

      if (!packageJSON.version) {
        throw new Error('The version variable is not found in package.json and it\`s required');
      }

      this.app_name = packageJSON.name;
      this.app_version = packageJSON.version;
    }

    if (!this.app_name) {
      throw new Error('The app_name is not setted for udp logger');
    }

    if (!this.app_version) {
      throw new Error('The app_version is not setted for udp logger');
    }


    this.connect();
  }

  connect() {
    this.client = dgram.createSocket(this.udpType);

    // Attach an error listener on the socket
    // It can also avoid top level exceptions like UDP DNS errors thrown by the socket
    this.client.on('error', function (err) {
      // in node versions <= 0.12, the error event is emitted even when a callback is passed to send()
      // we always pass a callback to send(), so it's safe to do nothing here
    });

    if (this.client.unref) {
      this.client.unref();
    }
  }

  log(level, msg, meta, callback) {
    var meta = winston.clone(cycle.decycle(meta) || {});
    var logEntry;

    callback = (callback || function () { });

    if (this.silent) {
      return callback(null, true);
    }

    logEntry = common.log({
      level: level,
      message: msg,
      meta: {
        app_name: this.app_name,
        app_version: this.app_version,
        app_environment: this.app_environment,
        server_name: this.server_name,
      },
      timestamp: this.timestamp,
      json: true
    });

    this.sendLog(logEntry, (err) => {
      this.emit('udp logged', !err);

      callback(err, !err);
    });
  }

  sendLog(message, callback) {
    var self = this;

    if (this.trailingLineFeed === true) {
      message = message.replace(/\s+$/, '') + this.trailingLineFeedChar;
    }

    // Add end line feed to flush to udp socket
    var buf = new Buffer(message);

    callback = (callback || function () { });

    self.client.send(buf, 0, buf.length, self.port, self.host, callback);
  }
};

util.inherits(PeanutUDPTransport, winston.Transport);

//
// Define a getter so that `winston.transports.PeanutUDPTransport`
// is available and thus backwards compatible.
//
winston.transports.PeanutUDPTransport = PeanutUDPTransport;

module.exports = PeanutUDPTransport;