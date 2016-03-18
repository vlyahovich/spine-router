import {expect} from 'chai';

import {Router, MATCHED_LABEL, ERROR_LABEL} from '../router.js';
import {bundleLoader} from './bundleLoader.js';
import {routeMatch} from './helpers/routeMatch.js';

describe('bundleLoader middleware', function () {
    let router;

    afterEach(function () {
        router.stop();
        window.location.hash = '';
    });

    let createTests = function (requires) {

        beforeEach(function () {
            router = new Router({
                routes: {
                    'route/1': 'route1',
                    'route/2': 'route2'
                }
            });

            router.use(bundleLoader.factory(requires));

            return router.start({pushState: false});
        });

        it('load bundles for route 1 (all bundles loaded)', function () {
            return routeMatch(router, 'route/1').then(function (event) {
                expect(event.bundles.Application.name).to.equal('Route1Application');
                expect(event.bundles.State.name).to.equal('Route1State');
            });
        });

        it('load bundles for route 2 (state bundle lost)', function () {
            return routeMatch(router, 'route/2').then(function (event) {
                expect(event.bundles.Application.name).to.equal('Route2Application');
                expect(event.bundles.State).to.equal(undefined);
            });
        });

    };

    describe('sync mode', function () {
        createTests({
            Application: require.context('./fixtures/', true, /Application\.js$/),
            State: require.context('./fixtures/', true, /State\.js$/)
        });
    });

    describe('async mode', function () {
        createTests({
            Application: require.context('bundle!./fixtures/', true, /Application\.js$/),
            State: require.context('bundle!./fixtures/', true, /State\.js$/)
        });
    });

    describe('promise mode', function () {
        createTests({
            Application: require.context('promise?global!./fixtures/', true, /Application\.js$/),
            State: require.context('promise?global!./fixtures/', true, /State\.js$/)
        });
    });

});
