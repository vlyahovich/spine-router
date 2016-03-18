import {expect} from 'chai';

import {Router, MATCHED_LABEL, ERROR_LABEL} from '../router.js';
import {applicationLoader} from './applicationLoader.js';
import {routeMatch} from './helpers/routeMatch.js';

describe('applicationLoader middleware', function () {
    let router;

    beforeEach(function () {
        router = new Router({
            routes: {
                'route/1': 'route1',
                'route/2': 'route2',
                'route/3': 'route3'
            }
        });

        router.use(function () {
            return [{
                label: MATCHED_LABEL,
                handler: function (event) {
                    if (event.name === 'route1') {
                        event.bundles = {
                            Application: {
                                factory: function () {
                                    return 'application1'
                                }
                            }
                        };
                    }

                    if (event.name === 'route2') {
                        event.bundles = {
                            Application: {
                                factory: function () {
                                    return Promise.resolve('application2')
                                }
                            }
                        };
                    }
                }
            }];
        });

        router.use(applicationLoader);

        return router.start({pushState: false});
    });

    afterEach(function () {
        router.stop();
        window.location.hash = '';
    });

    it('load application for route 1 (sync)', function () {
        return routeMatch(router, '/route/1').then((event) => {
            expect(event.resources.model).to.equal('application1');
        });
    });

    it('load application for route 2 (async)', function () {
        return routeMatch(router, '/route/2').then((event) => {
            expect(event.resources.model).to.equal('application2');
        });
    });

    it('load application for route 3 (cause error, because bundler was not found)', function (done) {
        routeMatch(router, '/route/3').catch(() => done());
    });

});
