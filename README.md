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
Initiate the poroject as an NPM project
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
const fs = require('fs');
const path = require('path');
const chai = require('chai');
const ObjectId = require('mongodb').ObjectId;

const StitchContext = require('stitch-context-module');

async function LoadFunciton(filePath) {
    const JsFileString = await fs.readFileSync(filePath, 'utf-8');
    return await eval(JsFileString);
}

const context = new StitchContext();
let processBaseEvent;
let database;


describe('processBaseEvent', function () {
    before(async function () {
        this.timeout(2000000);
        await context.services.addDatabaseContext('mongodb-atlas');
        processBaseEvent = await LoadFunciton(path.resolve("functions/ProcessBaseEvent/source.js"));
        database = await context.services.get('mongodb-atlas').db('eventprocessor');
    });

    beforeEach(async function () {
        database.dropDatabase();
    });

    after(async function () {
        await context.stop();
    });

    it('empty input test', async function () {
        await chai.expect(processBaseEvent).throw();
    });

    it('missing full document field', async function () {
        try {
            await processBaseEvent({_id: 123});
        } catch (e) {
            await chai.expect(e.message).equal('Provided event does not contain the full document');
        }
    });

    it('process a single event that did not exist', async function () {
        await processBaseEvent({_id: 123, fullDocument: {userId: 123, name: 'John Doe'}});
        people = database.collection('people');
        let person = await people.findOne({userId: 123});

        chai.expect(person.userId).to.equal(123);
        chai.expect(person.name).to.equal('John Doe');
    });

    it('process two events and second event updates first', async function () {
        people = database.collection('people');

        await processBaseEvent({_id: new ObjectId(), fullDocument: {userId: 321, name: 'John Doe'}});
        await processBaseEvent({_id: new ObjectId(), fullDocument: {userId: 321, name: 'John Smith', age: 32}});

        let person = await people.findOne({userId: 321});

        chai.expect(person.userId).to.equal(321);
        chai.expect(person.name).to.equal('John Smith');
        chai.expect(person.age).to.equal(32);
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
