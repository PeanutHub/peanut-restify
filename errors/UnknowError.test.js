'use strict';
const sinon = require('sinon');
const logger = require('peanut-restify/logger');

const sandbox = sinon.createSandbox();

describe('UnknowError', () => {
  let mockUnknowError;

  // Setting things up....
  beforeAll(() => {
    mockUnknowError = require('./UnknowError');
  });

  afterEach(() => {
    logger.unmute();
    sandbox.restore();
  });

  it('should pass sanity', () => {
    logger.mute();
    expect(mockUnknowError).toBeDefined();
  });

  it('should create a new instance', () => {
    logger.mute();
    const result = new mockUnknowError('DUMMY_ERROR', new Error('DUMMY_ERROR'));

    expect(result).toBeDefined();
    expect(result.error_code).toContain('GENERAL_SYSTEM_ERROR');
  });

  it('should throw an error when create a new instance without exception', () => {
    logger.mute();

    try {
      const result = new mockUnknowError('DUMMY', null);
    } catch (ex) {
      expect(ex).toBeDefined();
      expect(ex.message).toContain('the parameter error in UnknowError cant be null');
    }
  });

  it('should throw an error when create a new instance with an no Error instance', () => {
    logger.mute();

    try {
      const result = new mockUnknowError('DUMMY', {
        mesage: 'ex',
      });
    } catch (ex) {
      expect(ex).toBeDefined();
      expect(ex.message).toContain('Unknow Error need an error associated to the db error');
    }
  });
});
