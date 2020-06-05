'use strict';
const fs = require('fs');
const path = require('path');

module.exports = class Functions {
    constructor() {
        this.functions = {};
    }

    registerFunction(functionName, functionPath) {
        const fileContent = fs.readFileSync(path.resolve(functionPath),'utf-8');
        this.functions[functionName] = eval(fileContent);
    }

    execute(functionName) {
        const args = Array.prototype.slice.call(arguments, 1);
        return this.functions[functionName].apply(this, args);
    }
};
