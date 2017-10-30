const ExtensionBase = require('./../ExtensionBase');
const swagger = require('restify-swagger-jsdoc');

/**
 * Add Swagger explorer to API
 * 
 * @class AddSwaggerDocsExtension
 * @extends {ExtensionBase}
 */
class AddSwaggerDocsExtension extends ExtensionBase {

  /**
   * Activate the swagger UI
   * @param {any} config Configuration Settings
   * @returns 
   * @memberof AddSwaggerDocsExtension
   */
  execute(config) {
    //Get package.json
    var packageJSON = require(`${this.serverPath}/../package.json`);
    var config = {
      title: `${packageJSON.description} (${this.settings.env})`, // Page title (required) 
      version: packageJSON.version, // Server version (required) 
      server: this.server, // Restify server instance created with restify.createServer() 
      path: '/docs/swagger', // Public url where the swagger page will be available 
      apis: [`${this.settings.endpointsPath}/**/*.js`], // Path to the API docs 
      forceSecure: (this.settings.env == "DEV" ? false : true) // force swagger-ui to use https protocol to load JSON file (optional, default: false) 
    };
    //https://github.com/Surnet/swagger-jsdoc/blob/master/docs/GETTING-STARTED.md
    swagger.createSwaggerPage(config);

    // Register Manifiest Extension , maybe for later use
    this.registerUse("swagger-docs", config);

    return config;
  };

}

module.exports = AddSwaggerDocsExtension;
