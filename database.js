'use strict';
let {MongoMemoryServer} = require('mongodb-memory-server');
const MongoClient = require('mongodb').MongoClient;

let mongoServer;


async function initiateDatabase () {
    mongoServer = new MongoMemoryServer();
    return await mongoServer.getUri();

}

module.exports = class Database {
    constructor () {
        this.databaseClient = null;
        this.databaseUri = null;
    }

    async setup () {
        this.databaseUri = await initiateDatabase();
        this.databaseClient = await new MongoClient.connect(this.databaseUri,{ useUnifiedTopology: true });
    }

     get () {
        return this.databaseClient;
     }

    async stop () {
        await this.databaseClient.close();
        await mongoServer.stop();
    }
};
