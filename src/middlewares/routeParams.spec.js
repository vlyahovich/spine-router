import chai from 'chai';
import {expect} from 'chai';
import {Router, MATCHED_LABEL} from '../router';
import Backbone from 'backbone';

describe('Router', function () {
    beforeEach(function () {
        this.router = new Router({
            routes: {
                'test/:id/:name?q=:q': 'test'
            }
        });
    });

    afterEach(function () {
        this.router.stop();

        window.location.hash = '';
    });

    it('should extract route params', function (done) {
        this.router.on('route:matched', function (event) {
            expect(event.routeParams.paramNames).to.be.eql(['id', 'name', 'q']);
            expect(event.routeParams.params).to.be.eql({
                id: '10',
                name: 'hi',
                q: '1'
            });

            done();
        });

        this.router.start({pushState: false}).then(() => {
            Backbone.history.navigate('test/10/hi?q=1', {trigger: true});
        });
    });
});
