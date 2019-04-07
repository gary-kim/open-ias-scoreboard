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

const electron = require('electron');

const { Menu } = electron;

/**
 * Set menu on control window
 * @param {Electron.BrowserWindow} controlWindow Control BrowserWindow
 * @param {Electron.BrowserWindow[]} [scoreboard] Scoreboard BrowserWindow Array
 * @param {string|number} [name] Scoreboard to set on (requires scoreboard to be given)
 * @param {Function{}} functions Object of functions used by init function 
 */
function init(controlWindow, scoreboard, name, functions) {
    const template = [
        {
            label: "Scoreboard",
            submenu: [
                {
                    label: 'Quit Scoreboard',
                    role: 'quit'
                }
            ]
        },
        {
            label: "Ctrl Scoreboard",
            submenu: [
                {
                    label: 'Home',
                    submenu: [
                        {
                            label: 'Increase Score',
                            accelerator: 'i',
                            click: () => { send({ action: 'home', arg: 'increase' }); }
                        },
                        {
                            label: 'Decrease Score',
                            accelerator: 'k',
                            click: () => { send({ action: 'home', arg: 'decrease' }); }
                        }
                    ]
                },
                {
                    label: 'Guest',
                    submenu: [
                        {
                            label: 'Increase Score',
                            accelerator: 'o',
                            click: () => { send({ action: 'guest', arg: 'increase' }); }
                        },
                        {
                            label: 'Decrease Score',
                            accelerator: 'l',
                            click: () => { send({ action: 'guest', arg: 'decrease' }); }
                        }
                    ]
                },
                {
                    label: 'Clock',
                    submenu: [
                        {
                            label: 'Toggle Clock',
                            accelerator: 't',
                            click: () => { send({ action: 'clock', arg: 'toggle' }); }
                        },
                        {
                            label: 'Increase by 1 Second',
                            accelerator: 'u',
                            click: () => { send({ action: 'clock', arg: 'increase' }); }
                        },
                        {
                            label: 'Reduce by 1 Second',
                            accelerator: 'j',
                            click: () => { send({ action: 'clock', arg: 'decrease' }); }
                        }
                    ]
                }
            ]
        },
        {
            label: 'Scoreboard Tabs',
            submenu: [
                {
                    label: 'New Tab',
                    accelerator: 'CmdOrCtrl+t',
                    click: () => { send({ action: 'tabs', arg: 'new' }); }
                },
                {
                    label: 'Next Tab',
                    accelerator: 'ctrl+tab',
                    click: () => { send({ action: 'tabs', arg: 'next' }); }
                },
                {
                    label: 'Previous Tab',
                    accelerator: 'ctrl+shift+tab',
                    click: () => { send({ action: 'tabs', arg: 'previous' }); }
                },
                {
                    label: 'Close Tab',
                    accelerator: 'CmdOrCtrl+w',
                    click: () => { send({ action: 'tabs', arg: 'close' }); }
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: () => { functions.openAboutProgram(); }
                }
            ]
        }
    ];
    const menu = Menu.buildFromTemplate(template);
    controlWindow.setMenu(menu);

    /**
     * Send command to Control Window
     * @param {Object} toSend 
     */
    function send(toSend) {
        controlWindow.webContents.send('keyboard-input', toSend);
    }
}

module.exports = {
    init: init
};