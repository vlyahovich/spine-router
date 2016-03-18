import {MATCHED_LABEL} from '../router.js';
import _ from 'lodash';

let applicationLoader = () => {
    return applicationLoader.factory()();
};

applicationLoader.factory = ({applicationBundle, resourcesKey} = {
    applicationBundle: 'Application',
    resourcesKey: 'model'
}) => {
    return () => {
        return [{
            label: MATCHED_LABEL,
            handler: (event) => {
                if (!event.bundles) {
                    throw new Error('Use bundleLoader or staticBundleLoader to load bundles');
                }

                let Application = event.bundles[applicationBundle];

                if (Application) {
                    if (!Application.factory) {
                        throw new Error('Application must have factory method');
                    }

                    if (!event.resources) {
                        event.resources = {};
                    }

                    return Promise.resolve(Application.factory(event))
                        .then(application => event.resources[resourcesKey] = application);
                }
            }
        }];
    }
};

export {applicationLoader};
