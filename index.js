/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2016-09-01
* Updated at  : 2017-08-24
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

/* Useless for each async {{{1
 * use then methods instead of this crap
for_each_async : function (items, iterator) {
	var index    = -1,
		deferred = this.defer();

	next();

	// jshint latedef : false
	return deferred.promise;

	function next () {
		if (++index < items.length) {
			try {
				iterator.call(items, items[index], index, next, rejector);
			} catch (e) {
				rejector(e);
			}
		} else {
			deferred.resolve();
		}
	}

	function rejector (reason) {
		deferred.reject(reason);
	}
	// jshint latedef : true
},
}}}1 */

// ignore:end

var JeefoPromise = require("jeefo_promise");

module.exports = {
	defer : function () {
		var deferred = {};
		deferred.promise = new JeefoPromise(function (resolve, reject) {
			deferred.resolve = resolve;
			deferred.reject  = reject;
		});
		return deferred;
	},
	reject : function (reason) {
		return new JeefoPromise(function (resolve, reject) {
			reject(reason);
		});
	},
	when  : function (value) {
		if (value && value.then) {
			return value;
		}

		return new JeefoPromise(function (resolve) {
			resolve(value);
		});
	},
	all : function (promises) {
		var i = promises.length, deferred = this.defer(), pending_counter = 0, promise;

		while (i--) {
			promise = promises[i];

			if (promise && promise.then) {
				pending_counter += 1;

				// Async resolver
				promise.then(closure(i)).$catch(catcher);
			}
		}

		if (pending_counter === 0) {
			deferred.resolve(promises);
		}

		// jshint latedef : false
		return deferred.promise;

		function catcher (reason) {
			return deferred.reject(reason);
		}

		function closure (index) {
			return function (value) {
				promises[index] = value;

				if (--pending_counter === 0) {
					deferred.resolve(promises);
				}
			};
		}
		// jshint latedef : true
	}
};
