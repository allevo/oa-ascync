/* jshint mocha: true */
'use strict';


var assert = require('assert');

var helper = require('../../helper');
var async = require('../../index').other;


describe('other', function () {
  describe('solveDependenciesTree', function () {
    describe('object', function () {
      describe('normal', function () {
        before(function (done) {
          var test = this;
          var deps = {
            func1: {
              dependencies: [],
              task: function(prev, next) {
                setTimeout(function() { next(null, 1); }, 10);
              },
            },
            func2: {
              dependencies: [],
              task: function(prev, next) {
                setTimeout(function() { next(null, 2); }, 10);
              },
            },
            funcSum: {
              dependencies: ['func1', 'func2'],
              task: function(prev, next) {
                setTimeout(function() { next(null, prev.func1 + prev.func2); }, 10);
              },
            },
            funcMultiple: {
              dependencies: ['func1', 'func2'],
              task: function(prev, next) {
                setTimeout(function() { next(null, prev.func1 * prev.func2); }, 10);
              },
            },
            funcRes: {
              dependencies: ['funcSum', 'funcMultiple'],
              task: function(prev, next) {
                setTimeout(function() { next(null, {sum: prev.funcSum, molt: prev.funcMultiple}); }, 10);
              },
            },
          };

          async.solveDependenciesTree(deps, function(err, res) {
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
          assert.deepEqual({func1: 1, func2: 2, funcSum: 3, funcMultiple: 2, funcRes: {sum: 3, molt: 2}}, this.res);
        });
      });

      describe('empty', function () {
        before(function (done) {
          var test = this;
          var tasks = {};

          async.solveDependenciesTree(tasks, function(err, res) {
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
        before(function (done) {
          var test = this;
          var tasks = {
            func1: {
              dependencies: [],
              task: function(prev, next) {
                setTimeout(function() { next(null, 1); }, 10);
              },
            },
            func2: {
              dependencies: [],
              task: function(prev, next) {
                setTimeout(function() { next(null, 2); }, 10);
              },
            },
            funcSum: {
              dependencies: ['func1', 'func2'],
              task: function(prev, next) {
                setTimeout(function() { next(null, prev.func1 + prev.func2); }, 10);
              },
            },
            funcMultiple: {
              dependencies: ['func1', 'func2'],
              task: function(prev, next) {
                setTimeout(function() { next(new Error('Some problems!')); }, 10);
              },
            },
            funcRes: {
              dependencies: ['funcSum', 'funcMultiple'],
              task: function() {
                throw new Error('never called');
              },
            },
          };

          async.solveDependenciesTree(tasks, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error should be null', function() {
          var error = helper.getFirstNotNullElement(this.err);
          assert.equal(Error, error.constructor);
        });
        it('result should be an Object', function() {
          assert.equal(Object, this.res.constructor);
        });
        it('result should be correct', function() {
          assert.deepEqual({
            func1: 1,
            func2: 2,
            funcMultiple: undefined,
            funcSum: 3,
          }, this.res);
        });
      });

      describe('unresolvable', function () {
        before(function (done) {
          var test = this;
          var tasks = {
            func1: {
              dependencies: [],
              task: function(prev, next) {
                setTimeout(function() { next(null, 1); }, 10);
              },
            },
            func2: {
              dependencies: [],
              task: function(prev, next) {
                setTimeout(function() { next(null, 2); }, 10);
              },
            },
            funcSum: {
              dependencies: ['func1', 'func2'],
              task: function(prev, next) {
                setTimeout(function() { next(null, prev.func1 + prev.func2); }, 10);
              },
            },
            funcMultiple: {
              dependencies: ['func1', 'wowowowowowowowowowowow'],
              task: function(prev, next) {
                setTimeout(function() { next(new Error('Some problems!')); }, 10);
              },
            },
            funcRes: {
              dependencies: ['funcSum', 'funcMultiple'],
              task: function() {
                throw new Error('never called');
              },
            },
          };

          async.solveDependenciesTree(tasks, function(err, res) {
            test.err = err;
            test.res = res;

            done();
          });
        });

        it('error should be null', function() {
          var error = helper.getFirstNotNullElement(this.err);
          assert.equal(Error, error.constructor);
          assert.equal('Cannot resolve dependencies tree', error.message);
        });
        it('result should be an Object', function() {
          assert.equal(Object, this.res.constructor);
        });
        it('result should be correct', function() {
          assert.deepEqual({
            func1: 1,
            func2: 2,
            funcSum: 3,
          }, this.res);
        });
      });
    });
  });
});