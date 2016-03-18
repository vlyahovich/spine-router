import {ERROR_LABEL} from '../router.js';

let defaultErrorHandler = () => {
    return [{
        label: ERROR_LABEL,
        handler: (event, error) => {
            setTimeout(function () {
                throw error;
            });
        }
    }];
};

export {defaultErrorHandler};
