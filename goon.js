'use strict';

var helper = require('./helper');
var hasOnlyEmptyValues = helper.hasOnlyEmptyValues;
var getObjectValues = helper.getObjectValues;


function mapObject(obj, iter, callback) {
  var objCount = Object.keys(obj).length;
  if (objCount === 0) {
    callback(null, {});
  }

  var tasks = [];
  var ret = {};
  var errs = {};
  for(var key in obj) {
    var item = obj[key];
    tasks.push({
      func: iter.bind(null, item),
      key: key,
    });
  }

  var count = 0;
  tasks.forEach(function(element) {
    element.func(function(err, res) {
      if (err) {
        // forcing res to undefined
        res = undefined;
      }
      errs[element.key] = err;
      ret[element.key] = res;
      count ++;
      if (count === objCount) {
        callback(hasOnlyEmptyValues(errs) ? null 
          : errs, ret);
      }
    });
  });
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
      var r = getObjectValues(results);

      var e;
      if (err) {
        e = getObjectValues(err);   
      }
      callback(e, r);
    });
  } else {
    mapObject(obj, iter, callback);
  }
}


module.exports.map = map;
module.exports.parallel = helper.parallel.bind(null, map);
module.exports.filter = helper.filter.bind(null, map);
