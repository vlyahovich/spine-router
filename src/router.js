import Backbone from 'backbone';
import _ from 'lodash';

import {MATCHED_LABEL, REGISTERED_LABEL, ERROR_LABEL} from './routerConst';
import {debounce} from './debounce';
import {middleware} from './middleware';
import {routeParamsFactory} from './middlewares/routeParams';
import {reverseFactory} from './middlewares/reverse';

class Router extends Backbone.Router {
    /**
     * Redefined Backbone.Router constructor to prevent immediate routes binding
     * @param {Object} options
     */
    constructor(options = {}) {
        super();

        if (options.routes) {
            this.routes = options.routes;
        }

        // base register middleware
        this.use(routeParamsFactory);
        this.use(reverseFactory);
    }

    /**
     * Bind routes and start history.
     *
     * @param {Object} options
     * @return {Promise}
     */
    start(options) {
        return this
            ._bindRoutes()
            .then(() => {
                Backbone.history.start(options);
            });
    }

    /**
     * Stop routing.
     */
    stop() {
        Backbone.history.stop();
    }

    /**
     * Default router._bindRoutes with a little adjustment to work with Promise
     *
     * @return {Promise}
     * @private
     */
    _bindRoutes() {
        if (!this.routes) {
            return Promise.resolve();
        }

        this.routes = _.result(this, 'routes');

        var route = null,
            calls = [],
            routes = _.keys(this.routes);

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
    _bindRoute(route, name) {
        var event = {
            route: route,
            name: name
        };

        // add to storage
        this._addRouteEvent(event, name);

        // run route registered chain
        return this
            .run(REGISTERED_LABEL, _.extend(event, {
                label: REGISTERED_LABEL
            }))
            .then((event) => {
                this._onRegisteredDone(event);

                // all registered middleware finished,
                // call parent route method and wrap with run route matched chain
                // so that we have default router behavior + plugins chain
                return this.route(route, name, (fragment, ...args) => {
                    return this._onRouteMatched(_.extend(event, {
                        label: MATCHED_LABEL,
                        fragment: fragment,
                        args: args.slice(0, -1)
                    }));
                });
            })
            .catch(this._onErrorCatch.bind(this, event));
    }

    /**
     * @param {RegExp} route
     * @param {string} fragment
     * @returns {string[]}
     *
     * @private
     */
    _extractParameters(route, fragment) {
        return [fragment].concat(super._extractParameters(route, fragment));
    }

    /**
     * @param {Object} event
     * @return {Object}
     * @private
     */
    _onRegisteredDone(event) {
        this.trigger('route:registered', event);

        return event;
    }

    /**
     * @param {Object} event
     * @return {Object}
     * @private
     */
    _onMatchedDone(event) {
        this.trigger('route:matched', event);

        return event;
    }

    /**
     * @param {Object} event
     * @returns {*}
     * @private
     */
    _onRouteMatched(event) {
        return debounce(() => {
            return this.run(MATCHED_LABEL, event)
                .then(this._onMatchedDone.bind(this, event))
                .catch(this._onErrorCatch.bind(this, event));
        });
    }

    /**
     * @param {Object} event
     * @param {Array} args
     * @return {Promise}
     * @private
     */
    _onErrorCatch(event, ...args) {
        return this.run(ERROR_LABEL, _.extend(event, {
            label: ERROR_LABEL
        }), ...args);
    }

    /**
     * @param {Object} event
     * @param {String} name
     * @private
     */
    _addRouteEvent(event, name) {
        if (!this._routeEvents) {
            this._routeEvents = {};
        }

        this._routeEvents[name] = event;
    }

    /**
     * @return {Function}
     */
    getMiddleware() {
        if (!this.middleware) {
            this.middleware = middleware(this);
        }

        return this.middleware;
    }

    /**
     * @param {Function} fn
     * @param {Array} args
     * @return {*}
     */
    use(fn, ...args) {
        var mw = this.getMiddleware(),
            result = fn.call(this, ...args);

        return mw(result);
    }

    /**
     * @param {Array} args
     * @return {*}
     */
    run(...args) {
        var mw = this.getMiddleware();

        return mw.run(...args);
    }
}

/**
 * @class Router
 */
export {Router, MATCHED_LABEL, REGISTERED_LABEL, ERROR_LABEL};
