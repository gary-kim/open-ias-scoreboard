/*
    IASAS Scoreboard is an Electron based scoreboard application for IASAS event livestreams.
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

const electron = require('electron');

const { app, BrowserWindow, dialog } = electron;
const ipc = electron.ipcMain;

let scoreboardWindows = [""];
let controlWindow;

let closeConfirm = null;

/**
 * Create new scoreboard and add it to scoreboardWindows array.
 * @todo Handle multiple scoreboards properly
 */
function createScoreboard() {
    
    let current = new BrowserWindow();
    let number = scoreboardWindows.length;
    scoreboardWindows.push(current);
    
    current.loadFile('ui/scoreboard.html');

    current.on('responsive', (e) => {
        current.webContents.send('title-set', `Scoreboard #${number}`);
    });
    
    current.on('close', (e) => {
        e.preventDefault();
        if(dialog.showMessageBox({type: 'info', buttons: ['Quit', 'Cancel'], title: 'Quit Scoreboard', message: `Close Scoreboard #${number}: ${current.webContents.getTitle()}`, detail: `Are you sure you would like to quit Scoreboard #${number}: ${current.webContents.getTitle()}?`, browserWindow: current}) === 0)  {
            current.destroy();
        }
        controlWindow.webContents.send('destory-scoreboard', number);
    });
    
}

/**
 * Creates a control board window (Only one per instance of the program. Having more then one will lead to unexpected behavior)
 */
function createControl() {
    
    controlWindow = new BrowserWindow();
    
    controlWindow.loadFile('ui/control.html');
    
    controlWindow.on('close', (e) => {
        e.preventDefault();
        if(dialog.showMessageBox({type: 'info', buttons: ['Quit', 'Cancel'], title: 'Quit Scoreboard', message: "Close all scoreboards from Scoreboard", detail: `Are you sure you would like to quit Scoreboard? (WARNING: This will close all open scoreboards.)`, browserWindow: controlWindow}) === 0)  {
            scoreboardWindows.forEach((each) => {
                each.destroy();
            });
            controlWindow.destroy();
            app.quit();
        }
    })
}

app.on('ready', () => {
    scoreboardWindows[0] = (new BrowserWindow({show: false}));
    createControl();
    createScoreboard();
});

// Handle messages from windows

ipc.on('set-logo', (e, msg) => {
    let filepaths = dialog.showOpenDialog(e.sender, {title: `Select Team Logo for ${msg.home? 'home':'guest'}`, buttonLabel: 'Select', properties: 'openFile'});
    if(!filepaths) return;
    scoreboardWindows[msg.scoreboard].webContents.send('set-logo', {home: msg.home, image_path: filepaths[0]});
    e.sender.webContents.send('set-logo', {home: msg.home, image_path: filepaths[0], scoreboard: msg.scoreboard});
});

ipc.on('relay', (e, msg) => {
    console.log(`Relaying ${msg.content} to ${msg.relayTo} on ${msg.channel}`);
    scoreboardWindows[msg.relayTo].webContents.send(msg.channel,msg.content);
});

ipc.on('shutdown', (e, msg) => {
    switch(msg) {
        case -2:
        //closeConfirm.close();
        closeConfirm.minimize();
        closeConfirm = null;
        break;
        case -1:
        e.sender.destroy();
        break;
        case 0:
        scoreboardWindows.forEach((each) => {
            each.destroy();
        });
        controlWindow.destroy();
        app.quit();
        break;
        default:
        scoreboardWindows[msg].destroy();
        break;
    }
});