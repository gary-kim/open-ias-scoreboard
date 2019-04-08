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

const fs = require('fs');
const path = require('path');
const { shell } = require('electron');

let tmp;

window.onload = main;
function main() {

    document.querySelector('#email').addEventListener('click', (e) => {
        e.preventDefault();
        shell.openExternal('mailto:gary@garykim.dev');
    });
    
    fs.readFile(path.join(__dirname, '..', 'oss-attribution/attributions.txt'), (err, data) => {
        console.log(err);
        document.querySelector('#attributions').innerText = data;
    });
    
    let tmp0 = document.querySelector('#project-license');
    tmp = document.createElement('div');
    tmp.innerText = `\n` + fs.readFileSync(path.join(__dirname, '..', 'LICENSE'));
    let ttmp = document.createElement('p');
    ttmp.innerText = `Open IAS Scoreboard    ${JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'))).version}
    Gary Kim <gary@garykim.dev>`;
    tmp0.appendChild(ttmp);
    ttmp = document.createElement('a');
    ttmp.innerText = "https://github.com/gary-kim/open-ias-scoreboard";
    ttmp.setAttribute('href', '#');
    ttmp.addEventListener('click', (e) => {
        e.preventDefault();
        shell.openExternal('https://github.com/gary-kim/open-ias-scoreboard');
    });
    tmp0.appendChild(ttmp);
    tmp0.appendChild(tmp);

}



