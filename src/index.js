const electron = require('electron');

const { app, BrowserWindow, dialog } = electron;
const ipc = electron.ipcMain;

let scoreboardWindows = [""];
let controlWindow;

let closeConfirm = null;

function createScoreboard() {
    
    let current = new BrowserWindow();
    let number = scoreboardWindows.length;
    scoreboardWindows.push(current);
    
    current.loadFile('ui/scoreboard.html');
    
    current.on('close', (e) => {
        e.preventDefault();
        if(dialog.showMessageBox({type: 'info', buttons: ['Quit', 'Cancel'], title: 'Quit Scoreboard', message: `Close Scoreboard #${number}: ${current.webContents.getTitle()}`, detail: `Are you sure you would like to quit Scoreboard #${number}: ${current.webContents.getTitle()}?`, browserWindow: current}) === 0)  {
            current.destroy();
        }
        controlWindow.webContents.send('destory-scoreboard', number);
    });
    
}

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