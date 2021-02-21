'use strict';
const chai = require('chai');

const StitchContext = require('../realm-context');

describe('Realm Context', async function () {

    it('check all default contexts', async function () {
        chai.expect(this.context).to.be.an('object');
        chai.expect(this.context.constructor.name).to.equal('RealmContext');
        chai.expect(this.context).to.have.property('services');
        chai.expect(this.context).to.have.property('values');
        chai.expect(this.context).to.have.property('users');
        chai.expect(this.context).to.have.property('request');
        chai.expect(this.context).to.have.property('functions');
        chai.expect(this.context).to.have.property('http');
    });

    it('check all services are loaded', function () {
        chai.expect(Object.keys(this.context.services.services).length).to.equal(1);
    });

    it('check all functions are loaded', function () {
        chai.expect(Object.keys(this.context.functions.functions).length).to.equal(1);
    });

    it('check all values are loaded', function () {
        chai.expect(Object.keys(this.context.values).length).to.equal(1);
    });

    it('check all auth_providers are loaded', function () {
        chai.expect(Object.keys(this.context.auth_providers).length).to.equal(1);
    });

    beforeEach(async function () {
        this.context = new StitchContext("./tests/TestProject/");
        await this.context.init();
    });

    afterEach(async function () {
        await this.context.stop();
    });
});
