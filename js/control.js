/*
    Open IAS Scoreboard is an Electron based scoreboard application for IASAS event livestreams.
    Copyright (C) 2019 Gary Kim <gary@garykim.dev>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, version 3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
/**
 * @file Run control board
 * @license AGPL-3.0
 * @author Gary Kim
 */

const electron = require('electron');
const ipc = electron.ipcRenderer;

const gir = require('get-in-range');

let data = [{
    clock: {
        state: false,
        countdown: true,
        last: new Date(),
        current: 0,
        display: HTMLDivElement,
        displaystate: HTMLDivElement
    },
    home: {
        current: 0,
        scoreDisplay: HTMLDivElement,
        logo: HTMLImageElement
    },
    guest: {
        current: 0,
        scoreDisplay: HTMLDivElement,
        logo: HTMLImageElement
    },
    tab: HTMLButtonElement
}];

let current = 0;

window.onload = main;

function main() {
    setInterval(cron, 500);


    // Attach global event listeners
    document.querySelector('#new-tab-button').addEventListener('click', () => {
        ipc.send('create-scoreboard');
    });
    document.querySelector('#about-program').addEventListener('click', () => {
        ipc.send('open-about-program');
    });
}

/**
 * Creates a new scoreboard and assigns the related information and nodes to the data object.
 *
 * @param {number} name The index number of the new scoreboard.
 */
function createnewscoreboard(name) {
    data[name] = JSON.parse(JSON.stringify(data[0]));
    let newscoreboard = newscoreboardtab(name);
    let newtab = document.querySelector('.tabs').appendChild(newscoreboard.tab);
    document.querySelector('.content').appendChild(newscoreboard.controls);
    data[name].tab = newtab;
    setscoreboardtab(name);
}

/**
 * Create new scoreboard control nodes and attach required nodes to data object.
 *
 * @param {number} name The position in the data array of this new scoreboard.
 * @returns {Object} An object with {tab: Node, controls: Node}.
 */
function newscoreboardtab(name) {
    let tr = {};
    let tmp;

    // Create new tab
    tr.tab = document.createElement('button');
    tr.tab.setAttribute('scoreboard-id', name.toString());
    tr.tab.innerText = `Scoreboard #${name.toString()}`;
    tr.tab.addEventListener('click', (e) => { setscoreboardtab(e.currentTarget.getAttribute('scoreboard-id')); });

    // Create new scoreboard controls for the new tab.
    tr.controls = document.querySelector('template#newcontrols').content.children[0].cloneNode(true);
    tr.controls.setAttribute('scoreboard-id', name.toString());

    // Scoreboard overall controls
    tr.controls.querySelector('#visibility').addEventListener('click', (e) => {
        let action = (e.currentTarget.checked) ? 'show' : 'hide';
        ipc.send('window-op', { 'id': name, action: action });
    });
    tr.controls.querySelector('#close-tab').addEventListener('click', () => {
        ipc.send('window-op', { id: name, action: 'close' });
    });
    tr.controls.querySelector('#focus-window').addEventListener('click', () => {
        ipc.send('window-op', { id: name, action: 'focus' });
    });
    let rename_tab = tr.controls.querySelector('#rename-tab');
    rename_tab.value = `Scoreboard #${name}`;
    rename_tab.addEventListener('input', (e) => {
        let newtitle = e.currentTarget.value;
        data[name].tab.innerText = newtitle;
        ipc.send('relay', { relayTo: name, channel: 'title-set', content: newtitle });
    });

    // clock controls
    tr.controls.querySelector('#clock-toggle').addEventListener('click', () => {
        toggleClock(name);
    });
    data[name].clock.display = tr.controls.querySelector('#clock-current');
    data[name].clock.displaystate = tr.controls.querySelector('#clock-state');

    // Set the clock
    tr.controls.querySelector('#clock-set-submit').addEventListener('click', (e) => {
        e.preventDefault();
        let minutes = gir(tr.controls.querySelector('#clock-set-minutes').value, 0, 99);
        let seconds = gir(tr.controls.querySelector('#clock-set-seconds').value, 0, 59);
        clockset(name, ((minutes * 60) + seconds) * 1000);
    });
    // Also allow easy incrementing of clock
    tr.controls.querySelector('#increase-clock').addEventListener('click', () => {
        clockset(name, gir(data[name].clock.current + 1000, 0, 5999000));
    });

    tr.controls.querySelector('#decrease-clock').addEventListener('click', () => {
        clockset(name, gir(data[name].clock.current - 1000, 0, 5999000));
    });

    // Set team logo controls
    data[name].home.logo = tr.controls.querySelector('.logo-select.home img');
    data[name].guest.logo = tr.controls.querySelector('.logo-select.guest img');

    tr.controls.querySelector('.logo-select.home button').addEventListener('click', () => {
        setteamlogo(true, name);
    });
    tr.controls.querySelector('.logo-select.guest button').addEventListener('click', () => {
        setteamlogo(false, name);
    });


    // Set team name controls
    tr.controls.querySelector('#home-name').addEventListener('input', (e) => {
        changeName(name, true, e.currentTarget.value);
    });
    tr.controls.querySelector('#guest-name').addEventListener('input', (e) => {
        changeName(name, false, e.currentTarget.value);
    });


    // team score controls
    teamscorecontrols(data[name].home, tr.controls.querySelector('#home-controls'), true);
    teamscorecontrols(data[name].guest, tr.controls.querySelector('#guest-controls'), false);
    /**
     * 
     * @param {Object} setOn Data object for specific team.
     * @param {Node} attachTo Node with div of team controls.
     * @param {boolean} home Setting for home?
     * 
     */
    function teamscorecontrols(setOn, attachTo, home) {
        setOn.scoreDisplay = attachTo.querySelector('.team-score');
        attachTo.querySelector('.increase-score').addEventListener('click', () => { changeScore(name, home, 1); });
        attachTo.querySelector('.decrease-score').addEventListener('click', () => { changeScore(name, home, -1); });
    }

    return tr;
}

/**
 * Sets the clock time then updates the clock on the control board and scoreboard.
 *
 * @param {string|number} name  Scoreboard to set on.
 * @param {number} miliseconds  Time to set clock to in miliseconds.
 * @param {boolean} [delta]  Should change by miliseconds?
 */
function clockset(name, miliseconds, delta) {
    if (delta === true) {
        data[name].clock.current = gir(data[name].clock.current + miliseconds, 0, 5999000);
    } else {
        data[name].clock.current = miliseconds;
    }
    data[name].clock.display.innerText = `${Math.floor(data[name].clock.current / 1000 / 60).toString().padStart(2, '0')}:${Math.floor(data[name].clock.current / 1000 % 60).toString().padStart(2, '0')}`;
    ipc.send('relay', { relayTo: name.toString(), channel: 'update-clock', content: (data[name].clock.current / 1000) });
}

/**
 * Start or stop the clock of the specified scoreboard.
 * 
 * @param {string|number} name Scoreboard to toggle clock on.
 */
function toggleClock(name) {
    let clock = data[name].clock;
    clock.last = new Date();
    clock.state = !clock.state;
    clock.displaystate.innerText = clock.state ? 'Running' : 'Stopped';
}

/**
 * Change score of team.
 *
 * @param {string|number} name  Scoreboard to set on.
 * @param {boolean} home  Set on home?
 * @param {number} changeBy  The value to change score by.
 */
function changeScore(name, home, changeBy) {
    let setOn = data[name][home ? 'home' : 'guest'];
    setOn.current = gir(setOn.current + changeBy, 0, 99);
    setOn.scoreDisplay.innerText = setOn.current.toString().padStart(2, '0');
    ipc.send('relay', { relayTo: name, channel: 'set-score', content: { score: setOn.current, home: home } });
}

/**
 * Changes the name of a team.
 * 
 * @param {number} sbid The id of the scoreboard to set on.
 * @param {boolean} home Set on home?
 * @param {string} changeTo The text to change the name to.
 */
function changeName(sbid, home, changeTo) {
    ipc.send('relay', { relayTo: sbid, channel: 'set-name', content: { home: home, changeTo: changeTo }});
}

/**
 * Set the control window to be controlling another scoreboard tab.
 *
 * @param {string|name} name  Scoreboard to change tab to.
 */
function setscoreboardtab(name) {
    current = name;
    document.querySelectorAll('.tabs > button').forEach((curr) => {
        if (curr.getAttribute('scoreboard-id').toString() === current.toString()) {
            curr.classList.add('active');
        } else {
            curr.classList.remove('active');
        }
    });
    document.querySelectorAll('.controls').forEach((ctrl) => {
        if (ctrl.getAttribute('scoreboard-id').toString() === current.toString()) {
            ctrl.classList.remove('hidden');
        } else {
            ctrl.classList.add('hidden');
        }
    });
}

/**
 * @returns {number[]} All scoreboard indexes.
 */
function scoreboardList() {
    let tr = [];
    for (let i = 1; i < data.length; i++) {
        if (data[i] !== null) {
            tr.push(i);
        }
    }
    return tr;
}

/**
 * 
 * Brings up dialog where team logo can be chosen.
 * 
 * @param {boolean} home  Set for home?
 * @param {number} sbid  Scoreboard id for team logo to be set for.
 * 
 */
function setteamlogo(home, sbid) {
    ipc.send('set-logo', { scoreboard: sbid, home: home });
}

/**
 * Function to run tasks that require constant repeating.
 */
function cron() {
    for (let i = 1; i < data.length; i++) {
        if (!data[i]) continue;
        let each = data[i];
        if (each.clock.state) {
            let current = new Date();
            each.clock.current = Math.max(each.clock.current + (each.clock.last - current), 0);
            each.clock.last = current;
            ipc.send('relay', { relayTo: i.toString(), channel: 'update-clock', content: (each.clock.current / 1000) });
            data[i].clock.display.innerText = `${Math.floor(each.clock.current / 1000 / 60).toString().padStart(2, '0')}:${Math.floor(each.clock.current / 1000 % 60).toString().padStart(2, '0')}`;
        }
    }
    // Update Clock

}


// All recieveable commands
ipc.on('destory-scoreboard', (e, msg) => {
    data[msg] = null;
    document.querySelector(`.tabs > button[scoreboard-id='${msg}']`).remove();
    document.querySelector(`.content > div[scoreboard-id='${msg}']`).remove();
    let scoreboards = scoreboardList();
    let i = scoreboards.indexOf(current);
    setscoreboardtab(scoreboards[(i + 1) % scoreboards.length]);
});
ipc.on('set-logo', (e, msg) => {
    data[msg.scoreboard][msg.home ? 'home' : 'guest'].logo.src = msg.image_path;
});
ipc.on('create-scoreboard', (e, msg) => {
    createnewscoreboard(msg);
});
ipc.on('keyboard-input', (e, msg) => {
    if(document.activeElement.matches('input[type=text]'))
        return;
    switch (msg.action) {
        case 'home':
            switch (msg.arg) {
                case 'increase':
                    changeScore(current, true, 1);
                    break;
                case 'decrease':
                    changeScore(current, true, -1);
                    break;
            }
            break;
        case 'guest':
            switch (msg.arg) {
                case 'increase':
                    changeScore(current, false, 1);
                    break;
                case 'decrease':
                    changeScore(current, false, -1);
                    break;
            }
            break;
        case 'clock':
            switch (msg.arg) {
                case 'toggle':
                    toggleClock(current);
                    break;
                case 'increase':
                    clockset(current, 1000, true);
                    break;
                case 'decrease':
                    clockset(current, -1000, true);
                    break;
            }
            break;
        case 'tabs': {
            let scoreboards = scoreboardList();
            let i = scoreboards.indexOf(current);
            switch (msg.arg) {
                case 'next':
                    setscoreboardtab(scoreboards[(i + 1) % scoreboards.length]);
                    break;
                case 'new':
                    ipc.send('create-scoreboard');
                    break;
                case 'previous': {
                    let setto = i - 1;
                    if (setto < 0) {
                        setto = scoreboards.length - 1;
                    }
                    setscoreboardtab(scoreboards[setto]);
                    break;
                }
                case 'close':
                    if (i !== -1) {
                        ipc.send('window-op', { id: current, action: 'close' });
                    }
                    break;
            }
            break;
        }
    }
});