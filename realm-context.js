'use strict';

/**
 * Internal modules
 */
const fs = require('fs');
const path = require('path');

const Services = require('./services.js');
const Functions = require('./functions.js');

/***
 * Class used for contexts as realm contexts. This can be used for testing
 * realm functions locally.
 * @type {RealmContext}
 */
module.exports = class RealmContext {
    /**
     * Initialise base contexts
     */
    constructor( pathToRealmProject ) {
        this.pathToRealmProject = pathToRealmProject;
        this.services = new Services();
        this.functions = new Functions();
        this.values = {};
        this.users = {};
        this.request = {};

        this.http = {};
        this.auth_providers = {};
    }

    async init() {
        let functionPaths = "";
        if (fs.existsSync(path.resolve(this.pathToRealmProject + "/functions"))) {
            functionPaths = fs.readdirSync(path.resolve(this.pathToRealmProject + "/functions"));
        }

        let servicesPaths = "";
        if (fs.existsSync(path.resolve(this.pathToRealmProject + "/services"))) {
            servicesPaths = fs.readdirSync(path.resolve(this.pathToRealmProject + "/services"));
        }

        let valuesPaths = "";
        if (fs.existsSync(path.resolve(this.pathToRealmProject + "/values"))) {
            valuesPaths = fs.readdirSync(path.resolve(this.pathToRealmProject + "/values"));
        }

        let authProvidersPaths = "";
        if (fs.existsSync(path.resolve(this.pathToRealmProject + "/auth_providers"))) {
            authProvidersPaths = fs.readdirSync(path.resolve(this.pathToRealmProject + "/auth_providers"));
        }

        if (functionPaths.length > 0) {
            this.loadFunctions(functionPaths, this.pathToRealmProject);
        }
        if (valuesPaths.length > 0) {
            this.values = this.loadValues(valuesPaths, this.pathToRealmProject);
        }
        if (servicesPaths.length > 0) {
            this.services = await this.loadServices(servicesPaths, this.pathToRealmProject);
        }
        if (authProvidersPaths.length) {
            this.auth_providers = this.loadAuthProviders(authProvidersPaths, this.pathToRealmProject);
        }
    }

    /**
     * Load functions from the Realm Project
     * @param functionPaths
     * @param pathToRealmProject
     */
    loadFunctions(functionPaths, pathToRealmProject) {
        let functions = this.functions;
        functionPaths.forEach(function (functionPath) {
            let functionConfig = require(path.resolve(pathToRealmProject + "/functions/" + functionPath + "/config.json"));
            functions.registerFunction( functionConfig['name'], pathToRealmProject + "/functions/" + functionPath + "/source.js");
        });
    }

    /**
     * Load Values from the Realm Project
     * @param valuePaths
     * @param pathToRealmProject
     */
    loadValues(valuePaths, pathToRealmProject) {
        let values = {};
        valuePaths.forEach(function (valuePaths) {
            values[valuePaths] = require(path.resolve(pathToRealmProject + "/values/" + valuePaths));
        });
        return values;
    }
    /**
     * Load Auth Providers from the Realm Project
     * @param authProviderPaths
     * @param pathToRealmProject
     */
    loadAuthProviders(authProviderPaths, pathToRealmProject) {
        let authProviders = this.auth_providers;
        authProviderPaths.forEach(function (loadAuthsPaths) {
            authProviders[loadAuthsPaths] = require(path.resolve(pathToRealmProject + "/auth_providers/" + loadAuthsPaths));
        });
        return authProviders;
    }

    /**
     * Load Services from the Realm Project
     * @param servicePaths
     * @param pathToRealmProject
     */
    async loadServices(servicePaths, pathToRealmProject) {
        let services = new Services();
        for (const index of Object.keys(servicePaths)) {
            let service = require(path.resolve(pathToRealmProject + "/services/" + servicePaths[index] + "/config.json"));
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
