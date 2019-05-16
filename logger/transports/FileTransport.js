const winston = require('winston');

const	getTransport = (options = {filename: 'app-logs.log'}) => new winston.transports.File({...options});

module.exports = { getTransport };