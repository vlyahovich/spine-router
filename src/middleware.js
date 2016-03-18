import _ from 'lodash';

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
export function middleware(context = null) {
    return (function () {
        var calls = [];

        /**
         * Middleware start.
         *
         * @param {String} [label]
         * @param {Array} args argument functions
         * @return {*}
         */
        var use = function use(label, ...args) {
            var hasLabel = true;

            if (_.isFunction(label) || _.isArray(label)) {
                args.unshift(label);

                hasLabel = false;
            }

            while (args.length) {
                var call = args.shift();

                if (_.isArray(call)) {
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

                if (!_.isFunction(call)) {
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
        use.run = function run(label, ...args) {
            var stack = calls.concat(),
                hasLabel = true,
                fetch = function fetch(deferred) {
                    if (!stack.length) {
                        return deferred.resolve(...args);
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
                        Promise.resolve(fn.call(context, ...args))
                            .then((result) => {
                                if (result === false) {
                                    deferred.resolve(false);
                                } else {
                                    fetch(deferred);
                                }
                            })
                            .catch(deferred.reject);
                    } catch (err) {
                        deferred.reject(err);
                    }
                };

            // If we don't have string label, then arguments will be all args
            if (!_.isString(label)) {
                args.unshift(label);

                hasLabel = false;
            }

            // early stop
            if (!stack.length) {
                return Promise.resolve(...args);
            }

            return new Promise((resolve, reject) => {
                var deferred = {resolve, reject};

                fetch(deferred);
            });
        };

        return use;
    }());
}
