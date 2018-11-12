'use strict';
const sinon = require('sinon');
const logger = require('peanut-restify/logger');

const sandbox = sinon.createSandbox();

describe('DatabaseError', () => {
  let mockDatabaseError;

  // Setting things up....
  beforeAll(() => {
    mockDatabaseError = require('./DatabaseError');
  });

  afterEach(() => {
    logger.unmute();
    sandbox.restore();
  });

  it('should pass sanity', () => {
    logger.mute();
    expect(mockDatabaseError).toBeDefined();
  });

  it('should create a new instance', () => {
    logger.mute();
    const result = new mockDatabaseError('DUMMY_ERROR', new Error('DUMMY_ERROR'));

    expect(result).toBeDefined();
    expect(result.error_code).toContain('DATABASE_ERROR');
  });

  it('should throw an error when create a new instance without exception', () => {
    logger.mute();

    try {
      const result = new mockDatabaseError('DUMMY', null);
    } catch (ex) {
      expect(ex).toBeDefined();
      expect(ex.message).toContain('the parameter error in DatabaseError cant be null');
    }
  });

  it('should throw an error when create a new instance with an no Error instance', () => {
    logger.mute();

    try {
      const result = new mockDatabaseError('DUMMY', {
        mesage: 'ex',
      });
    } catch (ex) {
      expect(ex).toBeDefined();
      expect(ex.message).toContain('Database Error need an error associated to the db error');
    }
  });
});
