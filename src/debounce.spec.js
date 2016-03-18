import chai from 'chai';
import {expect} from 'chai';
import sinon from 'sinon';
import {debounce} from './debounce';

describe('Debounce', function () {
    beforeEach(function () {
        this.getFn = function (resolution) {
            return function () {
                return new Promise((resolve, reject) => {
                    setTimeout(function () {
                        resolve(resolution);
                    }, 50);
                });
            }
        };
    });

    it('should execute function normally', function () {
        return expect(debounce(this.getFn('done'))).to.eventually.be.equal('done');
    });

    it('should call first and last if called more than 2 times', function () {
        let fn1 = this.getFn('done 1'),
            fn2 = this.getFn('done 2'),
            fn3 = this.getFn('done 3'),
            fn1Then = sinon.spy(),
            fn2Then = sinon.spy();

        debounce(fn1).then(fn1Then);
        debounce(fn2).then(fn2Then);

        return debounce(fn3)
            .then(() => {
                expect(fn1Then).to.have.been.called;
                expect(fn2Then).to.not.have.been.called;
            });
    });
});
