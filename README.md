# Remix Experiment : Build-time route modules

## Motivation

Since I've discovered the remix.config.js `routes` function, I've had something in mind. A magical feature that would enable developers to provide packages made of remix route modules that you can integrate in any remix app very easily. You can see these packages as sub-apps. Examples include : 

 - A blog that you can integrate in any remix app
 - CRUD functionality for any relational database
 - A resource route that integrates tailwindcss in your app without a build step

You would do something like this in remix.config.js, where the `build*RouteModule` functions would return an object that describes the route module. That object would be customized for your use case with the provided options. 

```javascript
module.exports = {
    async routes(defineRoutes) {
        return defineRoutes(route => {
            route(blogRootPath, buildBlogLayoutRouteModule(blogOptions), () => {
                route(undefined, buildBlogIndexRouteModule(blogOptions), {index: true})
                route(":slug", buildBlogArticleRouteModule(blogOptions))
            });
        })
    }
};
```

Currently this is not really possible : 

 - Small problem : route modules have to be in your `app/` folder
 - Big problem (even if you solve the previous) : library authors can't know your app's unique parameters. There has to be something customizable, but route modules **have** to be files, there's no way around it. The remix compiler won't work with an object or anything else.

So, the next best thing is for library authors to give functions that you as the app developer are responsible to put in the right places (a loader, a default export, an action...). This is hard to document and error-prone.

This experiment aims to solve this by taking a different approach that what I originally imagined : **generating files**.

## Proposed API

With a little bit of esbuild magic, you can do this in remix.config.js : 

```javascript
module.exports = {
    async routes(defineRoutes) {
        return defineRoutes(route => {
            route("/any/path/you/:want", buildRouteModule("path/to/route-template.tsx", {foo: "bar"}))
        })
    }
}
```

and have this in the route-template.tsx file : 

```typescript jsx
import {json, Link, LoaderFunction, useLoaderData} from "remix";

// Almost normal route module

// buildTimeOptions will be replaced by what you gave in the remix config file 
// @ts-ignore
const { foo } = buildTimeOptions;

export async function loader() {
    return json({ data: foo }) 
}

export default function Component() {
    const { data } = useLoaderData();

    return (
        <p>{data} and {foo} are the same thing</p>
    )
}
```

and it should work.

## Benefits

### Multiple routes with almost the same code

Currently, if you want similar behaviours at different urls you have two solutions : 

 - Extract the common logic in functions and components and wire them in different route modules (that limits what you can extract and it's a little verbose)
 - Have a single route module that match several urls (but you're restricted on what URLs you use, and the logic to infer options based on the url can get complicated)

What I propose gives a third option that I think is better in some cases

 - Make a generic route module and apply it several times to different paths in remix.config.js 
```javascript
module.exports = {
    async routes(defineRoutes) {
        return defineRoutes(route => {
            route("/any/path/you/:want", buildRouteModule("path/to/route-template.tsx", {foo: "bar"}))
            route("/completely/different/path", buildRouteModule("path/to/route-template.tsx", {foo: "kung"}))
        })
    }
}
```

### Library author

This is the really good benefit in my opinion. 

Take a look at the `blog-route-package` folder and imagine it's a package published on npm. In any remix app, you can add this package to your dependencies and write this (in fact, this is the demo implemented in this repository) : 

```javascript
// remix.config.js

const {registerBlog} = require("blog-route-package/register");

module.exports = {
    async routes(defineRoutes) {
        return defineRoutes(route => {
            registerBlog(route, "/blog", {
                repo: "BenoitAverty/remix-test-build-time-route-modules",
                contentFolder: "blog",
                blogTitle: "My generated blog"
            });
        })
    }
};
```

With just this one function call, I've added a blog to my remix app. It has several route modules but I didn't have to create a single file, I didn't have to look at the docs to know which functions to put in which loader or action. I just had to tell the package where my content is located.

I think this could be great to add Authentication, complex register/forgot password flows, behaviours that require multiple resource routes...

## Implementation

For the "routes package", take a look at the `blog-route-package` folder and imagine it's published on NPM.

The implementation of the `buildRouteModule` function is in `route-module-builder/moduleBuilder.js` file. I plan to publish this to npm, but to have a really good developer experience it need to be integrated to remix. That could make live-reload work when templates are changed, and also avoid the `app/.generated` folder that I need to make because remix only accepts route modules inside the app folder.
