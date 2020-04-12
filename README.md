# stitch-context-module
A simulated Stitch context to be used a part of automated testing stitch functions. 

## Tests
![Automated Tests](https://github.com/desterhuizen/stitch-context-module/workflows/Automated%20Tests/badge.svg?branch=master)

# Example Project

## Export the Stitch project

Export the Stitch project using the stitch-cli.

```
stitch-cli login --api-key=<API_KEY> --private-api-key=<API_PRIVATE_KEY>
stitch-cli export --app-id=<STITCH-APPLICATION-ID>
```

Import the  Stitch-Context-Module from github.

```
npm install --save-dev git@github.com:desterhuizen/stitch-context-module.git
```

Add Mocha, Chai and sinonjs

```
 npm install --save-dev mocha chai sinon
```

Create a tests directory
```
mkdir tests
```

Create a new test for the function we created
```

```
