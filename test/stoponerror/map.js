/* jshint mocha: true */
'use strict';

var assert = require('assert');

var async = require('../../index').stoponerror;


describe('stoponerror', function() {
  describe('map', function() {
    describe('object', function() {
      describe('normal', function() {
        before(function(done) {
          var test = this;

          var obj = {a: 1, b: 2, c: 3};
          async.map(obj, function(item, next) {
            next(null, item * item);
          }, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error should be null', function() {
          assert.equal(null, this.err);
        });
        it('result should be an object', function() {
          assert.equal(Object, this.res.constructor);
        });
        it('result should be the powers', function() {
          assert.deepEqual({a: 1, b: 4, c: 9}, this.res);
        });
      });

      describe('empty', function() {
        before(function(done) {
          var test = this;

          var obj = {};
          async.map(obj, function(item, next) {
            next(null, item * item);
          }, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error should be null', function() {
          assert.equal(null, this.err);
        });
        it('result should be an object', function() {
          assert.equal(Object, this.res.constructor);
        });
        it('result should be empty', function() {
          assert.deepEqual({}, this.res);
        });
      });

      describe('error', function() {
        before(function(done) {
          var test = this;

          var obj = {a: 1, b: 2, c: 3};
          async.map(obj, function(item, next) {
            if (item === 2) {
              next(new Error('Some problems!'));
            } else {
              next(null, item * item);
            }
          }, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error should be an Error', function() {
          assert.equal(Error, this.err.constructor);
        });
        it('result should be undefined', function() {
          assert.deepEqual(undefined, this.res);
        });
      });
    });

    describe('array', function() {
      describe('normal', function() {
        before(function(done) {
          var test = this;

          var obj = [1, 2, 3];
          async.map(obj, function(item, next) {
            next(null, item * item);
          }, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error should be null', function() {
          assert.equal(null, this.err);
        });
        it('result should be an object', function() {
          assert.equal(Array, this.res.constructor);
        });
        it('result should be the powers', function() {
          assert.deepEqual([1, 4, 9], this.res);
        });
      });

      describe('empty', function() {
        before(function(done) {
          var test = this;

          var obj = [];
          async.map(obj, function(item, next) {
            next(null, item * item);
          }, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error should be null', function() {
          assert.equal(null, this.err);
        });
        it('result should be an object', function() {
          assert.equal(Array, this.res.constructor);
        });
        it('result should be empty', function() {
          assert.deepEqual([], this.res);
        });
      });

      describe('error', function() {
        before(function(done) {
          var test = this;

          var obj = [1, 2, 3];
          async.map(obj, function(item, next) {
            if (item === 2) {
              next(new Error('Some problems!'));
            } else {
              next(null, item * item);
            }
          }, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error should be an Error', function() {
          assert.equal(Error, this.err.constructor);
        });
        it('result should be correct', function() {
          assert.deepEqual(undefined, this.res);
        });
      });
    });
  });
});
