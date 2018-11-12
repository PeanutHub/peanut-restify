'use strict';
const sinon = require('sinon');
const logger = require('peanut-restify/logger');

const sandbox = sinon.createSandbox();

describe('GenericError', () => {
  let mockGenericError;

  // Setting things up....
  beforeAll(() => {
    mockGenericError = require('./GenericError');
  });

  afterEach(() => {
    logger.unmute();
    sandbox.restore();
  });

  it('should pass sanity', () => {
    logger.mute();
    expect(mockGenericError).toBeDefined();
  });

  it('should create a new instance with DUMMY_CODE code', () => {
    logger.mute();
    const result = new mockGenericError('DUMMY_CODE', 'DUMMY_DESCRIPTION');

    expect(result).toBeDefined();
    expect(result.error_code).toContain('DUMMY_CODE');
  });

  it('should throw an error when create a new instance without code', () => {
    logger.mute();

    try {
      const result = new mockGenericError(null, 'DUMMY');
    } catch (ex) {
      expect(ex).toBeDefined();
      expect(ex.message).toContain('errorCode is required');
    }
  });

  it('should throw an error when create a new instance without description', () => {
    logger.mute();

    try {
      const result = new mockGenericError('DUMMY', null);
    } catch (ex) {
      expect(ex).toBeDefined();
      expect(ex.message).toContain('errorDescription is required');
    }
  });
});
