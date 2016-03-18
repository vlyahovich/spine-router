import {MATCHED_LABEL, REGISTERED_LABEL} from '../router.js';
import _ from 'lodash';

/**
 * Load bundles
 */
let bundleLoader = function () {
    throw new Error('Use bundleLoader.factory instead');
};

/**
 * @param {function|{keys: function}} require
 * @returns {Function}
 */
let createLoader = function (require) {
    let bundles = require.keys().map((path) => {
        var name = path.match(/\/([^\/]+)$/)[1];

        return {name, path};
    });

    let loadBundle = (name) => {
        var description = _.findWhere(bundles, {name});

        if (description) {
            let bundleLoader = require(description.path);

            if (typeof bundleLoader === 'function' && !bundleLoader.name) {
                if (bundleLoader.length === 1) {
                    return new Promise((resolve) => {
                        bundleLoader(resolve);
                    });
                } else if (bundleLoader.length === 0) {
                    return bundleLoader();
                }
            }

            return bundleLoader;
        }
    };

    return (name) => Promise.resolve(loadBundle(name));
};

/**
 * @param {{}} requires
 * @returns {Function}
 *
 * Usage:
 *
 * ```
 * bundleLoader.factory({
 *     Application: require.context('bundle!./application/', true, /Application.js$/)
 * })
 * ```
 */
bundleLoader.factory = function (requires) {
    let resourcesToLoad = _.keys(requires),
        loaders = {};

    _.forEach(requires, function (require, bundleName) {
        loaders[bundleName] = createLoader(require);
    });

    let normalizeName = _.memoize((name) => {
        let normalizeName = name.replace(/:./g, function (match) {
            return match.slice(1).toUpperCase();
        });

        return normalizeName.slice(0, 1).toUpperCase() + normalizeName.slice(1);
    });

    let loadBundle = function (event, bundleName) {
        let name = normalizeName(event.name) + normalizeName(bundleName) + '.js';

        event.bundles = event.bundles || {};

        return loaders[bundleName](name).then((module) => {
            if (module) {
                event.bundles[bundleName] = module;
            }
        });
    };

    return () => {
        return [{
            label: MATCHED_LABEL,
            handler: (event) => {
                return Promise.all(resourcesToLoad.map(bundleName => loadBundle(event, bundleName)))
                    .then(_ => event)
                    .catch(err => console.error(err));
            }
        }];
    };
};

export {bundleLoader, createLoader};
