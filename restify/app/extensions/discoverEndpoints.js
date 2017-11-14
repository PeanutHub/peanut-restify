const ExtensionBase = require('./../ExtensionBase');
const fs = require('fs');
const path = require('path');
const lodash = require('lodash');
const restifyRouter = require('restify-router');
const mongoose = require('mongoose');

/**
 * Add Custom Formatters For content-types
 * @class DiscoverEndpointsExtension
 * @extends {ExtensionBase}
 */
class DiscoverEndpointsExtension extends ExtensionBase {

  /**
   * Creates an instance of ExtensionBase.
   * @param {any} app Application instance
   * @param {any} server Server instance
   * @param {Object} settings Configured Setting in the boot step
   * @param {String} serverPath server.js path (for context)
   * @memberof ExtensionBase
   */
  constructor(app, server, settings, serverPath) {
    super(app, server, settings, serverPath);
    this.discoveredModels = [];
  }

  /**
   * Discover Endpoints: Get all folders inside the endpoints path and
   * get the routes.json for configuration, if not present skip the auto-config for 
   * the specific folder, and go on the next folder an repeat process
   * @memberof Boot
   */
  discoverEndpoints() {
    // Get all endpoints folders
    const path = this.settings.endpointsPath;
    const endpoints = this.getPaths(path);
    this.info(`* Discovering Endpoints...(${endpoints.length} founds)`);

    endpoints
      .forEach((endpoint) => {
        this.configureEndpoint(path, endpoint);
      });
  }


  /**
   * From the routes.json configure and load all routes of the endpoint
   * folder
   * @param {String} entryPoint Path of the entry point for the endpoint
   * @param {String} endpoint Endpoint name
   * @memberof Boot
   */
  configureEndpoint(entryPoint, endpoint, parentConfig) {
    const parentEndpoint = (parentConfig ? parentConfig.name + " -> " : "");
    const fullPath = path.join(entryPoint, endpoint);
    const paths = {
      config: `${fullPath}/routes.json`, // Configuration File
      routes: `${fullPath}/routes`, // Routes Path
      models: `${fullPath}/models` // Models to Load
    };

    this.info('');
    this.info(`  - Configuring: [${parentEndpoint}${endpoint}] from routes.json`);

    var defaultConfiguration = require('./../../defaults/routes-config.json');
    defaultConfiguration.name = endpoint; // Set default name to endpoint
    defaultConfiguration.routes.path.prefix = `/${endpoint}`; // Set the default prefix to endpoint!

    if (fs.existsSync(paths.config)) {

      // Get routes.json and all routes to Load
      var routesToLoad = this.getFiles(paths.routes);
      var config = lodash.defaultsDeep(require(paths.config), defaultConfiguration);
      var routePrefix = config.routes.path.prefix;

      // If has parent route config, add the prefix to route!
      if (parentConfig && parentConfig.routes.path.prefix) {
        routePrefix = parentConfig.routes.path.prefix + routePrefix;
      }

      // Configuring the endpoint in the server
      var router = new restifyRouter.Router();
      routesToLoad.forEach((routePath) => {
        try {
          var route = require(`${paths.routes}/${routePath}`);
          route(router, routePrefix);
        } catch (ex) {
          this.debug(`Failed to load route ${routePath} from ${endpoint} endpoint.`)
          throw ex;
        }
      });

      // Add Public routes to server
      Object.keys(router.routes).forEach((methodName) => {
        // Get list of handlers per method's
        const method = router.routes[methodName];

        // For each handler
        method.forEach((route) => {
          // Check for the specific route configuration
          var options = Object.assign({}, route.options);
          var fullUri = `${routePrefix}${options.path}`;
          var tags = [];

          // If the route is public, add to whitelist!
          if (options.public && this.app.addToWhiteList) {
            // Add to whitelist if the extension exists!
            this.app.addToWhiteList({
              method: methodName,
              route: fullUri
            });
            tags.push('public');
          }

          // Show some info...
          const tagLine = tags.length > 0 ? `[${tags.join(',')}]` : '';
          this.info(`     Registering ${methodName.toUpperCase()} at uri ${fullUri} ${tagLine}`);
        });
      });

      // Load all the routes to the server
      router.applyRoutes(this.app.getServer(), routePrefix);

      // Add models to list of models to Load later!
      if (fs.existsSync(paths.models)) {
        this.getFiles(paths.models).forEach((modelName) => {
          this.discoveredModels.push({
            name: modelName.replace(/.js/, ''),
            path: path.join(paths.models, modelName)
          });
        });
      }

      // Iteration over includes routes
      if (config.routes.include.length > 0) {

        let includedPaths = config.routes.include;
        const includeFullPath = path.join(entryPoint, endpoint);
        // Include all??
        if (config.routes.include.length == 1 && config.routes.include[0] === "*") {
          // * = Special key to say "every folder in the path!"
          includedPaths = this.getPaths(includeFullPath);
        }

        // Iterate each include folder
        includedPaths.forEach((includeEndpointPath) => {
          this.configureEndpoint(includeFullPath, includeEndpointPath, config);
        });

      }

    } else {
      // Skip the auto-configuration
      defaultConfiguration.auto_config = false;
      this.info(`     routes.json not found in [${endpoint}].. skipping for configuration step`);
    }

  }

  /**
   * Configure models finded in the endpoints!
   * @memberof Boot
   */
  discoverModels() {
    // Get all endpoints folders
    const models = this.discoveredModels;
    this.info(`* Discovering Models...(${models.length} founds)`);

    // Get Model Extensions
    const fullPath = `${__dirname}/../../models/extensions`;
    const extensionsPaths = this.getFiles(fullPath);
    const extensionToAttach = [];
    this.info('');

    // Register Model Extensions!
    for (var index in extensionsPaths) {
      const name = extensionsPaths[index];
      try {
        // Get the extension class
        let ExtensionClass = require(path.join(fullPath, name));
        if (typeof ExtensionClass !== 'function' && typeof ExtensionClass.extension == 'function') {
          // Extended Object 
          ExtensionClass = ExtensionClass.extension;
        }

        // Create an instance Method
        const extension = new ExtensionClass(this.app, this.settings);

        // Extend by Name
        const extensionName = name.replace(/.js/, '');

        this.info(`  - Model Extension [${extensionName}] loaded`);
        extensionToAttach.push({
          name: extensionName,
          fnc: extension.execute
        });

      } catch (ex) {
        this.debug(`Failed to load model extension ${name}.`)
        throw ex;
      }
    }

    // At last!, load models and add all extension!
    this.info(' ');
    this.discoveredModels.forEach((model) => {
      this.configureModel(model, extensionToAttach);
    });

    delete this.discoveredModels;
  }

  /**
   * Load Model to backbone, and attach all model extension to each Mongoose Model
   * @param {any} model Model to load and attach all extensions
   * @param {Array} extensionsToAttach Extensions to attach
   * @memberof Boot
   */
  configureModel(model, extensionsToAttach) {
    // First: Configure
    try {
      const SchemaClass = require(`${model.path}`);
      extensionsToAttach.forEach((extensionToAttach) => {
        // Not arrow to inject "this" instance
        SchemaClass.method(extensionToAttach.name, function (cfg) {
          cfg = (cfg || {});
          return extensionToAttach.fnc(cfg, this);
        });
      });

      const mongooseModel = mongoose.model(model.name, SchemaClass);

      // Attach model to app.models[modelName]
      this.app.models[model.name] = mongooseModel;

      this.info(`  - Model [${model.name}] loaded in Application models`);

    } catch (ex) {
      this.debug(`Failed to load model ${model.name} from ${model.path}.`)
      throw ex;
    }
  };


  /**
   * Discover endpoints and his models and register into the controllers restify registry
   * @param {any} config Configuration Settings
   * @memberof DiscoverEndpointsExtension
   */
  execute(config) {
    this.discoverEndpoints();
    this.info('');
    this.discoverModels();
    this.info('');
  };

}

module.exports = DiscoverEndpointsExtension;
