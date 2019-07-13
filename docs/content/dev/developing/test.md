---
title: "Unit Tests & ESLint"
date: 2019-04-23T22:41:00+08:00
weight: 3
---

## `npm test`: Check Your Code

Once you have added your modifications, from the root of the project, run
```bash
npm test
```
to run ESLint and unit tests to check the quality of your code.

The command will list any problems or potential issues it finds. Please avoid potential issues if possible but if you cannot get rid of them, you can leave them.

If a problem is found, the command will list them and exit with a non zero exit code. Please fix the problems that are listed. If any of these problems exist, your contribution will not pass Travis CI check and will not be merged.

If you can, please add unit tests for your change. If it is a feature, add tests to ensure the feature continues to work properly. If it is a bug fix, add tests to ensure there is no future regression that reintroduces the bug.

Look in the `test` directory to find unit tests.

### ESLint Configuration

ESLint also checks for JSDoc. Open IAS Scoreboard requires that all functions have a JSDoc comment that lists all parameters, returns, and have a detailed description of what the function does. This is to help other developers understand what your functions does to avoid wasted effort and code duplication.

Good JSDoc Example:
```javascript
/**
 * Create new scoreboard control nodes and attach required nodes to data object.
 *
 * @param {number} name The position in the data array of this new scoreboard.
 * @returns {Object} An object with {tab: Node, controls: Node}.
 */
function newscoreboardtab(name) {
    // function code
}
```