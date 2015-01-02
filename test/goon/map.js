/* jshint mocha: true */
'use strict';

var assert = require('assert');

var async = require('../../index').goon;

describe('goon', function() {
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

        it('error should be an Object', function() {
          assert.equal(Object, this.err.constructor);
        });
        it('error should have "b" key', function() {
          assert.deepEqual(['a', 'b', 'c'], Object.keys(this.err));
        });
        it('error should have "b" value as Error', function() {
          assert.deepEqual(Error, this.err.b.constructor);
        });
        it('result should be undefined', function() {
          assert.deepEqual({a: 1, b: undefined, c: 9}, this.res);
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

        it('error should be an Object', function() {
          assert.equal(Array, this.err.constructor);
        });
        it('error should have "a" key', function() {
          assert.deepEqual(3, this.err.length);
        });
        it('error should have 0th value as null', function() {
          assert.deepEqual(null, this.err[0]);
        });
        it('error should have 1th value as Error', function() {
          assert.deepEqual(Error, this.err[1].constructor);
        });
        it('error should have 2th value as null', function() {
          assert.deepEqual(null, this.err[2]);
        });
        it('result should be correct', function() {
          assert.deepEqual([1, undefined, 9], this.res);
        });
      });
    });
  });
});
