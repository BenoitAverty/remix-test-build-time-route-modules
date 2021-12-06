const { buildSync } = require("esbuild");

/**
 * This is the function that can generate a route module based on a "template" (which is just a javascript 
 * file with missing pieces) and some options that can be injected at build time.
 * 
 * Build-time options need to be serializable (as in JSON.stringify) since ultimately a file has to be generated 
 * and fed to the remix compiler.
 * 
 * This could be an npm package, but to make it the most useful I think it should be integrated into remix. That 
 * way it could work with live-reload, and it would not pollute your app folder with generated files. 
 */
exports.buildRouteModule = function(definitionsFile, options) {

    const generatedFileName = `.generated/${definitionsFile}`;
    
    buildSync({
        entryPoints: [definitionsFile],
        define: {
            buildTimeOptions: JSON.stringify(options)
        },
        outfile: `app/${generatedFileName}`,
        jsx: "preserve"
    })
    
    return generatedFileName;
}