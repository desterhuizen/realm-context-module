'use strict';
/**
 * Internal modules
 */
const Services = require('./services.js');

/***
 * Class used for contexts as stitch contexts. This can be used for testing
 * stitch functions locally.
 * @type {StitchContext}
 */
module.exports = class StitchContext {
    /**
     * Initialise base contexts
     */
    constructor() {
        this.services = new Services();
        this.values = {};
        this.users = {};
        this.request = {};
        this.functions = {};
        this.http = {};
    }

    /**
     * Stop the contexts that are currently running.
     * @returns {Promise<void>}
     */
    async stop() {
        await this.services.stop();
    }
};
