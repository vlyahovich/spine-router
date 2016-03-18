spine-router
========


```js
import {Router} from 'spine-router';

import {bundleLoader} from 'spine-router/src/middlewares/bundleLoader.js';
import {resourceLoader} from 'spine-router/src/middlewares/resourceLoader.js';
import {applicationLoader} from 'spine-router/src/middlewares/applicationLoader.js';
import {basicLayout} from 'spine-router/src/middlewares/basicLayout.js';
import {basicRender} from 'spine-router/src/middlewares/basicRender.js';

let router = new Router({
    routes: {
        'user[/:login]': 'user',
        'page:/:id': 'page',
        '': 'home'
    }
});
```

Routing system for SPA.
This router is based on `Backbone.Router` and works like wrapper on it.
Works great with `marionette.js`.

## How it works

You can extend router by adding middlewares to it similar to `connect`.
Each middleware will be consequentially executed according to labels.
Each middleware can be labeled (optionally). Labels can be as follows:

* When route is adding to router.
* When route is changing.
* When router caches error in any of middlewares above.

You can add function to chain as follows:

```js
var middlewareFactory = function () {
    return function (event) {
        // middleware logic, function will be called for ALL labels
    }
};

router.use(middlewareFactory);
```

If you need specific labels:

```js
var middlewareFactory = function () {
    return [{
        label: MATCHED_LABEL,
        handler: function (event) {
            // middleware logic, function will be called for MATCHED_LABEL only
        }
    }, {
        label: REGISTERED_LABEL,
        handler: function (event) {
            // middleware logic, function will be called for REGISTERED_LABEL only
        }
    }, {
        label: ERROR_LABEL,
        handler: function (event, errObj) {
            // middleware logic, function will be called for ERROR_LABEL only
        }
    }]
};

router.use(middlewareFactory);
```
Context of function is router instance itself. Middleware functions are not required to return anything. If
function returns value other than `false` or `Promise`, it will be ignored.

To break middleware chain you need to return rejected `Promise`.
In this case chain labeled as `ERROR_LABEL` will be executed with corresponding error.
If you need to break chain silently, you can return `false` as middleware result.

## Router event object

In each middleware you will receive event object. This object works as mediator between middlewares and can be extended.
It will be passed as first argument to middleware function.

Event object properties:

| Name                      | Description                                                                               |
|:------------------------- |:----------------------------------------------------------------------------------------- |
| `name`                    | Route name                                                                                |
| `label`                   | Event label, when middleware was called `"matched|registered|error"`                      |
| `route`                   | Route template `"test/:id/:name"`                                                         |
| `routeParams`             | Hash object with route properties                                                         |
| `routeParams.paramNames`  | Array with parameter names `["id", "name"]`. Will be available at route registration      |
| `routeParams.urlTemplate` | Route template (`"test/:id/:name"`). Will be available at route registration              |
| `routeParams.params`      | Hash with actual route parameters (parsed). Will be available at route match              |
| `bundles`                 | (optional) Loaded bundles. Result of work of `bundleLoader` middleware                    |
| `resources`               | (optional) Loaded resources. Result of work of `resourcesLoader` middleware               |
| `views`                   | (optional) Loaded view. Result of work of `basicLayout` middleware                        |

## Basic middlewares description

### routeParamsFactory (cannot be disabled, works as default)

This middleware is parsing route and extracts its params. After each route match params will be updated accordingly.
For example, for route template `test/:id/:name` and route `test/1/hi` params will be following:

```js
routeParams: {
    paramNames: ['id', 'name'],
    urlTemplate: 'test/:id/:name',
    params: {
        id: '1',
        name: 'hi'
    }
}
```

### reverseFactory (cannot be disabled, works as default)

Extends router adding to it methods:

* `reverse` reverses back router by specifying route name and its params
* `buildUrl` builds url by specifying url and query (will be encoded) `test?param=one`
* `buildQuery` builds query by specifying query hash object (will be encoded) `param=one`

### bundleLoader

Loads bundles, works with `Webpack`

```js
import {bundleLoader} from 'spine-router/src/middlewares/bundleLoader.js';

router.use(bundleLoader.factory({
    // BaseLayout, HomeLayout, etc. will be found in the folder `views`
    Layout: require.context('bundle!./views/', true, /Layout.js$/),
    
    // BaseApplication, HomeApplication, etc. will be found in the folder `application`
    Application: require.context('bundle!./applications/', true, /Application.js$/)
}));
```

For each route the following will be done:

1. Name will be transformed to CamelCase: `home -> Home, user:page -> UserPage`
2. To this name bundle prefix will be added: `Layout -> HomeLayout, UserPageLayout`
3. Search for file with the result name: `home -> ./views/home/HomeLayout.js, user:page -> ./views/user/page/or/some/another/long/path/UserPageLayout.js`
4. Load bundles
5. Bundles will be available at `event.bundles[resourceName]`

If bundle cannot be found, it will just be ignored without throwing an error

### resourceLoader

Loads resourses and puts it to `event.resources`. What and how to load can be described in `provider` property.
In this provider property should be defined functions that are returning ES6 promises.

```js
import {resourceLoader} from 'spine-router/src/middlewares/resourceLoader.js';

let resources = {

    /**
     * @returns {Promise<User>}
     */
    user(event) {
        return User.fetchCurrentUser();
    },
    
    /**
     * @returns {Promise<i18next>}
     */
    translate(event) {
        return translate.init();
    },
    
    homeApplication(event) {
        ...
    }

};

router.use(resourceLoader.factory({
    provider: resources,
    mappings: {
        // Loads for each route
        defaults: ['user', 'translate'], 
        
        // Only for route with name `home`
        home: {
            model: 'homeApplication' 
        },
        
        // You can pass array, returns hash {homeApplication: *}
        user: ['homeApplication']
        
    }
}));

```

### applicationLoader

Builds `application` through factory. Factory will be expected in `event.bundles[applicationBundle].factory`.
Result will be put in `event.resources[resourceKey]`. Factory will receive `event` object as first argument.

`bundleLoader` middleware required in order to work.

```js
import {applicationLoader} from 'spine-router/src/middlewares/applicationLoader.js';

router.use(applicationLoader);

// or

router.use(applicationLoader.factory({
    applicationBundle: 'Application', // default
    resourcesKey: 'model' // default
}));
```

### basicLayout

Creates `Layout` from `event.bundles[layoutBundle]` with parameters from `event.resources`. Puts result in `event.views[layoutName]`.

`bundleLoader` and `resourceLoader` or `applicationLoader` middlewares required in order to work.

```js
import {basicLayout} from 'spine-router/src/middlewares/basicLayout.js';

router.use(basicLayout);
// or
router.use(basicLayout.factory({
    layoutBundle: 'Layout',  // default
    layoutName: 'layout'  // default
}));
```

### basicRender

Inserts view to region

`basicLayout` middleware required in order to work.

```js
import {basicRender} from 'spine-router/src/middlewares/basicRender.js';

router.use(basicRender.factory({
    region: new Marionette.Region({el: '#content'}),
    layoutName: 'layout' // default
}));
```

### defaultErrorHandler

Caches errors and logs to console

```js
import {defaultErrorHandler} from 'spine-router/src/middlewares/defaultErrorHandler.js';

router.use(defaultErrorHandler);
```

### ES5 version

ES5 version (minified too) can be found at the folder `dist`.
Requires dependencies from `jquery`, `lodash`, `backbone`.
