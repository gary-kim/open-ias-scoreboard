const electron = require('electron');

const { app, BrowserWindow } = electron;
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
        if(closeConfirm !== null)   {
            closeConfirm.show();
            return;
        }
        closeConfirm = new BrowserWindow({parent: current, modal: true, show: false, height: 200, width: 400, frame: false, alwaysOnTop: true, resizable: false});
        closeConfirm.loadFile('ui/surequit.html');
        closeConfirm.on('ready-to-show', () => {
            closeConfirm.webContents.send('set-message', `Are you sure you would like to quit Scoreboard #${number}: ${current.webContents.getTitle()}?`);
            closeConfirm.webContents.send('set-quitting', number);
            closeConfirm.show();
        });
    });
    
}

function createControl() {
    
    controlWindow = new BrowserWindow();
    
    controlWindow.loadFile('ui/control.html');
    
    controlWindow.on('close', (e) => {
        e.preventDefault();
        if(closeConfirm !== null)   {
            closeConfirm.show();
            return;
        }
        closeConfirm = new BrowserWindow({parent: controlWindow, modal: true, show: false, height: 200, width: 400, frame: false, alwaysOnTop: true, resizable: false});
        closeConfirm.loadFile('ui/surequit.html');
        closeConfirm.on('ready-to-show', () => {
            closeConfirm.webContents.send('set-message', "Are you sure you would like to quit Scoreboard? (WARNING: This will close all open scoreboards.)");
            closeConfirm.webContents.send('set-quitting', 0);
            closeConfirm.show();
        });
    })
}

app.on('ready', () => {
    scoreboardWindows[0] = (new BrowserWindow({show: false}));
    createControl();
    createScoreboard();
});

ipc.on('relay', (e, msg) => {
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