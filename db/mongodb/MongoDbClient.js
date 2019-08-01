'use strict';
const ConnectorClientBase = require('./../ConnectorClientBase');
const mongoose = require('mongoose');

class MongoDbClient extends ConnectorClientBase {
  constructor(connectionString, app) {
    super();
    this.connectionString = connectionString;
    this.connections = [];

    // Call inmediately to connect mongoose
    this.init()
      .then(() => {
        this.connections.forEach(conn => {
          app.on("application:shutdown", async (cb) => { 
            await conn.close();
            cb();
          })
        })
      })
      .catch(console.error);
  }


  /**
   * Connect to the mongo DB
   * @param {String} connectionString Connection String
   * @returns {Promise<MongoClient>} Returns a MongoClient
   */
  _connect(connectionString) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.getConnections().length > 0) {
          require('mongodb')
            .MongoClient
            .connect(connectionString, { useNewUrlParser: true })
            .then(connection => {
              // Resolve with the connection
              this.registerConnection(connection);
    
              mongoose.connection.on('disconnected', () => this.emit('connection:disconnected'))
              mongoose.connection.on('reconnected', () => this.emit('connection:reconnected'))
              mongoose.connection.on('connected', () => this.emit('connection:connected'))
              
              return mongoose.connect(connectionString, { useNewUrlParser: true, useCreateIndex: true })
            })
            .then(mongooseConnection => {
              this.registerConnection(mongooseConnection.connection);
              resolve();
            })
            .catch(reject)
        } else {
          resolve();
        }
      } catch (ex) {
        reject(ex);
      }
    })
  }

  getConnections() {
    return this.connections
  }

  registerConnection(connection) {
    this.connections.push(connection)
  }

  /**
   * Useful for check the connection before any request 
   */
  init() {
    return this._connect(this.connectionString, this);
  }

  /**
   * Get the native (mongodb client) for weird stuff
   */
  native() {
    return this.init();
  }
}

module.exports = MongoDbClient;