---
title: "Program Structure"
date: 2019-04-26T12:26:19+08:00
weight: 1
---

## Open IAS Scoreboard Structure

---

### Overview

Open IAS Scoreboard is split into several pieces. The most important parts are the main script, control window, and scoreboard window. This page will outline what each part does.

---

### Main Script

The main script keeps a pointer to all windows the program has and handles the opening and closing of windows as well as setting their position and toolbars.

The main script also helps to relay communication between windows.

---

### Control Window

The control window is the true logic center of Open IAS Scoreboard. The control window manages the states of all scoreboards, handles nearly all human inputs, and controls the logic of the program. While the main script is referred to as the "main", it mostly takes commands from the Control Window and simply executes them.

The control window has many functions to handle user input and operating scoreboards. 

Any process that must run on an interval goes in `function cron()`
```javascript
// js/scoreboard.js
/**
 * Function to run tasks that require constant repeating.
 */
function cron() {
    for (let i = 1; i < data.length; i++) {
        if (!data[i]) continue;
        // repeating logic
    }
}
```

<br>
The creation of a new scoreboard is handled by the following function
```javascript
// js/control.js
/**
 * Creates a new scoreboard and assigns the related information and nodes to the data object.
 *
 * @param {number} name The index number of the new scoreboard.
 */
function createnewscoreboard(name) {
    data[name] = JSON.parse(JSON.stringify(data[0]));
    let newscoreboard = newscoreboardtab(name); // returns an object with the elements required for the new scoreboard
    let newtab = document.querySelector('.tabs').appendChild(newscoreboard.tab);
    document.querySelector('.content').appendChild(newscoreboard.controls);
    data[name].tab = newtab;
    setscoreboardtab(name);
}
```
which calls the following function
```javascript
// js/control.js
/**
 * Create new scoreboard control nodes and attach required nodes to data object.
 *
 * @param {number} name The position in the data array of this new scoreboard.
 * @returns {Object} An object with {tab: Node, controls: Node}.
 */
function newscoreboardtab(name) {
    // Create new scoreboard elements
    // Attach event listeners
}
```
---

### Scoreboard Window

The scoreboard window doesn't do much logic. The scoreboard simply recieves messages from the control window and does what it is told to do by the control window.

The window simply recieves messages from the control window that gets relayed thorugh the main script
```javascript
// js/scoreboard.js
// All recieveable commands
ipc.on('update-clock', (e, val) => {
    changeclock(val);
});
ipc.on('set-score', (e, msg) => {
    changescore(msg.score, msg.home);
});
ipc.on('title-set', (e, input) => {
    document.title = input;
});
ipc.on('set-logo', (e, msg) => {
    teams.logos[msg.home ? 'home' : 'guest'].src = msg.image_path;
});
ipc.on('set-name', (e, msg) => {
    teams.name[msg.home ? 'home' : 'guest'].innerText = msg.changeTo;
});
```
then runs the corresponding function.
