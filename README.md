# stitch-context-module
A simulated Stitch context to be used a part of automated testing stitch functions. 

## Tests
![Master](https://github.com/desterhuizen/stitch-context-module/workflows/Automated%20Tests/badge.svg?branch=master)

# Example Project

## Export the Stitch project

Export the Stitch project using the stitch-cli.

```
stitch-cli login --api-key=<API_KEY> --private-api-key=<API_PRIVATE_KEY>
stitch-cli export --app-id=<STITCH-APPLICATION-ID>
```
Initiate the project as an NPM project
```
npm init 
```

Import the  Stitch-Context-Module from github.

```
npm install --save-dev https://github.com/desterhuizen/stitch-context-module.git
```

Add Mocha, Chai and sinonjs

```
 npm install --save-dev mocha chai sinon
```

Create a tests directory
```
mkdir tests
mkdir testdb
```

Create a new test for the function we created

```javascript
const StitchContext = require('stitch-context-module');
const chai = require('chai');

global.context = new StitchContext('./stitch/');

before (async function () {
    this.timeout(2000000);
    await context.init();
});

after (async function (){
    await context.stop();
});

describe ('baseEventHandler', function (){
    it ('empty input test', async function (){
        let message = "12345";
        try {
            await context.functions.execute('baseEventHandler');
        } catch (e) {
            message = e.message;
        }
        chai.assert.equal(message, "Empty input");
    });
    it('missingFullDocumentField', async function() {
        let message = "";
        try {
            await context.functions.execute('baseEventHandler', {id: 1});
        } catch (e) {
            message = e.message;
        }
        chai.assert.equal(message, "Missing fullDocument Field");
    });
});
```

Example Function
```javascript
exports = function(eventDocument){

  if (!eventDocument) {
    throw new Error('No event data provided');
  }

  if (!eventDocument.fullDocument) {
    throw new Error('Provided event does not contain the full document')
  }

  const mongodb = context.services.get("mongodb-atlas");
  const people = mongodb.db('eventprocessor').collection("people");

  let _id = eventDocument.fullDocument.userId;
  let update = eventDocument.fullDocument;

  delete (update._id);

  people.updateOne ({_id: _id}, {$set:update}, {upsert: true});
  
  return {arg: eventDocument};
};
```
