import chai from 'chai';
import {expect} from 'chai';
import sinon from 'sinon';
import {middleware} from './middleware';

describe('Middleware runner', function () {
    beforeEach(function () {
        this.mw = middleware();
    });

    it('should run middlewares in order', function () {
        let mw1Spy = sinon.spy(),
            mw2Spy = sinon.spy();

        this.mw(mw1Spy);
        this.mw(mw2Spy);

        return this.mw.run().then(() => {
            expect(mw1Spy).to.have.been.calledBefore(mw2Spy);
        });
    });

    it('should catch on chain rejection', function () {
        let mw1Spy = sinon.spy(),
            mw3Spy = sinon.spy();

        this.mw(mw1Spy);
        this.mw(() => {
            return Promise.reject('error');
        });
        this.mw(mw3Spy);

        return this.mw.run().catch(() => {
            expect(mw1Spy).to.have.been.calledOnce;
            expect(mw3Spy).to.not.have.been.called;
        });
    });

    it('should hang up and run normally on chain cancellation (by returning false)', function () {
        let mw1Spy = sinon.spy(),
            mw3Spy = sinon.spy();

        this.mw(mw1Spy);
        this.mw(() => {
            return false;
        });
        this.mw(mw3Spy);

        return this.mw.run().then(() => {
            expect(mw1Spy).to.have.been.calledOnce;
            expect(mw3Spy).to.not.have.been.called;
        });
    });

    it('should be able to pass arbitrary args', function () {
        return this.mw.run({name:'evt'}).then((evt) => {
            expect(evt).to.be.eql({name:'evt'});
        });
    });

    it('should be able to run chains with label', function () {
        let mw1Spy = sinon.spy(),
            mw2Spy = sinon.spy(),
            mw3Spy = sinon.spy();

        this.mw('label', mw1Spy);
        this.mw('error', mw2Spy);
        this.mw('label', mw3Spy);

        return this.mw.run('label').then(() => {
            expect(mw1Spy).to.have.been.calledOnce;
            expect(mw2Spy).to.not.have.been.called;
            expect(mw3Spy).to.have.been.calledOnce;
        });
    });

    it('should run chain functions without label for all labels', function () {
        let mw1Spy = sinon.spy(),
            mw2Spy = sinon.spy(),
            mw3Spy = sinon.spy();

        this.mw('label', mw1Spy);
        this.mw(mw2Spy);
        this.mw('label', mw3Spy);

        return Promise.all([this.mw.run('label'), this.mw.run('label1')]).then(() => {
            expect(mw1Spy).to.have.been.calledOnce;
            expect(mw2Spy).to.have.been.calledTwice;
            expect(mw3Spy).to.have.been.calledOnce;
        });
    });
});
