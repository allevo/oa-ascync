/* jshint mocha: true */
'use strict';

var assert = require('assert');

var async = require('../../index').serie;


function duplicate(num, next) {
  setTimeout(function() { next(null, num * 2); }, 10);
}

describe('serie', function () {
  describe('waterfall', function () {
    describe('array', function () {
      describe('normal', function () {
        before(function (done) {
          var test = this;

          async.waterfall([
            function(next) { next(null, 1); },
            duplicate,
            duplicate,
            duplicate,
          ], function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error shoud be null', function() {
          assert.equal(null, this.err);
        });
        it('result shoud be a Number', function() {
          assert.equal(Number, this.res.constructor);
        });
        it('result shoud be correct', function() {
          assert.deepEqual(8, this.res);
        });
      });

      describe('empty', function () {
        before(function (done) {
          var test = this;

          async.waterfall([], function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error shoud be null', function() {
          assert.equal(null, this.err);
        });
        it('result shoud be undefined', function() {
          assert.deepEqual(undefined, this.res);
        });
      });

      describe('error', function () {
        before(function (done) {
          var test = this;

          async.waterfall([
            function(next) { next(null, 1); },
            duplicate,
            function(param, next) { next(new Error('Some problems!')); },
            duplicate,
          ], function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error shoud be null', function() {
          assert.equal(Error, this.err.constructor);
        });
        it('result shoud be undefined', function() {
          assert.deepEqual(2, this.res);
        });
      });
    });
  });
});