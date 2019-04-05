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
/**
 * @file Run scoreboard
 * @license AGPL-3.0
 * @author Gary Kim
 */

const electron = require('electron');
const ipc = electron.ipcRenderer;

window.onload = main;

/**
 * Converts a digit or symbol to a file path to an image representing that digit or symbol
 * @param {string|number} val digit or symbol to get file path for.
 * @returns {string} file path to image with requested digit or symbol
 */
function digitLocation(val) {
    return `../res/clock/digits/${val}.gif`;
}

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

let logos = {
    home: HTMLImageElement,
    guest: HTMLImageElement
}

function main() {
    // Setup
    console.log('started');
    // Set up clock and scoring
    clock.dom = document.querySelector('#main-clock');
    scoreDisplays.home.dom = document.querySelector('#home-score');
    scoreDisplays.guest.dom = document.querySelector('#guest-score');
    add2array(clock.dom.querySelectorAll('.digit'), clock.digits);
    add2array(scoreDisplays.home.dom.querySelectorAll('.digit'), scoreDisplays.home.digits);
    add2array(scoreDisplays.guest.dom.querySelectorAll('.digit'), scoreDisplays.guest.digits);

    /**
     * 
     * @param {any[]} data 
     * @param {any[]} arr 
     */
    function add2array(data, arr) {
        data.forEach((tmp) => {
            arr.push(tmp);
        });
    }

    // Set up team logos
    logos.home = document.querySelector('#home-logo img');
    logos.guest = document.querySelector('#guest-logo img');
}

/**
 * Changes the clock display
 * @param {number} seconds Time to be shown on clock in seconds.
 */
function changeclock(seconds) {
    let secondDisplay = Math.floor(seconds % 60);
    let minuteDisplay = Math.floor((seconds / 60));

    changedigit(clock.digits[3], Math.floor(secondDisplay % 10));
    changedigit(clock.digits[2], Math.floor(secondDisplay / 10));
    changedigit(clock.digits[1], Math.floor(minuteDisplay % 10));
    changedigit(clock.digits[0], Math.floor(minuteDisplay / 10));
}
/**
 * Changes score that is shown on the scoreboard.
 * @param {number} score Score to set
 * @param {boolean} home Setting home team's score?
 */
function changescore(score, home) {
    let display = home ? scoreDisplays.home : scoreDisplays.guest;

    changedigit(display.digits[0], Math.floor(score / 10));
    changedigit(display.digits[1], Math.floor(score % 10));
}

/**
 * Changes the image of the given Node to the one representing the number passed as val.
 * @param {Node} digit Node of image to change
 * @param {number} val Number to change digit to
 */
function changedigit(digit, val) {
    digit.src = digitLocation(val);
}

// All recieveable commands
ipc.on('update-clock', (e, val) => {
    changeclock(val);
});
ipc.on('set-score', (e, msg) => {
    changescore(msg.score, msg.home);
});
ipc.on('title-set', (e, input) => {
    document.title = input;
});
ipc.on('set-logo', (e, msg) => {
    logos[msg.home ? 'home' : 'guest'].src = msg.image_path;
});
