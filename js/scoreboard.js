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

const digitLocation = (val) => {
    return `../res/clock/digits/${val}.gif`;
};

let clock = {
    digits: []
};

let scoreDisplays = {
    home: {
        digits: []
    },
    guest: {
        digits: []
    }
}

function main() {
    // Setup
    console.log('started');
    clock.dom = document.querySelector('#main-clock');
    scoreDisplays.home.dom = document.querySelector('#home-score');
    scoreDisplays.guest.dom = document.querySelector('#guest-score');
    add2array(clock.dom.querySelectorAll('.digit'), clock.digits);
    add2array(scoreDisplays.home.dom.querySelectorAll('.digit'), scoreDisplays.home.digits);
    add2array(scoreDisplays.guest.dom.querySelectorAll('.digit'), scoreDisplays.guest.digits);


    function add2array(data, arr)   {
        console.log('adding' + data);
        data.forEach((tmp) => {
            arr.push(tmp);
        });
    }
}

function changeclock(seconds)  {
    let secondDisplay = (seconds % 60).toFixed(0);
    let minuteDisplay = (seconds / 60).toFixed(0);


    changedigit(clock.digits[0], secondDisplay.charAt(1));
    changedigit(clock.digits[1], secondDisplay.charAt(0));
    changedigit(clock.digits[2], minuteDisplay.charAt(1));
    changedigit(clock.digits[3], minuteDisplay.charAt(0));

    function changedigit(digit,val)   {
        digit.src = digitLocation(val);
    }
}

ipc.on('clock-update', (e, val) => {
    changeclock(val);
    document.querySelector('h1').innerText = val;
});
ipc.on('title-set', (e, input) => {
    document.title = input;
});
ipc.on('set-image', (e, msg) => {
    
});
