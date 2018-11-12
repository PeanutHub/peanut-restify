'use strict';
const sinon = require('sinon');
const logger = require('peanut-restify/logger');

const sandbox = sinon.createSandbox();

describe('InvalidModelError', () => {
  let mockInvalidModelError;

  // Setting things up....
  beforeAll(() => {
    mockInvalidModelError = require('./InvalidModelError');
  });

  afterEach(() => {
    logger.unmute();
    sandbox.restore();
  });

  it('should pass sanity', () => {
    logger.mute();
    expect(mockInvalidModelError).toBeDefined();
  });

  it('should create a new instance with validations code', () => {
    logger.mute();
    const result = new mockInvalidModelError({
      getValidationErrors: () => {
        return [];
      },
    });

    expect(result).toBeDefined();
    expect(result.error_code).toContain('INVALID_MODEL');
  });

  it('should throw an error when create a new instance without model', () => {
    logger.mute();

    try {
      const result = new mockInvalidModelError(null);
    } catch (ex) {
      expect(ex).toBeDefined();
      expect(ex.message).toContain('InvalidModel error need an invalid model');
    }
  });
});
