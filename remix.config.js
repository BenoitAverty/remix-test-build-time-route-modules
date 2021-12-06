const {registerBlog} = require("./blog-route-package/register");

/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
    appDirectory: "app",
    browserBuildDirectory: "public/build",
    publicPath: "/build/",
    serverBuildDirectory: "build",
    devServerPort: 8002,
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
