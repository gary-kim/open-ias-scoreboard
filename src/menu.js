const electron = require('electron');

const { app, Menu } = electron;

/**
 * Set menu on control window
 * @param {Electron.BrowserWindow} controlWindow Control BrowserWindow
 * @param {Electron.BrowserWindow[]} [scoreboard] Scoreboard BrowserWindow Array
 * @param {string|number} [name] Scoreboard to set on (requires scoreboard to be given)
 */
function init(controlWindow, scoreboard, name) {
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
                            label: 'Increase Score (I)',
                            accelerator: 'i',
                            click: () => { send({ action: 'home', arg: 'increase' }) }
                        },
                        {
                            label: 'Decrease Score (K)',
                            accelerator: 'k',
                            click: () => { send({ action: 'home', arg: 'decrease' }) }
                        }
                    ]
                },
                {
                    label: 'Guest',
                    submenu: [
                        {
                            label: 'Increase Score (O)',
                            accelerator: 'o',
                            click: () => { send({ action: 'guest', arg: 'increase' }) }
                        },
                        {
                            label: 'Decrease Score (L)',
                            accelerator: 'l',
                            click: () => { send({ action: 'guest', arg: 'decrease' }) }
                        }
                    ]
                },
                {
                    label: 'Clock',
                    submenu: [
                        {
                            label: 'Toggle Clock (T)',
                            accelerator: 't',
                            click: () => { send({ action: 'clock', arg: 'toggle' }) }
                        },
                        {
                            label: 'Increase by 1 Second (U)',
                            accelerator: 'u',
                            click: () => { send({ action: 'clock', arg: 'increase' }) }
                        },
                        {
                            label: 'Reduce by 1 Second (J)',
                            accelerator: 'j',
                            click: () => { send({ action: 'clock', arg: 'decrease' }) }
                        }
                    ]
                }
            ]
        },
        {
            label: 'Scoreboard Tabs',
            submenu: [
                {
                    label: 'New Tab (ctrl or cmd + t)',
                    accelerator: 'CmdOrCtrl+t',
                    click: () => { send({ action: 'tabs', arg: 'new' }) }
                },
                {
                    label: 'Next Tab (ctrl + tab)',
                    accelerator: 'ctrl+tab',
                    click: () => { send({ action: 'tabs', arg: 'next' }) }
                },
                {
                    label: 'Previous Tab (ctrl + shift + tab)',
                    accelerator: 'ctrl+shift+tab',
                    click: () => { send({ action: 'tabs', arg: 'previous' }) }
                },
                {
                    label: 'Close Tab (ctrl + w)',
                    accelerator: 'ctrl+w',
                    click: () => { send({ action: 'tabs', arg: 'close' }) }
                }
            ]
        }
    ]
    const menu = Menu.buildFromTemplate(template);
    controlWindow.setMenu(menu);
    controlWindow.openDevTools();

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
}