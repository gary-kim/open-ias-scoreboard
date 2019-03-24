/*
    IASAS Scoreboard is an Electron based scoreboard application for IASAS event livestreams.
    Copyright (C) 2019 Gary Kim <gary@ydgkim.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const electron = require('electron');
const ipc = electron.ipcRenderer;

let data = [{
    clock: {
        state: false,
        last: new Date(),
        current: 0,
        display: document.createElement('div'),
        displaystate: document.createElement('div')
    }
}]

window.onload = main;

function main() {
    data.push(data[0]);
    let newscoreboard = newscoreboardtab('1');
    document.querySelector('.tabs').appendChild(newscoreboard.tab);
    document.querySelector('.content').appendChild(newscoreboard.controls);
    setInterval(cron,500);
}

function newscoreboardtab(name)  {
    let tr = {};
    let tmp;
    
    // Create new tab
    tr.tab = document.createElement('button');
    tr.tab.setAttribute('scoreboard-id', name.toString());
    tr.tab.innerText = name.toString();
    tr.tab.addEventListener('click', changescoreboardtab);

    // Create new scoreboard controls for the new tab.
    tr.controls = document.querySelector('template#newcontrols').content.children[0].cloneNode(true);
    tr.controls.setAttribute('scoreboard-id', name.toString());
    
    // clock controls
    tr.controls.querySelector('#clock-toggle').addEventListener('click', (e) => {
        let clock = data[name].clock;
        clock.last = new Date();
        clock.state = !clock.state;
        clock.displaystate.innerText = clock.state? 'Running':'Stopped';
    });
    data[name].clock.display = tr.controls.querySelector('#clock-current');
    data[name].clock.displaystate = tr.controls.querySelector('#clock-state');
    tr.controls.querySelector('#clock-reset').addEventListener('click', (e) => {
        let clock = data[name].clock;
        clock.last = new Date();
        clock.state = false;
        clock.current = 0;
        clock.display.innerText = '00:00';
        clock.displaystate.innerText = 'Stopped';
        ipc.send('relay', {relayTo: name.toString(), channel: 'update-clock', content: 0});
    });

    // team image controls

    return tr;
}

function changescoreboardtab(e)  {
    let ct = e.currentTarget.getAttribute('scoreboard-id');
}

function cron() {
    for(let i = 1; i < data.length; i++)  {
        if(!data[i]) continue;
        let each = data[i];
        if(each.clock.state)  {
            let current = new Date();
            each.clock.current += current - each.clock.last;
            each.clock.last = current;
            ipc.send('relay', {relayTo: i.toString(), channel: 'update-clock', content: (each.clock.current/1000)});
            data[i].clock.display.innerText = `${Math.floor(each.clock.current / 1000 / 60).toString().padStart(2,'0')}:${Math.floor(each.clock.current / 1000 % 60).toString().padStart(2,'0')}`;
        }
    }
    // Update Clock
    
}

ipc.on('destory-scoreboard', (e, msg) => {
    data[msg] = null;
})