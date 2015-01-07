'use strict';

/**
 * Return all values of an given object.
 * @param {object}
 * @return array
 */
function getObjectValues(obj) {
  var l = Object.keys(obj).length;
  var r = [];
  for (var i=0; i<l; i++) {
    r.push(obj[i]);
  }
  return r;
}

/**
 * Return first value not null or not undefinied
 * @param {object}
 * @return the value or undefined
 */
function getFirstNotNullElement(obj) {
  for (var k in obj) {
    if (obj[k] !== null && obj[k] !== undefined) { return obj[k]; }
  }
  return undefined;
}

/**
 * Return true if obj contains only false value. The test is done with a simple if
 * @param {object}
 * @return bool
 */
function hasOnlyEmptyValues(obj) {
  for (var k in obj) {
    if (obj[k]) { return false; }
  }
  return true;
}


function parallel(mapFunction, obj, callback) {
  mapFunction(obj, function(item, next) { item(next); }, callback);
}

function filter(mapFunction, obj, iter, callback) {
  var isArray = Array.isArray(obj);
  mapFunction(obj, iter, function(err, results) {
    var addFunction;
    var r;
    if (isArray) {
      r = [];
      addFunction = function(i, e) {
        r.push(e);
      };
    } else {
      r = {};
      addFunction = function(i, e) {
        r[i] = e;
      };
    }

    for (var i in results) {
      if (results[i] === true) {
        addFunction(i, obj[i]);
      }
    }

    callback(err, r);
  });
}


module.exports = {
  getObjectValues: getObjectValues,
  hasOnlyEmptyValues: hasOnlyEmptyValues,
  getFirstNotNullElement: getFirstNotNullElement,
  parallel: parallel,
  filter: filter,
};
