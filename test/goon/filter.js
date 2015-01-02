/* jshint mocha: true */
'use strict';

var assert = require('assert');

var async = require('../../index').goon;

describe('goon', function () {
  describe('filter', function() {
    describe('object', function() {
      describe('normal', function () {
        var elements = {a: 1, b: 2, c:3, d: 4};
        function even(item, next) {
          next(null, item % 2 === 0);
        }

        before(function(done) {
          var test = this;

          async.filter(elements, even, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('err should be null', function() {
          assert.equal(null, this.err);
        });
        it('results should be an Object', function() {
          assert.equal(Object, this.res.constructor);
        });
        it('results should be correct', function() {
          assert.deepEqual({b: 2, d: 4}, this.res);
        });
      });

      describe('empty', function () {
        before(function(done) {
          var test = this;

          async.filter({}, function() { throw new Error('Never called!'); }, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('err should be null', function() {
          assert.equal(null, this.err);
        });
        it('results should be an Object', function() {
          assert.equal(Object, this.res.constructor);
        });
        it('results should be correct', function() {
          assert.deepEqual({}, this.res);
        });
      });

      describe('error', function () {
        before(function(done) {
          var test = this;

          var elements = {a: 0, b: 1, c: 2, d: 3, e: 4};
          function buggedEven(item, next) {
            if (item === 0) {
              next(new Error('Some problems!'));
            } else {
              next(null, item % 2 === 0);
            }
          }

          async.filter(elements, buggedEven, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('err should be an Object', function() {
          assert.equal(Object, this.err.constructor);
        });
        it('err should have "a" value an error', function() {
          assert.equal(Error, this.err.a.constructor);
        });
        it('err should have "b" value a null', function() {
          assert.equal(null, this.err.b);
        });
        it('err should have "c" value a null', function() {
          assert.equal(null, this.err.c);
        });
        it('err should have "d" value a null', function() {
          assert.equal(null, this.err.d);
        });
        it('err should have "e" value a null', function() {
          assert.equal(null, this.err.e);
        });
        it('results should be an Object', function() {
          assert.equal(Object, this.res.constructor);
        });
        it('results should be correct', function() {
          assert.deepEqual({c: 2, e: 4}, this.res);
        });
      });
    });

    describe('array', function() {
      describe('normal', function () {
        var elements = [1, 2, 3, 4];
        function even(item, next) {
          next(null, item % 2 === 0);
        }

        before(function(done) {
          var test = this;

          async.filter(elements, even, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('err should be null', function() {
          assert.equal(null, this.err);
        });
        it('results should be an Array', function() {
          assert.equal(Array, this.res.constructor);
        });
        it('results should be correct', function() {
          assert.deepEqual([2, 4], this.res);
        });
      });

      describe('empty', function () {
        before(function(done) {
          var test = this;

          async.filter([], function() { throw new Error('Never called!'); }, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('err should be null', function() {
          assert.equal(null, this.err);
        });
        it('results should be an Array', function() {
          assert.equal(Array, this.res.constructor);
        });
        it('results should be correct', function() {
          assert.deepEqual([], this.res);
        });
      });

      describe('error', function () {
        before(function(done) {
          var test = this;

          var elements = [0, 1, 2, 3, 4];
          function buggedEven(item, next) {
            if (item === 0) {
              next(new Error('Some problems!'));
            } else {
              next(null, item % 2 === 0);
            }
          }

          async.filter(elements, buggedEven, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('err should be an Array', function() {
          assert.equal(Array, this.err.constructor);
        });
        it('err should have 0th value an error', function() {
          assert.equal(Error, this.err[0].constructor);
        });
        it('err should have 1th value a null', function() {
          assert.equal(null, this.err[1]);
        });
        it('err should have 2th value a null', function() {
          assert.equal(null, this.err[2]);
        });
        it('err should have 3th value a null', function() {
          assert.equal(null, this.err[3]);
        });
        it('err should have 4th value a null', function() {
          assert.equal(null, this.err[4]);
        });
        it('results should be an Array', function() {
          assert.equal(Array, this.res.constructor);
        });
        it('results should be correct', function() {
          assert.deepEqual([2, 4], this.res);
        });
      });
    });
  });
});
