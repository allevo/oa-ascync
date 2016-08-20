'use strict';


var helper = require('./helper');
var getObjectValues = helper.getObjectValues;


function mapObject(obj, iter, callback) {
  var objCount = Object.keys(obj).length;
  if (objCount === 0) {
    callback(null, {});
  }

  var tasks = [];
  var ret = {};
  for(var key in obj) {
    var item = obj[key];
    tasks.push({
      func: iter.bind(null, item),
      key: key,
    });
  }

  var count = 0;
  var hasError = false;
  tasks.forEach(function(element) {
    element.func(function(err, res) {
      if (hasError) { return; }

      if (err) {
        hasError = true;
        return callback(err);
      }
      
      ret[element.key] = res;
      count ++;
      if (count === objCount) {
        callback(null, ret);
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
      if (results) {
        results = getObjectValues(results);
      }
      callback(err, results);
    });
  } else {
    mapObject(obj, iter, callback);
  }
}

function parallel(obj, callback) {
  map(obj, function(item, next) { item(next); }, callback);
}

function filter(obj, iter, callback) {
  var isArray = Array.isArray(obj);
  map(obj, iter, function(err, results) {
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


module.exports.map = map;
module.exports.parallel = parallel;
module.exports.filter = filter;
