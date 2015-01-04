oa-ascync
=========


[![Build Status](https://travis-ci.org/allevo/oa-ascync.svg?branch=master)](https://travis-ci.org/allevo/oa-ascync)

This is an helper to avoid the Javascript Callback Hell.
This project is insprired on https://github.com/caolan/async.

The aim of oa-ascync is to create an unique interface of callbacks and iterators.

The choosed interface is this
```javascript
function(err, result) { /* */ }
```
This permits to connect better all function present in this library.

This library has is splitted in 4 submodules.
- parallel: continue on error (goon)
- parallel: stop on error (stoponerror)
- serie: do it in serie
- other: a collection of other functions


The first three submodules have 3 similar function:
- map
- parallel/series
- filter

## Common

The difference among the submodules is how the process is done and what happen when an error occurred. In particular:
- goon: the process is done in parallel and when an error occurred the process goes on. The final callback has an array/object of error or null as the first parameter and the result accumuled as the second.
- stoponerror: the process is done in parallel and when an error occurred the process is stopped. The final callback has the error or null as the first parameter and the result as the second.
- serie: the process is done in serie. All tasks is executed one after the other waiting the next function call. If an error occurred the process is stopped. The final callback is called with the error or null as first parameter and the result accumuled as the second.

### map
This function accept an array or object and a iterator function and a callback.
- iterator is a function long 2. The first parameter is the element/value of the array/object. The second is a next function long 2 that accepts an error or null and the mapped value.
- callback is a function long 2. The first parameter is an array/object with all errors or null. The second one is the results finished successfully.

This applies the iterator on all elements/values and call callback in the end. The results is an array/object with all mapped values.

```javascript
var elements = {a: 1, b: 2, c: 3};
function power(el, next) {
  next(null, el * el);
}
async.goon.map(elements, power, function(err, results) {
  assert.deepEqual({a: 1, b: 4, c: 9}, results);
});
```

### parallel/series
This function accepts an array/object of functions and a callback.
- array/object of functions long 1. This paramater is a next function that accepts an optional error and the result.
- the callback is a function long 2. The first parameter is an array/object of error or null. The second is an array/object with all results finished successfully.

This function calls each function and, in the end, the given callback invoked with the error/errors and the results of all functions.

```javascript
function giveMeANumber(next) {
  next(null, 1);
}
function giveMeAnotherNumber(next) {
  next(null, 2);
}
function giveMeAString(next) {
  next(null, "A string");
}
async.goon.parallel([giveMeANumber, giveMeAnotherNumber, giveMeAString], function(err, results) {
  assert.deepEqual([1, 2, "A string"], results);
});
```

### filter
This accept an array or object and a filter function and a callback.
- filter is a function long 2. The first parameter is the element/value of the array/object. The second is the callback should be called when the filter is done. The second parameter must be a boolean. All not-true values are considered false.
- callback is a function long 2. The first parameter is an array/object with all errors or null. The second one is the results finished successfully.

This function applies all elements/values to the filter.
```javascript
var elements = {a: 1, b: 2, c: 3};
function even(el, next) {
  next(null, el % 2 === 0);
}
async.goon.filter(elements, even, function(err, results) {
  assert.deepEqual({b: 2}, results);
});
```

## Other
This module has 2 functions

### waterfall
This function accepts an array of functions that are execute one after the other passing the result of previous function to the next. 

The first function of the array/object has only one argument: a next function that should be invoked with an error or the result.
The other functions have the previous result as first parameter and the next function as second parameter.

If an error occured, the concatenation is stopped and the final callback is called with the error.
```javascript
var tasks = [
  function(next) {
    next(null, 1)
  },
  function duplicate(n, next) {
    next(null, n * 2)
  },
  function triplicte(n, next) {
    next(null, n * 3)
  },
  function power(n, next) {
    next(null, n * n)
  },
];
async.other.waterfall(tasks, function(err, results) {
  assert.deepEqual(36, results);
});
```

### cascade
This function resolves the dependencies. An example explains better than words.

```javascript
var tasks = {
  func1: function(next) {
    setTimeout(function() { next(null, 1); }, 10);
  },
  func2: function(next) {
    setTimeout(function() { next(null, 2); }, 10);
  },
  funcSum: ['func1', 'func2', function(prev, next) {
    setTimeout(function() { next(null, prev.func1 + prev.func2); }, 10);
  }],
  funcMultiple: ['func1', 'func2', function(prev, next) {
    setTimeout(function() { next(null, prev.func1 * prev.func2); }, 10);
  }],
  funcRes: ['funcSum', 'funcMultiple', function(prev, next) {
    setTimeout(function() { next(null, {sum: prev.funcSum, molt: prev.funcMultiple}); }, 10);
  }],
};
async.other.cascade(tasks, function(err, results) {
  assert.deepEqual({func1: 1, func2: 2, funcSum: 3, funcMultiple: 2, funcRes: {sum: 3, molt: 2}}, results);
});
```

## Helper
There're some util functions used in this library and are also exposed.

### getObjectValues

```javascript
var values = async.helper.getObjectValues({a: 1, b: 2});
assert.equal([1, 2], values);
```

### hasOnlyEmptyValues

```javascript
assert.equal(true, async.helper.hasOnlyEmptyValues({a: false, b: null, c: undefined}));
assert.equal(false, async.helper.hasOnlyEmptyValues({a: false, b: null, c: true}));
assert.equal(false, async.helper.hasOnlyEmptyValues({a: false, b: null, c: {w: true}}));
assert.equal(false, async.helper.hasOnlyEmptyValues({a: [false], b: null, c: undefined}));
```

### getFirstNotNullElement

```javascript
assert.equal(1, async.helper.getFirstNotNullElement([1, false]));
assert.equal(1, async.helper.getFirstNotNullElement([null, 1, false]));
assert.equal(false, async.helper.getFirstNotNullElement([false, 3]));
```
