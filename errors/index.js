'use strict';

const GenericError = require('./GenericError');
const InvalidModelError = require('./InvalidModelError');
const DatabaseError = require('./DatabaseError');
const UnknowError = require('./UnknowError');
const UnloggedError = require('./UnloggedError');
const DocumentNotFoundError = require('./DocumentNotFoundError');
const BadRequestError = require('./BadRequestError');
const UnauthorizedError = require('./UnauthorizedError');

module.exports = {
  GenericError: GenericError,
  InvalidModelError: InvalidModelError,
  DatabaseError: DatabaseError,
  UnknowError: UnknowError,
  UnloggedError: UnloggedError,
  DocumentNotFoundError: DocumentNotFoundError,
  BadRequestError: BadRequestError,
  UnauthorizedError: UnauthorizedError
};