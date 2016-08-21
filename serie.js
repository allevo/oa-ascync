'use strict';

var helper = require('./helper');
var getObjectValues = helper.getObjectValues;
var getObjectFromArray = helper.getObjectFromArray;


function mapObject(obj, iter, callback) {
  var keys = Object.keys(obj);
  if (keys.length === 0) {
    return setTimeout(callback.bind(null, null, {}), 0);
  }
  var current = 0;

  var ret = {};

  var hasError = false;
  function execute() {
    iter(obj[keys[current]], function(err, mapped) {
      if (hasError) { return; }

      if (err) {
        hasError = true;
        return callback(err, ret);
      }

      ret[keys[current]] = mapped;
      current ++;

      if (current === keys.length) {
        callback(null, ret);
      } else {
        execute();
      }
    });
  }

  execute();
}

function map(obj, iter, callback) {
  var _obj = obj;
  var isArray = Array.isArray(obj);
  if (isArray) {
    _obj = getObjectFromArray(_obj);
  }

  if (isArray) {
    mapObject(obj, iter, function(err, results) {
      if (results) {
        results = getObjectValues(results);
      }
      callback(err, results);
    });
  } else {
    mapObject(obj, iter, callback);
  }
}

module.exports.map = map;
module.exports.series = function(obj, iter, callback) {
  helper.parallel(map, obj, iter, callback);
};
module.exports.filter = function(obj, iter, callback) {
  helper.filter(map, obj, iter, callback);
};
