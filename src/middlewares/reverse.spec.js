import chai from 'chai';
import {expect} from 'chai';
import {Router, MATCHED_LABEL} from '../router';
import Backbone from 'backbone';

describe('Router', function () {
    beforeEach(function () {
        this.router = new Router({
            routes: {
                'test/:id/:name': 'test'
            }
        });
    });

    afterEach(function () {
        this.router.stop();

        window.location.hash = '';
    });

    it('should extract route params', function () {
        var router = this.router;

        return router.start({pushState: false}).then(() => {
            let reversed = router.reverse('test', {id: 1, name: 'hi'});

            expect(reversed).to.be.equal('/test/1/hi');
        });
    });
});
