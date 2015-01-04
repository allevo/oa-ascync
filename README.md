oa-ascync
=========


[![Build Status](https://travis-ci.org/allevo/oa-ascync.svg?branch=master)](https://travis-ci.org/allevo/oa-ascync)

This is an helper to avoid the Javascript Callback Hell.
This project is inprired on https://github.com/caolan/async.

The aim of oa-async is to create an unuque interface of callbacks and iterators.

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

# Parallel: continue on error
This module has 3 functions

## map
This accept an array or object and a iterator function and a callback.
- iterator is a function long 2. The first parameter is the element/value of the array/object. The second is the callback should be called when the map is done.
- callback is a function long 2. The first parameter is an array/object with all errors or null. The second one is the results finished successfully.

This applies the iterator on all elements/values and call callback in the end. If some error occurred, the process go on until all mappings are been done.

```javascript
var elements = {a: 1, b: 2, c: 3};
function power(el, next) {
  next(null, el * el);
}
async.goon.map(elements, power, function(err, results) {
  assert.deepEqual({a: 1, b: 4, c: 9}, results);
});
```

## parallel
This function accepts an array/object of functions and a callback.
- array/object of functions long 1. This paramater is a next function that accepts an optional error and the result.
- the callback is a function long 2. The first parameter is an array/object of error or null. The second is an array/object with all results finished successfully.

This function calls each functions parallel and, in the end, the given callback.

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

## filter
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

# Parallel: stop on error
This module has 3 functions

## map

## parallel

## filter



# Serie
This module has 3 functions

## map

## serie

## filter

## waterfall


# Other
This module has 1 function

## cascade




