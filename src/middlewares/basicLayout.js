import {MATCHED_LABEL} from '../routerConst';

let basicLayout = () => {
    return basicLayout.factory()();
};

basicLayout.factory = ({layoutBundle, layoutName} = {layoutBundle: 'Layout', layoutName: 'layout'}) => {
    return () => {
        return [{
            label: MATCHED_LABEL,
            handler: (event) => {
                if (!event.bundles) {
                    throw new Error('Use bundleLoader or staticBundleLoader to load bundles, before basicLayout usage');
                }

                let Layout = event.bundles[layoutBundle];

                if (!Layout) {
                    throw new Error('Layout not found');
                }

                if (!event.views) {
                    event.views = {};
                }

                if (Layout.factory) {
                    return Promise.resolve(Layout.factory(event)).then(layout => event.views[layoutName] = layout);
                }

                event.views[layoutName] = new Layout(event.resources);
            }
        }];
    };
};

export {basicLayout};
