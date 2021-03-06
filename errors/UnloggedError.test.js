'use strict';
const sinon = require('sinon');
const logger = require('peanut-restify/logger');

const sandbox = sinon.createSandbox();

describe('UnloggedError', () => {
  let mockCheckoutCheckoutUnloggedError;

  // Setting things up....s
  beforeAll(() => {
    mockCheckoutCheckoutUnloggedError = require('./UnloggedError');
  });

  afterEach(() => {
    logger.unmute();
    sandbox.restore();
  });

  it('should pass sanity', () => {
    logger.mute();
    expect(mockCheckoutCheckoutUnloggedError).toBeDefined();
  });

  it('should create a new instance with DUMMY_CODE code', () => {
    logger.mute();
    const result = new mockCheckoutCheckoutUnloggedError('DUMMY_CODE', 'DUMMY_DESCRIPTION');

    expect(result).toBeDefined();
    expect(result.error_code).toContain('DUMMY_CODE');
  });

  it('should throw an error when create a new instance without code', () => {
    logger.mute();

    try {
      const result = new mockCheckoutCheckoutUnloggedError(null, 'DUMMY');
    } catch (ex) {
      expect(ex).toBeDefined();
      expect(ex.message).toContain('errorCode is required');
    }
  });

  it('should throw an error when create a new instance without description', () => {
    logger.mute();

    try {
      const result = new mockCheckoutCheckoutUnloggedError('DUMMY', null);
    } catch (ex) {
      expect(ex).toBeDefined();
      expect(ex.message).toContain('errorDescription is required');
    }
  });
});
