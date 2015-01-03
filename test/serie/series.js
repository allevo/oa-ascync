/* jshint mocha: true */
'use strict';

var assert = require('assert');

var async = require('../../index').serie;


describe('serie', function () {
  describe('series', function () {
    describe('object', function () {
      describe('normal', function () {
        var calls = [];
        function func1(next) {
          calls.push('func1 start');
          setTimeout(function() {
            calls.push('func1 end');
            next(null, 1);
          }, 300);
        }
        function func2(next) {
          calls.push('func2 start');
          setTimeout(function() {
            calls.push('func2 end');
            next(null, 2);
          }, 100);
        }

        before(function (done) {
          var test = this;

          async.series({func1: func1, func2: func2}, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error should be null', function() {
          assert.equal(null, this.err);
        });
        it('result should be an Object', function() {
          assert.equal(Object, this.res.constructor);
        });
        it('result should be correct', function() {
          assert.deepEqual({func1: 1, func2: 2}, this.res);
        });
        it('the sequence should be correct', function() {
          assert.deepEqual(['func1 start', 'func1 end', 'func2 start', 'func2 end'], calls);
        });
      });

      describe('empty', function () {
        before(function (done) {
          var test = this;

          async.series({}, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error should be null', function() {
          assert.equal(null, this.err);
        });
        it('result should be an Object', function() {
          assert.equal(Object, this.res.constructor);
        });
        it('result should be correct', function() {
          assert.deepEqual({}, this.res);
        });
      });


      describe('error', function () {
        var calls = [];
        function func1(next) {
          calls.push('func1 start');
          setTimeout(function() {
            calls.push('func1 end');
            next(null, 1);
          }, 300);
        }
        function funcError(next) {
          calls.push('funcError start');
          setTimeout(function() {
            calls.push('funcError end');
            next(new Error('Some problems!')
              , 2);
          }, 100);
        }
        function func2(next) {
          calls.push('func2 start');
          setTimeout(function() {
            calls.push('func2 end');
            next(null, 2);
          }, 100);
        }

        before(function (done) {
          var test = this;

          async.series({func1: func1, funcError: funcError, func2: func2}, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error should be an Error', function() {
          assert.equal(Error, this.err.constructor);
        });
        it('result should be an Object', function() {
          assert.equal(Object, this.res.constructor);
        });
        it('result should be correct', function() {
          assert.deepEqual({func1: 1}, this.res);
        });
      });
    });

    describe('array', function () {
      describe('normal', function () {
        var calls = [];
        function func1(next) {
          calls.push('func1 start');
          setTimeout(function() {
            calls.push('func1 end');
            next(null, 1);
          }, 300);
        }
        function func2(next) {
          calls.push('func2 start');
          setTimeout(function() {
            calls.push('func2 end');
            next(null, 2);
          }, 100);
        }

        before(function (done) {
          var test = this;

          async.series([func1, func2], function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error should be null', function() {
          assert.equal(null, this.err);
        });
        it('result should be an Array', function() {
          assert.equal(Array, this.res.constructor);
        });
        it('result should be correct', function() {
          assert.deepEqual([1, 2], this.res);
        });
        it('the sequence should be correct', function() {
          assert.deepEqual(['func1 start', 'func1 end', 'func2 start', 'func2 end'], calls);
        });
      });

      describe('empty', function () {
        before(function (done) {
          var test = this;

          async.series([], function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error should be null', function() {
          assert.equal(null, this.err);
        });
        it('result should be an Array', function() {
          assert.equal(Array, this.res.constructor);
        });
        it('result should be correct', function() {
          assert.deepEqual([], this.res);
        });
      });

      describe('error', function () {
        var calls = [];
        function func1(next) {
          calls.push('func1 start');
          setTimeout(function() {
            calls.push('func1 end');
            next(null, 1);
          }, 300);
        }
        function funcError(next) {
          calls.push('funcError start');
          setTimeout(function() {
            calls.push('funcError end');
            next(new Error('Some problems!')
              , 2);
          }, 100);
        }
        function func2(next) {
          calls.push('func2 start');
          setTimeout(function() {
            calls.push('func2 end');
            next(null, 2);
          }, 100);
        }

        before(function (done) {
          var test = this;

          async.series([func1, funcError, func2], function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error should be an Error', function() {
          assert.equal(Error, this.err.constructor);
        });
        it('result should be an Array', function() {
          assert.equal(Array, this.res.constructor);
        });
        it('result should be correct', function() {
          assert.deepEqual([1], this.res);
        });
      });
    });
  });
});