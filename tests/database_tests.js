'use strict';
const chai = require('chai');
const DatabaseContext = require('../database');

let databaseContext;


describe('Database Context', function () {
    before(async function () {
        this.timeout(2000000);
        databaseContext = new DatabaseContext();
        await databaseContext.setup();
        this.mongodb = await databaseContext.get();
        await this.mongodb.db('test').collection('test_collection').insertOne({_id: 123, name: 'testName'});
    });

    after(async function () {
        await databaseContext.stop();
    });

    it('getClient', async function () {
        let mongodb = await databaseContext.get();
        chai.expect(mongodb).to.be.a('object');
        chai.expect(mongodb.constructor.name).to.equal('MongoClient');
    });

    it('findOne working', async function () {
        let db = this.mongodb.db('test');
        let data = await db.collection('test_collection').findOne({_id: 123});
        chai.expect(JSON.stringify(data)).to.equal(JSON.stringify({_id: 123, name: 'testName'}));
    });
});
