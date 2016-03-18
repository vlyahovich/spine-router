import _ from 'lodash';

import {MATCHED_LABEL} from '../routerConst';

/**
 * @returns {*[]}
 */
var reverseFactory = function () {
    let lastParams, lastRouteName;

    /**
     * @param {string} route
     * @param {{}} [params]
     * @param {{}} [query]
     * @returns {string}
     */
    this.reverse = (route, params, query) => {
        var target = this._routeEvents[route],
            targetUrl = target.routeParams.urlTemplate;

        query = query || {};

        _.each(params, function (value, key) {
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

        let url = this.buildUrl(targetUrl, query);

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
    this.reverseReplace = (params) => {
        return this.reverse(lastRouteName, _.extend({}, lastParams, params));
    };

    /**
     * @param {string} url
     * @param {{}} [query]
     *
     * @returns {string}
     */
    this.buildUrl = (url, query) => {
        var queryString = this.buildQuery(query);

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
    this.buildQuery = (query) => {
        if (!query) {
            return '';
        }

        let result = _.map(query, (value, key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(value);
        });

        return result.join('&');
    };

    /**
     * @param {string} query
     * @returns {{key: string, value: string}[]}
     */
    this.parseQueryToPairs = (query) => {
        if (query[0] == '?') {
            query = query.substr(1);
        }

        if (query.length === 0) {
            return [];
        }

        return query.split('&').map(function (part) {
            let match = part.split('='),
                key = decodeURIComponent(match[0]),
                value = decodeURIComponent(_.rest(match).join('=').replace(/\+/g, '%20'));

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
    this.parseQuery = (query) => {
        let params = {};

        this.parseQueryToPairs(query).forEach(function (part) {
            let key = part.key,
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
        label: MATCHED_LABEL,
        handler: (event) => {
            let search = event.fragment.split('?').slice(1).join('?');
            event.query = this.parseQuery(search);

            lastParams = _.extend({}, event.query, event.routeParams.params);
            lastRouteName = event.name;
        }
    }];
};

export {reverseFactory};
