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

const fs = require('fs');
const path = require('path');
const { shell } = require('electron');

let tmp;

window.onload = main;
function main() {
    fs.readFile(path.join(__dirname, '..', '/oss-attribution/licenseInfos.json'), (err, data) => {
        let attributions = JSON.parse(data);
        let attributions_dom = document.querySelector('#attributions');

        Object.values(attributions).forEach((attr) => {
            let attr_dom = document.createElement('details');

            tmp = document.createElement('summary');
            tmp.innerText = attr.name;
            attr_dom.append(tmp);

            tmp = document.createElement('p');
            tmp.innerText = `
        ${attr.name}    ${attr.version}
        ${attr.authors}
        `;
            let ttmp = document.createElement('a');
            ttmp.innerText = attr.url;
            ttmp.setAttribute('href', '#');
            ttmp.addEventListener('click', (e) => {
                e.preventDefault();
                shell.openExternal(attr.url);
            });
            tmp.append(ttmp);
            attr_dom.append(tmp);

            tmp = document.createElement('div');
            tmp.innerText = attr.licenseText;
            attr_dom.append(tmp);

            attributions_dom.append(attr_dom);
        });
    })

}



