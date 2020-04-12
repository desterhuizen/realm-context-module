'use strict';
const chai = require ('chai');
const sinon = require('sinon');

const StitchContext = require('../stitch-context');

describe ('Stitch Context', function() {
    const sandbox = sinon.createSandbox();

    it ('check all default contexts', function(){
        const context = new StitchContext();
        chai.expect(context).to.be.an('object');
        chai.expect(context.constructor.name).to.equal('StitchContext');
        chai.expect(context).to.have.property('services');
        chai.expect(context).to.have.property('values');
        chai.expect(context).to.have.property('users');
        chai.expect(context).to.have.property('request');
        chai.expect(context).to.have.property('functions');
        chai.expect(context).to.have.property('http');
        context.stop();
    });

    beforeEach(function() {
        this.context = new StitchContext();
        sandbox.spy(this.context, "stop");
    });

    afterEach(function() {
        sandbox.restore();
    });

    it ('stop all open contexts', async function (){
        this.context.stop();
        chai.expect(this.context.stop.calledOnce).to.equal(true);
    })
});
