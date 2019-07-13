---
title: "Developing"
date: 2019-04-23T22:40:25+08:00
weight: 2
---

## Developing Open IAS Scoreboard


#### 1. Making a change

Add your code

#### 2. Check your code

Once you have added your modifications, from the root of the project, run 
```bash
npm test
```
to run ESLint and run units tests to check the quality of your code.

[Learn More](test)

#### 3. Run your Program

Once you have made your changes and checked them with ESLint, you can now run and test your changes.

```bash
# Run this command to start Open IAS Scoreboard from the project root
npm start
```

#### 4. Commit your changes

Once you have made your changes and checked it, you can now commit it. Please make your commit messages descriptive and useful. In the commit message, state what the commit is (bug fix, feature, improvement), a colon (:), then add a description for the change.

Example:
```
Bug fix: prevent line break in team name
```

To commit all changes, run the following command from the project folder
```bash
# Should be run in the open-ias-scoreboard directory
# This command will open your text editor where you can add your commit message
git commit -a
```
If you have set up a PGP key with GitHub, it would be appreciated if you can sign your commit using the `-S` flag.

#### 5. Submit a pull request

[Submit a Pull Request](pullrequest)
