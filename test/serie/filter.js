/* jshint mocha: true */
'use strict';

var assert = require('assert');

var async = require('../../index').serie;


describe('serie', function () {
  describe('filter', function () {
    describe('object', function () {
      describe('normal', function () {
        var elements = {a: 1, b: 2, c:3};
        function even(item, next) {
          next(null, item % 2 === 0);
        }

        before(function (done) {
          var test = this;
          async.filter(elements, even, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error shoud be null', function() {
          assert.equal(null, this.err);
        });
        it('result shoud be an Object', function() {
          assert.equal(Object, this.res.constructor);
        });
        it('result shoud be correct', function() {
          assert.deepEqual({b: 2}, this.res);
        });
      });

      describe('empty', function () {
        function even(item, next) {
          next(null, item % 2 === 0);
        }

        before(function (done) {
          var test = this;
          async.filter({}, even, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error shoud be null', function() {
          assert.equal(null, this.err);
        });
        it('result shoud be an Object', function() {
          assert.equal(Object, this.res.constructor);
        });
        it('result shoud be correct', function() {
          assert.deepEqual({}, this.res);
        });
      });

      describe('error', function () {
        var elements = {a: 1, b: 2, c:3, d: 4};
        function even(item, next) {
          if (item === 3) {
            next(new Error('Some problems!'));
          } else {
            next(null, item % 2 === 0);
          }
        }

        before(function (done) {
          var test = this;
          async.filter(elements, even, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error shoud be an Error', function() {
          assert.equal(Error, this.err.constructor);
        });
        it('result shoud be an Object', function() {
          assert.equal(Object, this.res.constructor);
        });
        it('result shoud be correct', function() {
          assert.deepEqual({b: 2}, this.res);
        });
      });
    });

    describe('array', function () {
      describe('normal', function () {
        var elements = [1, 2, 3];
        function even(item, next) {
          next(null, item % 2 === 0);
        }

        before(function (done) {
          var test = this;
          async.filter(elements, even, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error shoud be null', function() {
          assert.equal(null, this.err);
        });
        it('result shoud be an Array', function() {
          assert.equal(Array, this.res.constructor);
        });
        it('result shoud be correct', function() {
          assert.deepEqual([2], this.res);
        });
      });

      describe('empty', function () {
        function even(item, next) {
          next(null, item % 2 === 0);
        }

        before(function (done) {
          var test = this;
          async.filter([], even, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error shoud be null', function() {
          assert.equal(null, this.err);
        });
        it('result shoud be an Array', function() {
          assert.equal(Array, this.res.constructor);
        });
        it('result shoud be correct', function() {
          assert.deepEqual([], this.res);
        });
      });

      describe('error', function () {
        var elements = [1, 2, 3, 4];
        function even(item, next) {
          if (item === 3) {
            next(new Error('Some problems!'));
          } else {
            next(null, item % 2 === 0);
          }
        }

        before(function (done) {
          var test = this;
          async.filter(elements, even, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error shoud be an Error', function() {
          assert.equal(Error, this.err.constructor);
        });
        it('result shoud be an Array', function() {
          assert.equal(Array, this.res.constructor);
        });
        it('result shoud be correct', function() {
          assert.deepEqual([2], this.res);
        });
      });
    });
  });
});