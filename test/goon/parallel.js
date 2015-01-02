/* jshint mocha: true */
'use strict';

var assert = require('assert');

var async = require('../../index').goon;



describe('goon', function () {
  describe('parallel', function() {
    var func1Called = false;
    var func2Called = false;

    function func1(next) {
      func1Called = true;
      setTimeout(function() {
        next(null, 1);
      }, 1);
    }
    function func2(next) {
      func2Called = true;
      setTimeout(function() {
        next(null, 2);
      }, 100);
    }
    function cleanFuncCalleds() {
      func1Called = false;
      func2Called = false;
    }

    describe('object', function() {
      describe('normal', function () {
        before(cleanFuncCalleds);
        before(function(done) {
          var test = this;
          async.parallel({func1: func1, func2: func2}, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('err should be null', function () {
          assert.equal(null, this.err);
        });
        it('result should be an Object', function () {
          assert.equal(Object, this.res.constructor);
        });
        it('result should be correct', function () {
          assert.deepEqual({func1: 1, func2: 2}, this.res);
        });
        it('func1 should be called', function() {
          assert.equal(true, func1Called);
        });
        it('func2 should be called', function() {
          assert.equal(true, func2Called);
        });
      });

      describe('empty', function () {
        before(cleanFuncCalleds);
        before(function(done) {
          var test = this;

          async.parallel({}, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('err should be null', function () {
          assert.equal(null, this.err);
        });
        it('result should be an Object', function () {
          assert.equal(Object, this.res.constructor);
        });
        it('result should be correct', function () {
          assert.deepEqual({}, this.res);
        });
      });

      describe('error', function() {
        before(cleanFuncCalleds);

        before(function(done) {
          var test = this;
          async.parallel({
            func1: func1,
            funcErr: function(next) {
              next(new Error('Some problems!'));
            },
            func2: func2,
          }, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('err should be an Object', function () {
          assert.equal(Object, this.err.constructor);
        });
        it('err should have "func1" value as null', function () {
          assert.equal(null, this.err.func1);
        });
        it('err should have "funcErr" value as Erorr', function () {
          assert.equal(Error, this.err.funcErr.constructor);
        });
        it('err should have func2 value as null', function () {
          assert.equal(null, this.err.func2);
        });
        it('result should be an Object', function () {
          assert.equal(Object, this.res.constructor);
        });
        it('result should be correct', function () {
          assert.deepEqual({func1: 1, funcErr: undefined, func2: 2}, this.res);
        });
        it('func1 should be called', function() {
          assert.equal(true, func1Called);
        });
        it('func2 should be called', function() {
          assert.equal(true, func2Called);
        });
      });
    });

    describe('array', function() {
      describe('normal', function () {
        before(cleanFuncCalleds);
        before(function(done) {
          var test = this;
          async.parallel([func1, func2], function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('err should be null', function () {
          assert.equal(null, this.err);
        });
        it('result should be an Array', function () {
          assert.equal(Array, this.res.constructor);
        });
        it('result should be correct', function () {
          assert.deepEqual([1, 2], this.res);
        });
        it('func1 should be called', function() {
          assert.equal(true, func1Called);
        });
        it('func2 should be called', function() {
          assert.equal(true, func2Called);
        });
      });

      describe('empty', function () {
        before(cleanFuncCalleds);
        before(function(done) {
          var test = this;

          async.parallel([], function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('err should be null', function () {
          assert.equal(null, this.err);
        });
        it('result should be an Array', function () {
          assert.equal(Array, this.res.constructor);
        });
        it('result should be correct', function () {
          assert.deepEqual([], this.res);
        });
      });

      describe('error', function() {
        before(cleanFuncCalleds);

        before(function(done) {
          var test = this;
          async.parallel([func1, function(next) {
            next(new Error('Some problems!'));
          }, func2], function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('err should be an Array', function () {
          assert.equal(Array, this.err.constructor);
        });
        it('err should have 0th value as null', function () {
          assert.equal(null, this.err[0]);
        });
        it('err should have 1th value as Erorr', function () {
          assert.equal(Error, this.err[1].constructor);
        });
        it('err should have 2th value as null', function () {
          assert.equal(null, this.err[2]);
        });
        it('result should be an Array', function () {
          assert.equal(Array, this.res.constructor);
        });
        it('result should be correct', function () {
          assert.deepEqual([1, undefined, 2], this.res);
        });
        it('func1 should be called', function() {
          assert.equal(true, func1Called);
        });
        it('func2 should be called', function() {
          assert.equal(true, func2Called);
        });
      });
    });
  });
});
