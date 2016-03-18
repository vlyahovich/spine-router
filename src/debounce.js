import _ from 'lodash';

let pending = null,
    next = null,
    clear = function clear(arg) {
        pending = null;
        return arg;
    };

/**
 * Debounce mechanics based on Promise.
 *
 * debounce(function() {
 *     return new Promise((resolve, reject) => {
 *         setTimeout(resolve, 2000);
 *     });
 * }); // first
 *
 * debounce(function() {...}); // next1
 * debounce(function() {...}); // next2
 * debounce(function() {...}); // next3
 *
 * Will be executed in order (assuming next1, next2, next3 added immediately):
 * first then next3 (next1 and next2 will be unresolved Promise)
 *
 * @param {Function} fn
 * @param {Array} args
 * @return {*}
 */
function debounce(fn, ...args) {
    if (pending) {
        next = fn;

        // create new buffer Promise and wait for pending to resolve
        return new Promise((resolve, reject) => {
            let resolveNext = function resolveNext() {
                // if only next is the last function then we execute it,
                // otherwise it will be unresolved
                if (next === fn) {
                    pending = next(...args);

                    // do clear first to prevent pending to stay for next iterations
                    pending.then(_.compose(resolve, clear), _.compose(reject, clear));
                }
            };

            if (pending) {
                pending.then(resolveNext, resolveNext);
            } else {
                resolveNext();
            }
        });
    }

    pending = fn(...args);

    pending.then(clear, clear);

    return pending;
}

export {debounce};
