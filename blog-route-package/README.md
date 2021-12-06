# Route Package

Imagine this is a third-party package that provides some route modules to integrate in any remix app. Currently, library authors need to provide functions and components that the user has to include in route modules themselves. Not only is this more verbose, it makes the routing the responsibility of the app developer.

With build-time route modules, library authors can provide a function  to call inside remix.config.js. This function can register one or more route modules that can be nested inside each others. Much more convenient, and possible only because the app developer can give some options at build time (here : the repo and folder where to find the blog contents)