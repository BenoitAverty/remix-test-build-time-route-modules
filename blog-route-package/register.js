const {buildRouteModule} = require("../route-module-builder/moduleBuilder");

exports.registerBlog = function(route, blogRootPath, blogOptions) {
    route(blogRootPath, buildRouteModule("blog-route-package/blogLayoutRouteModuleTemplate.jsx", blogOptions), () => {
        route(undefined, buildRouteModule("blog-route-package/blogIndexRouteModuleTemplate.tsx", blogOptions), {index: true})
        route(":slug", buildRouteModule("blog-route-package/blogArticleRouteModuleTemplate.jsx", blogOptions))
    });
}