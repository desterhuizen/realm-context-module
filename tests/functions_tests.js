'use strict';
const FunctionsContext = require('../functions');
const sinon = require('sinon');
const chai = require('chai');

describe('Functions Context', function () {
    it('register a new function', async function () {
        const functionsContext = new FunctionsContext();
        const testFunctionPath = "./tests/TestProject/functions/updateUsername/source.js";
        const testFunctionConfig = require("./TestProject/functions/updateUsername/config.json");
        functionsContext.registerFunction(testFunctionConfig.name, testFunctionPath);
        let testOutput = functionsContext.execute(testFunctionConfig.name, 1,2,3);
        chai.assert.equal(testOutput, 6);
    });
});
