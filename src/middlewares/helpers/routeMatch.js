import {ERROR_LABEL} from '../../router.js';

let routeMatch = function (router, route) {
    return new Promise((resolve, reject) => {
        router.use(function () {
            return [{
                label: ERROR_LABEL,
                handler: function (event, error) {
                    reject(error);
                }
            }];
        });
        router.on('route:matched', resolve);
        Backbone.history.navigate(route, {trigger: true});
    })
};

export {routeMatch};
