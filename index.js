'use strict';


function getObjectValues(obj) {
	var l = Object.keys(obj).length;
	var r = [];
	for (var i=0; i<l; i++) {
		r.push(obj[i]);
	}
	return r;
}

function hasOnlyEmptyValues(obj) {
	for (var k in obj) {
		if (obj[k]) { return false; }
	}
	return true;
}

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
			key: key
		});
	}

	var count = 0;
	tasks.forEach(function(element) {
		element.func(function(err, res) {
			if (err) {
				// forcing res tu undefined
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
