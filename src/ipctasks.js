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
 * 
 * @file Does the work requested from windows that must be done in the main thread
 * @license AGPL-3.0
 * @author Gary Kim
 */
const electron = require('electron');
const { BrowserWindow, dialog, shell } = electron;
const ipc = electron.ipcMain;

/**
 * Init ipc listeners.
 * 
 * @param {Electron.BrowserWindow} controlWindow The control window for the program.
 * @param {Electron.BrowserWindow[]} scoreboardWindows An array of all the scoreboard windows for the program.
 */
function init(controlWindow, scoreboardWindows)    {
    ipc.on('set-logo', async (e, msg) => {
        let filepaths = dialog.showOpenDialog(e.sender, {title: `Select Team Logo for ${msg.home? 'home':'guest'}`, buttonLabel: 'Select', properties: 'openFile', filters: [{name: 'Images', extensions: ['png','jpeg','jpg', 'gif', 'svg']}, {name: 'All Files', extensions: ['*']}]});
        if(!filepaths) return;
        scoreboardWindows[msg.scoreboard].webContents.send('set-logo', {home: msg.home, image_path: filepaths[0]});
        e.sender.webContents.send('set-logo', {home: msg.home, image_path: filepaths[0], scoreboard: msg.scoreboard});
    });
    
    ipc.on('relay', (e, target, channel, msg) => {
        // eslint-disable-next-line no-console
        console.log(`Relaying ${JSON.stringify(msg)} to ${target} on channel ${channel}`);
        scoreboardWindows[parseInt(target)].webContents.send(channel,msg);
    });

    ipc.on('open-about-program', openAboutProgram);

    ipc.on('open-link', (e, msg) => {
        shell.openExternal(msg);
    });

    ipc.on('focus', (e, msg) => {
        scoreboardWindows[msg].focus();
    });

    ipc.on('window-op', (e, msg) => {
        scoreboardWindows[msg.id][msg.action]();
    });
}

function openAboutProgram() {
    let about_view = new BrowserWindow({autoHideMenuBar: true});
    about_view.loadFile("ui/about.html");
}


module.exports = {
    init: init,
    openAboutProgram: openAboutProgram
};
