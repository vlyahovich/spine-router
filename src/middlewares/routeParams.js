import {MATCHED_LABEL, REGISTERED_LABEL} from '../routerConst';

var extractParamNames = function (event) {
        var matchParams = event.route.match(/:[a-z]+/ig) || [];

        return matchParams.map(function (arg) {
            return arg.slice(1);
        });
    },
    convertRouteToUrlTemplate = function (event) {
        return event.route.replace(/[\(\)]/g, '');
    },
    createRouteParams = function (event, routeArguments) {
        var routeParams = {};

        event.routeParams.paramNames.forEach(function (name, index) {
            routeParams[name] = routeArguments[index];
        });

        return routeParams;
    },
    routeParamsRegister = function (event) {
        event.routeParams = {
            paramNames: extractParamNames(event),
            urlTemplate: convertRouteToUrlTemplate(event)
        };

        return this;
    },
    routeParamsMatch = function (event) {
        event.routeParams.params = createRouteParams(event, event.args);

        return this;
    },
    routeParamsFactory = function () {
        return [{
            label: REGISTERED_LABEL,
            handler: routeParamsRegister
        }, {
            label: MATCHED_LABEL,
            handler: routeParamsMatch
        }];
    };

export {routeParamsFactory};
