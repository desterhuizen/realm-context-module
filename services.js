'use strict';
const DatabaseContext = require('./database');

module.exports = class Services {
    constructor () {
        this.services = {};
    }

    async addDatabaseContext (serviceName) {
        this.services[serviceName] = new DatabaseContext();
        await this.services[serviceName].setup();
    }

    get (serviceName) {
        return this.services[serviceName].get();
    };

    async stop() {
        for (const service of Object.keys(this.services)) {
            await this.services[service].stop();
        }
    }
};
