---
title: "Developer Setup"
date: 2019-04-22T13:20:06+08:00
weight: 1
---

## Setting up for developing Open IAS Scoreboard
---
Prerequisites:

- `nodejs`
    - `npm`
    - `yarn`
- `git`
- `electron-forge`

The rest of the prerequisites will be automatically installed when the `npm install` command is run.

On Ubuntu and Ubuntu deriviatives, these can be automatically installed by running the following command
```bash
# Copy and paste into bash
# A sudo password will be required
sudo apt-get update && sudo apt-get install -y nodejs npm git
sudo npm install -g electron-forge
sudo npm install -g yarn
```
---

First, fork the Open IAS Scoreboard repository on GitHub

![Fork Button on GitHub](/img/github-fork.png)

After you have forked the repository on GitHub, clone the repository to your computer
```bash
# Replace <username> with your username
git clone --recursive https://github.com/<username>/open-ias-scoreboard.git
```

Before you start coding, you are going to need to download the dependencies of the program.
```bash
cd open-ias-scoreboard
npm install
```

---

#### Run Open IAS Scoreboard

Now, you have Open IAS Scoreboard and all of its dependencies installed. You can now run the program.

```bash
# Run this command to start Open IAS Scoreboard from the project root
npm start
```

---

#### Now that you have the code on your computer, fire up your favorite IDE and get coding!
[Developing Instructions](/dev/developing)
