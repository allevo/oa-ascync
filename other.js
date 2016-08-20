'use strict';


var map = require('./goon').map;

function cascade(_tasks, callback) {
  var keys = Object.keys(_tasks);

  var concluted = {};
  var tasks = {};
  for(var k in _tasks) {
    tasks[k] = {
      key: k,
    };
    
    // TODO: do this better
    if (_tasks[k].constructor === Function) {
      tasks[k].func = _tasks[k];
      tasks[k].requirements = [];
    } else {
      tasks[k].func = _tasks[k][_tasks[k].length - 1];
      tasks[k].requirements = _tasks[k].slice(0, _tasks[k].length - 1);
    }
  }

  function isInConcluted(i) {
    return (i in concluted);
  }

  var isFirst = true;
  var hasError = false;
  function execute() {
    var todo = {};
    for (var i in tasks) {
      if (tasks[i].key in concluted) { continue; }

      if (tasks[i].requirements.every(isInConcluted)) {
        todo[i] = tasks[i];
      }
    }


    map(todo, function(item, next) {
      if (isFirst) {
        item.func(next);
      } else {
        item.func(concluted, next);
      }
    }, function(err, result) {
      if (hasError) {
        return;
      }

      isFirst = false;
      if (err) {
        hasError = true;
        return callback(err, concluted);
      }

      for (var k in result) {
        concluted[k] = result[k];
      }

      if (keys.length === Object.keys(concluted).length) {
        return callback(err, concluted);
      }
      execute();
    });
  }

  execute();
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

function __solveDependenciesTree(deps, results, callback) {
  var taskNamesCanBeExecuted = Object.keys(deps).filter(function(k) {
    // already done
    if (results.hasOwnProperty(k)) return false;

    for(var i in deps[k].dependencies) {
      // not all deps are satified
      if (!results.hasOwnProperty(deps[k].dependencies[i])) return false;
    }
    return true;
  }).reduce(function(s, i) {
    s[i] = i;
    return s;
  }, {});

  if (Object.keys(taskNamesCanBeExecuted).length === 0 && Object.keys(deps).length !== Object.keys(results).length) {
    return callback({ __internal__: new Error('Cannot resolve dependencies tree')}, results);
  }

  map(taskNamesCanBeExecuted, function(fnName, next) {
    deps[fnName].task(results, next)
  }, function(err, res) {
    for (var k in res) {
      results[k] = res[k];
    }

    if (err || Object.keys(deps).length === Object.keys(results).length) return callback(err, results);

    __solveDependenciesTree(deps, results, callback);
  });
}

function solveDependenciesTree(deps, callback) {
  var results = {};

  __solveDependenciesTree(deps, results, callback);
}

module.exports.cascade = cascade;
module.exports.waterfall = waterfall;
module.exports.solveDependenciesTree = solveDependenciesTree;
