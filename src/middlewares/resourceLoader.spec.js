import {expect} from 'chai';

import {Router, ERROR_LABEL} from '../router.js';
import {resourceLoader} from './resourceLoader.js';
import {routeMatch} from './helpers/routeMatch.js';

let resources = {
    resource1() {
        return 'resource1'
    },

    resource2() {
        return Promise.resolve('resource2');
    }
};

describe('resourceLoader middleware', function () {
    let router;

    beforeEach(function () {
        router = new Router({
            routes: {
                'route/1': 'route1',
                'route/2': 'route2',
                'route/3': 'route3'
            }
        });

        router.use(resourceLoader.factory({
            provider: resources,
            mappings: {
                route1: ['resource1'],
                route2: ['resource2'],
                route3: ['resource1', 'resource2']
            }
        }));

        return router.start({pushState: false});
    });

    afterEach(function () {
        router.stop();
        window.location.hash = '';
    });

    it('load resources for route 1', function () {
        return routeMatch(router, '/route/1').then((event) => {
            expect(event.resources.resource1).to.equal('resource1');
        });
    });

    it('load resources for route 2', function () {
        return routeMatch(router, '/route/2').then((event) => {
            expect(event.resources.resource2).to.equal('resource2');
        });
    });

    it('load resources for route 3', function () {
        return routeMatch(router, '/route/3').then((event) => {
            expect(event.resources.resource1).to.equal('resource1');
            expect(event.resources.resource2).to.equal('resource2');
        });
    });

});
