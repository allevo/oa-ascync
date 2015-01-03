/* jshint mocha: true */
'use strict';

var assert = require('assert');

var async = require('../../index').serie;


describe('serie', function () {
  describe('map', function () {
    describe('object', function () {
      describe('normal', function () {
        var elements = {a: 1, b: 2, c:3};
        function power(item, next) {
          next(null, item * item);
        }

        before(function (done) {
          var test = this;

          async.map(elements, power, function(err, res) {
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
          assert.deepEqual({a: 1, b:4, c: 9}, this.res);
        });
      });

      describe('empty', function () {
        function power() {
          throw new Error('never called!');
        }

        before(function (done) {
          var test = this;

          async.map({}, power, function(err, res) {
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
        var elements = {a: 1, b: 2, c:3};
        function power(item, next) {
          if (item === 2) {
            next(new Error('Some problems!'));
          } else {
            next(null, item * item);
          }
        }

        before(function (done) {
          var test = this;

          async.map(elements, power, function(err, res) {
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
          assert.deepEqual({a: 1}, this.res);
        });
      });
    });

    describe('array', function () {
      describe('normal', function () {
        var elements = [1, 2, 3];
        function power(item, next) {
          next(null, item * item);
        }

        before(function (done) {
          var test = this;

          async.map(elements, power, function(err, res) {
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
          assert.deepEqual([1, 4, 9], this.res);
        });
      });

      describe('empty', function () {
        function power() {
          throw new Error('never called!');
        }

        before(function (done) {
          var test = this;

          async.map([], power, function(err, res) {
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
        var elements = [1, 2, 3];
        function power(item, next) {
          if (item === 2) {
            next(new Error('Some problems!'));
          } else {
            next(null, item * item);
          }
        }

        before(function (done) {
          var test = this;

          async.map(elements, power, function(err, res) {
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
          assert.deepEqual([1], this.res);
        });
      });
    });
  });
});