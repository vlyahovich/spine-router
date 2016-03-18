import chai from 'chai';
import {expect} from 'chai';
import sinon from 'sinon';
import Backbone from 'backbone';

import {Router, MATCHED_LABEL, REGISTERED_LABEL, ERROR_LABEL} from './router';

describe('Router', function () {
    beforeEach(function () {
        this.router = new Router({
            routes: {
                '': 'home',
                'test': 'test'
            }
        });
    });

    afterEach(function () {
        this.router.stop();

        window.location.hash = '';
    });

    it('should go between pages as Backbone.Router', function () {
        return this.router.start({pushState: false}).then(() => {
            Backbone.history.navigate('test', {trigger: true});

            expect(window.location.hash).to.be.equal('#test');
        });
    });

    it('should be able to add middlewares', function () {
        let mwSpy = sinon.spy();

        this.router.use(mwSpy);

        return this.router.start({pushState: false}).then(() => {
            expect(mwSpy).to.have.been.called;
        });
    });

    it('should pass route event object', function () {
        let evt = null;

        this.router.use(function () {
            return [{
                label: REGISTERED_LABEL,
                handler: function (event) {
                    evt = event;
                }
            }];
        });

        return this.router.start({pushState: false}).then(() => {
            expect(evt).to.be.an('object');
        });
    });

    it('should pass route event object with basic route info', function () {
        let evt = null;

        this.router.use(function () {
            return [{
                label: REGISTERED_LABEL,
                handler: function (event) {
                    evt = event;
                }
            }];
        });

        return this.router.start({pushState: false}).then(() => {
            expect(evt.route).to.be.equal('');
            expect(evt.name).to.be.equal('home');
        });
    });

    it('should pass same route event to middlewares in chain', function () {
        let mwSpy = sinon.spy(),
            evt = null;

        this.router.use(function () {
            return [{
                label: REGISTERED_LABEL,
                handler: function (event) {
                    evt = event;
                }
            }];
        });

        this.router.use(function () {
            return [{
                label: REGISTERED_LABEL,
                handler: mwSpy
            }];
        });

        return this.router.start({pushState: false}).then(() => {
            expect(mwSpy).to.have.been.calledWith(evt);
        });
    });

    it('should launch route registration chain', function () {
        let mwSpy = sinon.spy();

        this.router.use(function () {
            return [{
                label: REGISTERED_LABEL,
                handler: mwSpy
            }];
        });

        return this.router.start({pushState: false}).then(() => {
            expect(mwSpy).to.have.been.calledTwice;
        });
    });

    it('should launch route match chain', function (done) {
        let mwSpy = sinon.spy();

        this.router.on('route:matched', function () {
            expect(mwSpy).to.have.been.calledOnce;

            done();
        });

        this.router.use(function () {
            return [{
                label: MATCHED_LABEL,
                handler: mwSpy
            }];
        });

        this.router.start({pushState: false});
    });

    it('should pass fragment', function (done) {
        let mwSpy = sinon.spy();

        this.router.on('route:matched', function (event) {
            expect(event.fragment).to.equal('test');
            done();
        });

        this.router.use(function () {
            return [{
                label: MATCHED_LABEL,
                handler: mwSpy
            }];
        });

        window.location.hash = 'test';
        this.router.start({pushState: false});
    });

    it('should be able to notify error chain on rejection', function () {
        let mwSpy = sinon.spy();

        this.router.use(function () {
            return [{
                label: REGISTERED_LABEL,
                handler: function (event) {
                    if (event.name === 'home') {
                        return Promise.reject('error on home registration');
                    }
                }
            }, {
                label: ERROR_LABEL,
                handler: mwSpy
            }];
        });

        return this.router.start({pushState: false}).then(() => {
            expect(mwSpy).to.have.been.calledOnce;
            expect(mwSpy).to.have.been.calledWithMatch({}, 'error on home registration');
        });
    });
});
