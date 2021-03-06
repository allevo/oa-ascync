'use strict';

function getObjectValues(obj) {
  var l = Object.keys(obj).length;
  var r = [];
  for (var i=0; i<l; i++) {
    r.push(obj[i]);
  }
  return r;
}

function getFirstNotNullElement(obj) {
  for (var k in obj) {
    if (obj[k] !== null && obj[k] !== undefined) { return obj[k]; }
  }
  return undefined;
}

function hasOnlyEmptyValues(obj) {
  for (var k in obj) {
    if (obj[k]) { return false; }
  }
  return true;
}

function getObjectFromArray(obj) {
  var _obj = {};
  for(var i in obj) {
    _obj[i] = obj[i];
  }
  return _obj;
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
  getObjectFromArray: getObjectFromArray,
};
