import {MATCHED_LABEL} from '../router.js';
import _ from 'lodash';

/**
 * @param {} router
 * @returns {*}
 */
let resourceLoader = function () {
    throw new Error('Use resourceLoader.factory instead');
};

/**
 * @returns {Function}
 */
let createLoader = function ({provider}) {
    return (resources, ...args) => {
        let result = {};

        let loadResource = (resource) => {
            return Promise.resolve(provider[resource.value](...args)).then(value => result[resource.key] = value);
        };

        return Promise.all(resources.map(loadResource)).then(_ => result);
    };
};

/**
 * Convert mappings to common format
 *
 * @param {{}} mappings
 * @returns {{}}
 */
let normalizeMappings = function (mappings) {
    let result = {};

    let normalizeResources = (resources) => {
        if (_.isArray(resources)) {
            return resources.map((resource) => {
                return {
                    key: resource,
                    value: resource
                };
            });
        } else {
            return _.map(resources, (value, key) => {
                return {
                    key: key,
                    value: value
                };
            });
        }
    };

    _.forEach(mappings, (resources, key) => {
        result[key] = normalizeResources(_.result(mappings, key));
    });

    return result;
};

/**
 * @param {object} provider
 * @param {object} mappings
 *
 * @returns {Function}
 */
resourceLoader.factory = ({provider, mappings}) => {
    let loader = createLoader({provider});

    return () => {
        let normalizedMappings = normalizeMappings(mappings),
            defaults = normalizedMappings.defaults || [];

        return [{
            label: MATCHED_LABEL,
            handler: (event) => {
                let resources = [].concat(defaults).concat(normalizedMappings[event.name] || []);

                return loader(resources, event).then((resources) => {
                    event.resources = resources;
                    return event;
                });
            }
        }];
    };
};

resourceLoader.createLoader = createLoader;

export {resourceLoader};
