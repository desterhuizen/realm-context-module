'use strict';
/**
 * Internal modules
 */
const Services = require('./services.js');
const Functions = require('./functions.js');
const path = require('path');
const fs = require('fs');

/***
 * Class used for contexts as stitch contexts. This can be used for testing
 * stitch functions locally.
 * @type {StitchContext}
 */
module.exports = class StitchContext {
    /**
     * Initialise base contexts
     */
    constructor( pathToStitchProject ) {
        this.pathToStitchProject = pathToStitchProject;
        this.services = new Services();
        this.functions = new Functions();
        this.values = {};
        this.users = {};
        this.request = {};

        this.http = {};
        this.auth_providers = {};
    }

    async init() {
        let functionPaths = fs.readdirSync(path.resolve(this.pathToStitchProject + "/functions"));
        let servicesPaths = fs.readdirSync(path.resolve(this.pathToStitchProject + "/services"));
        let valuesPaths = fs.readdirSync(path.resolve(this.pathToStitchProject + "/values"));
        let authProvidersPaths = fs.readdirSync(path.resolve(this.pathToStitchProject + "/auth_providers"));

        if (functionPaths.length > 0) {
            this.loadFunctions(functionPaths, this.pathToStitchProject);
        }
        if (valuesPaths.length > 0) {
            this.values = this.loadValues(valuesPaths, this.pathToStitchProject);
        }
        if (servicesPaths.length > 0) {
            this.services = await this.loadServices(servicesPaths, this.pathToStitchProject);
        }
        if (authProvidersPaths.length) {
            this.auth_providers = this.loadAuthProviders(authProvidersPaths, this.pathToStitchProject);
        }
    }

    /**
     * Load functions from the Stitch Project
     * @param functionPaths
     * @param pathToStitchProject
     */
    loadFunctions(functionPaths, pathToStitchProject) {
        let functions = this.functions;
        functionPaths.forEach(function (functionPath) {
            let functionConfig = require(path.resolve(pathToStitchProject + "/functions/" + functionPath + "/config.json"));
            functions.registerFunction( functionConfig['name'], pathToStitchProject + "/functions/" + functionPath + "/source.js");
        });
    }

    /**
     * Load Values from the Stitch Project
     * @param valuePaths
     * @param pathToStitchProject
     */
    loadValues(valuePaths, pathToStitchProject) {
        let values = {};
        valuePaths.forEach(function (valuePaths) {
            values[valuePaths] = require(path.resolve(pathToStitchProject + "/values/" + valuePaths));
        });
        return values;
    }
    /**
     * Load Auth Providers from the Stitch Project
     * @param authProviderPaths
     * @param pathToStitchProject
     */
    loadAuthProviders(authProviderPaths, pathToStitchProject) {
        let authProviders = this.auth_providers;
        authProviderPaths.forEach(function (loadAuthsPaths) {
            authProviders[loadAuthsPaths] = require(path.resolve(pathToStitchProject + "/auth_providers/" + loadAuthsPaths));
        });
        return authProviders;
    }

    /**
     * Load Services from the Stitch Project
     * @param servicePaths
     * @param pathToStitchProject
     */
    async loadServices(servicePaths, pathToStitchProject) {
        let services = new Services();
        for (const index of Object.keys(servicePaths)) {
            let service = require(path.resolve(pathToStitchProject + "/services/" + servicePaths[index] + "/config.json"));
            if (service.type === 'mongodb-atlas'){
                await services.addDatabaseContext(service.name);
            }
        }
        return services;
    }

    /**
     * Stop the contexts that are currently running.
     * @returns {Promise<void>}
     */
    async stop() {
        await this.services.stop();
    }
};
