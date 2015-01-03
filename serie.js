'use strict';

var helper = require('./helper');
var getObjectValues = helper.getObjectValues;


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
  var isArray = Array.isArray(obj);
  if (isArray) {
    var _obj = {};
    for(var i in obj) {
      _obj[i] = obj[i];
    }
    obj = _obj;
  }

  if (isArray) {
    mapObject(obj, iter, function(err, results) {
      if (!!results) {
        results = getObjectValues(results);
      }
      callback(err, results);
    });
  } else {
    mapObject(obj, iter, callback);
  }
}

function waterfall(arr, callback) {
  if (!Array.isArray(arr)) {
    return callback(new Error('arr must be an array'));
  }

  var length = arr.length;

  if (length === 0) {
    return setTimeout(callback.bind(null, null, undefined), 0);
  }
  var current = 0;

  var lastRet;
  function execute(ret) {
    var c;
    if (current === 0) {
      c = arr[current];
    } else {
      c = arr[current].bind(null, ret);
    }
    c(function(err, ret) {
      if (err) {
        return callback(err, lastRet);
      }

      current ++;
      lastRet = ret;
      if (current === length) {
        callback(null, ret);
      } else {
        execute(lastRet);
      }
    });
  }

  execute();
}


module.exports.map = map;
module.exports.series = helper.parallel.bind(null, map);
module.exports.filter = helper.filter.bind(null, map);
module.exports.waterfall = waterfall;
