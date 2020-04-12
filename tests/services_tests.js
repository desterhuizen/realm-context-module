'use strict';

const ServiceContext = require('../services');
const chai = require('chai');

let serviceContext = null;

before( async function (){
    serviceContext = new ServiceContext();
    await serviceContext.addDatabaseContext('mongodb-atlas');
});

after ( async function (){
    await serviceContext.stop();
});

describe ('Services Context', function () {
    it('add mongodb database service', async function (){
        let mongodb = await serviceContext.get('mongodb-atlas');
        let testCollection = mongodb.db('test').collection('test');
        await testCollection.insertOne({_id: 1234});
        let data = await testCollection.findOne({_id: 1234});
        chai.expect(JSON.stringify(data)).to.equal(JSON.stringify({_id: 1234}));
    });
});
