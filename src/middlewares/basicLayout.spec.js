import {expect} from 'chai';

import {Router, MATCHED_LABEL, ERROR_LABEL} from '../router.js';
import {basicLayout} from './basicLayout.js';
import {routeMatch} from './helpers/routeMatch.js';

describe('basicLayout middleware', function () {
    let router;

    beforeEach(function () {
        router = new Router({
            routes: {
                'route/1': 'route1',
                'route/2': 'route2',
                'route/3': 'route3',
                'route/4': 'route4'
            }
        });

        router.use(function () {
            return [{
                label: MATCHED_LABEL,
                handler: function (event) {
                    var Layout = function () {
                        this.layout = event.name;
                    };

                    if (event.name === 'route1') {
                        event.bundles = {
                            Layout: {
                                factory: function () {
                                    return new Layout()
                                }
                            }
                        };
                    }

                    if (event.name === 'route2') {
                        event.bundles = {
                            Layout: {
                                factory: function () {
                                    return Promise.resolve(new Layout())
                                }
                            }
                        };
                    }

                    if (event.name === 'route3') {
                        event.bundles = {
                            Layout: Layout
                        };
                    }
                }
            }];
        });

        router.use(basicLayout);

        return router.start({pushState: false});
    });

    afterEach(function () {
        router.stop();
        window.location.hash = '';
    });

    it('load views for route 1 (sync)', function () {
        return routeMatch(router, '/route/1').then((event) => {
            expect(event.views.layout.layout).to.equal('route1');
        });
    });

    it('load views for route 2 (async)', function () {
        return routeMatch(router, '/route/2').then((event) => {
            expect(event.views.layout.layout).to.equal('route2');
        });
    });

    it('load views for route 3 (no factory)', function () {
        return routeMatch(router, '/route/3').then((event) => {
            expect(event.views.layout.layout).to.equal('route3');
        });
    });

    it('load views for route 4 (cause error, because bundler was not found)', function (done) {
        routeMatch(router, '/route/4').catch(() => done());
    });

});
