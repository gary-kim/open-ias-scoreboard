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

window.onload = main;

let quitting = 0;

function main() {
    document.querySelector('#quit').addEventListener('click', () => {
        ipc.send('quit', quitting);
        ipc.send('quit', -2);
    });
    document.querySelector('#cancel').addEventListener('click', () => {
        ipc.send('quit', -2);
    });
}

ipc.on('set-message', (e,msg) => {
    document.querySelector('#message').innerText = msg;
});
ipc.on('set-quitting', (e, msg) => {
    quitting = msg;
});