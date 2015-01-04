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

module.exports.cascade = cascade;
module.exports.waterfall = waterfall;
