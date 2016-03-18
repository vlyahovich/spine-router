(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("backbone"), require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define(["backbone", "lodash"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("backbone"), require("lodash")) : factory(root["backbone"], root["lodash"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _backbone = __webpack_require__(1);

	var _backbone2 = _interopRequireDefault(_backbone);

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _routerConst = __webpack_require__(3);

	var _debounce = __webpack_require__(4);

	var _middleware = __webpack_require__(5);

	var _middlewaresRouteParams = __webpack_require__(6);

	var _middlewaresReverse = __webpack_require__(7);

	var Router = (function (_Backbone$Router) {
	    _inherits(Router, _Backbone$Router);

	    /**
	     * Redefined Backbone.Router constructor to prevent immediate routes binding
	     * @param {Object} options
	     */

	    function Router() {
	        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        _classCallCheck(this, Router);

	        _get(Object.getPrototypeOf(Router.prototype), 'constructor', this).call(this);

	        if (options.routes) {
	            this.routes = options.routes;
	        }

	        // base register middleware
	        this.use(_middlewaresRouteParams.routeParamsFactory);
	        this.use(_middlewaresReverse.reverseFactory);
	    }

	    /**
	     * @class Router
	     */

	    /**
	     * Bind routes and start history.
	     *
	     * @param {Object} options
	     * @return {Promise}
	     */

	    _createClass(Router, [{
	        key: 'start',
	        value: function start(options) {
	            return this._bindRoutes().then(function () {
	                _backbone2['default'].history.start(options);
	            });
	        }

	        /**
	         * Stop routing.
	         */
	    }, {
	        key: 'stop',
	        value: function stop() {
	            _backbone2['default'].history.stop();
	        }

	        /**
	         * Default router._bindRoutes with a little adjustment to work with Promise
	         *
	         * @return {Promise}
	         * @private
	         */
	    }, {
	        key: '_bindRoutes',
	        value: function _bindRoutes() {
	            if (!this.routes) {
	                return Promise.resolve();
	            }

	            this.routes = _lodash2['default'].result(this, 'routes');

	            var route = null,
	                calls = [],
	                routes = _lodash2['default'].keys(this.routes);

	            while ((route = routes.pop()) != null) {
	                calls.push(this._bindRoute(route, this.routes[route]));
	            }

	            return Promise.all(calls);
	        }

	        /**
	         * Backbone.Router add route.
	         *
	         * @param {String} route
	         * @param {String} name
	         * @return {Promise}
	         */
	    }, {
	        key: '_bindRoute',
	        value: function _bindRoute(route, name) {
	            var _this = this;

	            var event = {
	                route: route,
	                name: name
	            };

	            // add to storage
	            this._addRouteEvent(event, name);

	            // run route registered chain
	            return this.run(_routerConst.REGISTERED_LABEL, _lodash2['default'].extend(event, {
	                label: _routerConst.REGISTERED_LABEL
	            })).then(function (event) {
	                _this._onRegisteredDone(event);

	                // all registered middleware finished,
	                // call parent route method and wrap with run route matched chain
	                // so that we have default router behavior + plugins chain
	                return _this.route(route, name, function (fragment) {
	                    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                        args[_key - 1] = arguments[_key];
	                    }

	                    return _this._onRouteMatched(_lodash2['default'].extend(event, {
	                        label: _routerConst.MATCHED_LABEL,
	                        fragment: fragment,
	                        args: args.slice(0, -1)
	                    }));
	                });
	            })['catch'](this._onErrorCatch.bind(this, event));
	        }

	        /**
	         * @param {RegExp} route
	         * @param {string} fragment
	         * @returns {string[]}
	         *
	         * @private
	         */
	    }, {
	        key: '_extractParameters',
	        value: function _extractParameters(route, fragment) {
	            return [fragment].concat(_get(Object.getPrototypeOf(Router.prototype), '_extractParameters', this).call(this, route, fragment));
	        }

	        /**
	         * @param {Object} event
	         * @return {Object}
	         * @private
	         */
	    }, {
	        key: '_onRegisteredDone',
	        value: function _onRegisteredDone(event) {
	            this.trigger('route:registered', event);

	            return event;
	        }

	        /**
	         * @param {Object} event
	         * @return {Object}
	         * @private
	         */
	    }, {
	        key: '_onMatchedDone',
	        value: function _onMatchedDone(event) {
	            this.trigger('route:matched', event);

	            return event;
	        }

	        /**
	         * @param {Object} event
	         * @returns {*}
	         * @private
	         */
	    }, {
	        key: '_onRouteMatched',
	        value: function _onRouteMatched(event) {
	            var _this2 = this;

	            return (0, _debounce.debounce)(function () {
	                return _this2.run(_routerConst.MATCHED_LABEL, event).then(_this2._onMatchedDone.bind(_this2, event))['catch'](_this2._onErrorCatch.bind(_this2, event));
	            });
	        }

	        /**
	         * @param {Object} event
	         * @param {Array} args
	         * @return {Promise}
	         * @private
	         */
	    }, {
	        key: '_onErrorCatch',
	        value: function _onErrorCatch(event) {
	            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	                args[_key2 - 1] = arguments[_key2];
	            }

	            return this.run.apply(this, [_routerConst.ERROR_LABEL, _lodash2['default'].extend(event, {
	                label: _routerConst.ERROR_LABEL
	            })].concat(args));
	        }

	        /**
	         * @param {Object} event
	         * @param {String} name
	         * @private
	         */
	    }, {
	        key: '_addRouteEvent',
	        value: function _addRouteEvent(event, name) {
	            if (!this._routeEvents) {
	                this._routeEvents = {};
	            }

	            this._routeEvents[name] = event;
	        }

	        /**
	         * @return {Function}
	         */
	    }, {
	        key: 'getMiddleware',
	        value: function getMiddleware() {
	            if (!this.middleware) {
	                this.middleware = (0, _middleware.middleware)(this);
	            }

	            return this.middleware;
	        }

	        /**
	         * @param {Function} fn
	         * @param {Array} args
	         * @return {*}
	         */
	    }, {
	        key: 'use',
	        value: function use(fn) {
	            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	                args[_key3 - 1] = arguments[_key3];
	            }

	            var mw = this.getMiddleware(),
	                result = fn.call.apply(fn, [this].concat(args));

	            return mw(result);
	        }

	        /**
	         * @param {Array} args
	         * @return {*}
	         */
	    }, {
	        key: 'run',
	        value: function run() {
	            var mw = this.getMiddleware();

	            return mw.run.apply(mw, arguments);
	        }
	    }]);

	    return Router;
	})(_backbone2['default'].Router);

	exports.Router = Router;
	exports.MATCHED_LABEL = _routerConst.MATCHED_LABEL;
	exports.REGISTERED_LABEL = _routerConst.REGISTERED_LABEL;
	exports.ERROR_LABEL = _routerConst.ERROR_LABEL;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var MATCHED_LABEL = 'matched';
	var REGISTERED_LABEL = 'registered';
	var ERROR_LABEL = 'error';

	exports.MATCHED_LABEL = MATCHED_LABEL;
	exports.REGISTERED_LABEL = REGISTERED_LABEL;
	exports.ERROR_LABEL = ERROR_LABEL;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var pending = null,
	    next = null,
	    clear = function clear(arg) {
	    pending = null;
	    return arg;
	};

	/**
	 * Debounce mechanics based on Promise.
	 *
	 * debounce(function() {
	 *     return new Promise((resolve, reject) => {
	 *         setTimeout(resolve, 2000);
	 *     });
	 * }); // first
	 *
	 * debounce(function() {...}); // next1
	 * debounce(function() {...}); // next2
	 * debounce(function() {...}); // next3
	 *
	 * Will be executed in order (assuming next1, next2, next3 added immediately):
	 * first then next3 (next1 and next2 will be unresolved Promise)
	 *
	 * @param {Function} fn
	 * @param {Array} args
	 * @return {*}
	 */
	function debounce(fn) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	    }

	    if (pending) {
	        next = fn;

	        // create new buffer Promise and wait for pending to resolve
	        return new Promise(function (resolve, reject) {
	            var resolveNext = function resolveNext() {
	                // if only next is the last function then we execute it,
	                // otherwise it will be unresolved
	                if (next === fn) {
	                    pending = next.apply(undefined, args);

	                    // do clear first to prevent pending to stay for next iterations
	                    pending.then(_lodash2['default'].compose(resolve, clear), _lodash2['default'].compose(reject, clear));
	                }
	            };

	            if (pending) {
	                pending.then(resolveNext, resolveNext);
	            } else {
	                resolveNext();
	            }
	        });
	    }

	    pending = fn.apply(undefined, args);

	    pending.then(clear, clear);

	    return pending;
	}

	exports.debounce = debounce;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.middleware = middleware;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	/**
	 * Middleware utility.
	 *
	 * var mw = middleware(this);
	 *
	 * mw(function () {...});
	 * mw(function () {...});
	 *
	 * mw.run({...});
	 *
	 * @param {*} context
	 */

	function middleware() {
	    var context = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

	    return (function () {
	        var calls = [];

	        /**
	         * Middleware start.
	         *
	         * @param {String} [label]
	         * @param {Array} args argument functions
	         * @return {*}
	         */
	        var use = function use(label) {
	            var hasLabel = true;

	            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                args[_key - 1] = arguments[_key];
	            }

	            if (_lodash2['default'].isFunction(label) || _lodash2['default'].isArray(label)) {
	                args.unshift(label);

	                hasLabel = false;
	            }

	            while (args.length) {
	                var call = args.shift();

	                if (_lodash2['default'].isArray(call)) {
	                    call.forEach(function (callItem) {
	                        if (callItem.label) {
	                            use(callItem.label, callItem.handler);
	                        } else if (callItem.handler) {
	                            use(callItem.handler);
	                        } else {
	                            use(callItem);
	                        }
	                    });

	                    continue;
	                }

	                if (!_lodash2['default'].isFunction(call)) {
	                    throw new TypeError();
	                }

	                if (hasLabel) {
	                    call._label = label;
	                }

	                calls.push(call);
	            }

	            return context;
	        };

	        /**
	         * Run calls chain.
	         *
	         * @param {String} [label]
	         * @param {Array} args arbitrary parameters that will be passed to each chain element
	         * @return {Promise}
	         */
	        use.run = function run(label) {
	            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	                args[_key2 - 1] = arguments[_key2];
	            }

	            var stack = calls.concat(),
	                hasLabel = true,
	                fetch = function fetch(deferred) {
	                if (!stack.length) {
	                    return deferred.resolve.apply(deferred, args);
	                }

	                var fn = stack.shift();

	                if (hasLabel && fn._label) {
	                    if (fn._label === label) {
	                        when(fn, deferred);
	                    } else {
	                        fetch(deferred);
	                    }
	                } else {
	                    when(fn, deferred);
	                }
	            },
	                when = function when(fn, deferred) {
	                try {
	                    Promise.resolve(fn.call.apply(fn, [context].concat(args))).then(function (result) {
	                        if (result === false) {
	                            deferred.resolve(false);
	                        } else {
	                            fetch(deferred);
	                        }
	                    })['catch'](deferred.reject);
	                } catch (err) {
	                    deferred.reject(err);
	                }
	            };

	            // If we don't have string label, then arguments will be all args
	            if (!_lodash2['default'].isString(label)) {
	                args.unshift(label);

	                hasLabel = false;
	            }

	            // early stop
	            if (!stack.length) {
	                return Promise.resolve.apply(Promise, args);
	            }

	            return new Promise(function (resolve, reject) {
	                var deferred = { resolve: resolve, reject: reject };

	                fetch(deferred);
	            });
	        };

	        return use;
	    })();
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _routerConst = __webpack_require__(3);

	var extractParamNames = function extractParamNames(event) {
	    var matchParams = event.route.match(/:[a-z]+/ig) || [];

	    return matchParams.map(function (arg) {
	        return arg.slice(1);
	    });
	},
	    convertRouteToUrlTemplate = function convertRouteToUrlTemplate(event) {
	    return event.route.replace(/[\(\)]/g, '');
	},
	    createRouteParams = function createRouteParams(event, routeArguments) {
	    var routeParams = {};

	    event.routeParams.paramNames.forEach(function (name, index) {
	        routeParams[name] = routeArguments[index];
	    });

	    return routeParams;
	},
	    routeParamsRegister = function routeParamsRegister(event) {
	    event.routeParams = {
	        paramNames: extractParamNames(event),
	        urlTemplate: convertRouteToUrlTemplate(event)
	    };

	    return this;
	},
	    routeParamsMatch = function routeParamsMatch(event) {
	    event.routeParams.params = createRouteParams(event, event.args);

	    return this;
	},
	    routeParamsFactory = function routeParamsFactory() {
	    return [{
	        label: _routerConst.REGISTERED_LABEL,
	        handler: routeParamsRegister
	    }, {
	        label: _routerConst.MATCHED_LABEL,
	        handler: routeParamsMatch
	    }];
	};

	exports.routeParamsFactory = routeParamsFactory;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _routerConst = __webpack_require__(3);

	/**
	 * @returns {*[]}
	 */
	var reverseFactory = function reverseFactory() {
	    var _this = this;

	    var lastParams = undefined,
	        lastRouteName = undefined;

	    /**
	     * @param {string} route
	     * @param {{}} [params]
	     * @param {{}} [query]
	     * @returns {string}
	     */
	    this.reverse = function (route, params, query) {
	        var target = _this._routeEvents[route],
	            targetUrl = target.routeParams.urlTemplate;

	        query = query || {};

	        _lodash2['default'].each(params, function (value, key) {
	            if (target.routeParams.paramNames.indexOf(key) > -1) {
	                targetUrl = targetUrl.replace(':' + key, value);
	            } else {
	                if (value != null && value != '') {
	                    query[key] = value;
	                } else {
	                    delete query[key];
	                }
	            }
	        });

	        var url = _this.buildUrl(targetUrl, query);

	        if (url.slice(0, 6) === 'https:') {
	            return url;
	        }

	        if (url[0] !== '/') {
	            return '/' + url;
	        }

	        return url;
	    };

	    /**
	     * @param {{}} params
	     * @returns {string}
	     */
	    this.reverseReplace = function (params) {
	        return _this.reverse(lastRouteName, _lodash2['default'].extend({}, lastParams, params));
	    };

	    /**
	     * @param {string} url
	     * @param {{}} [query]
	     *
	     * @returns {string}
	     */
	    this.buildUrl = function (url, query) {
	        var queryString = _this.buildQuery(query);

	        if (queryString.length) {
	            return url + '?' + queryString;
	        } else {
	            return url;
	        }
	    };

	    /**
	     * @param {{}} query
	     *
	     * @returns {string}
	     */
	    this.buildQuery = function (query) {
	        if (!query) {
	            return '';
	        }

	        var result = _lodash2['default'].map(query, function (value, key) {
	            return encodeURIComponent(key) + '=' + encodeURIComponent(value);
	        });

	        return result.join('&');
	    };

	    /**
	     * @param {string} query
	     * @returns {{key: string, value: string}[]}
	     */
	    this.parseQueryToPairs = function (query) {
	        if (query[0] == '?') {
	            query = query.substr(1);
	        }

	        if (query.length === 0) {
	            return [];
	        }

	        return query.split('&').map(function (part) {
	            var match = part.split('='),
	                key = decodeURIComponent(match[0]),
	                value = decodeURIComponent(_lodash2['default'].rest(match).join('=').replace(/\+/g, '%20'));

	            return {
	                key: key,
	                value: value
	            };
	        });
	    };

	    /**
	     * @param {string} query
	     * @returns {{}}
	     */
	    this.parseQuery = function (query) {
	        var params = {};

	        _this.parseQueryToPairs(query).forEach(function (part) {
	            var key = part.key,
	                value = part.value;

	            if (key) {
	                if (key.slice(-2) === '[]') {
	                    key = key.slice(0, -2);

	                    if (!params[key]) {
	                        params[key] = [];
	                    }

	                    params[key].push(value);
	                } else {
	                    params[key] = value;
	                }
	            }
	        });

	        return params;
	    };

	    return [{
	        label: _routerConst.MATCHED_LABEL,
	        handler: function handler(event) {
	            var search = event.fragment.split('?').slice(1).join('?');
	            event.query = _this.parseQuery(search);

	            lastParams = _lodash2['default'].extend({}, event.query, event.routeParams.params);
	            lastRouteName = event.name;
	        }
	    }];
	};

	exports.reverseFactory = reverseFactory;

/***/ }
/******/ ])
});
;