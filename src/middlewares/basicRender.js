import {MATCHED_LABEL} from '../router.js';

let basicRender = function () {
    return basicRender.factory()();
};

basicRender.factory = ({region, layoutName = 'layout'} = {}) => {
    return () => {
        return [{
            label: MATCHED_LABEL,
            handler: (event) => {
                if (!event.views) {
                    throw new Error('Use basicLayout or similar middleware to load layout');
                }

                let layout = event.views[layoutName];
                if (!layout) {
                    throw new Error('Cannot find layout "' + layoutName + '"');
                }

                region.show(layout);
            }
        }];
    };
};

export {basicRender};
