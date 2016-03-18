import {expect} from 'chai';

import {Router, MATCHED_LABEL, ERROR_LABEL} from '../router.js';
import {basicRender} from './basicRender.js';
import {routeMatch} from './helpers/routeMatch.js';

describe('basicRender middleware', function () {
    let router, region;

    beforeEach(function () {
        router = new Router({
            routes: {
                'route/1': 'route1',
                'route/2': 'route2'
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
                        event.views = {
                            layout: new Layout()
                        };
                    }
                }
            }];
        });

        region = {};

        router.use(basicRender.factory({region: region}));

        return router.start({pushState: false});
    });

    afterEach(function () {
        router.stop();
        window.location.hash = '';
    });

    let show = function () {
        return new Promise((resolve) => {
            region.show = resolve;
        });
    };

    it('render layout for route 1', function () {
        return Promise.all([
            show().then(function (layout) {
                expect(layout.layout).to.equal('route1');
            }),
            routeMatch(router, '/route/1')
        ]);
    });

    it('layout not found for route 2', function (done) {
        routeMatch(router, '/route/2').catch(() => done());
    });

});
