/*
    Open IAS Scoreboard is an Electron based scoreboard application for IASAS event livestreams.
    Copyright (C) 2019 Gary Kim <gary@garykim.dev>

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

// Not Currently Used

const electron = require('electron');
const ipc = electron.ipcRenderer;
const Mousetrap = require('mousetrap');

window.onload = main;

let quitting = 0;

function main() {
    document.querySelector('#quit').addEventListener('click', sendQuit);
    Mousetrap.bind(['q','y'], sendQuit);
    document.querySelector('#cancel').addEventListener('click', sendCancel);
    Mousetrap.bind(['c','n'], sendCancel);
    function sendQuit() {
        ipc.send('shutdown', quitting);
        ipc.send('shutdown', -2);
    }
    function sendCancel()   {
        ipc.send('shutdown', -2);
    }
}

ipc.on('set-message', (e,msg) => {
    document.querySelector('#message').innerText = msg;
});
ipc.on('set-quitting', (e, msg) => {
    quitting = msg;
});
