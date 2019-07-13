window.onload = main;

async function main() {
    let info = (await (await fetch("https://api.github.com/repos/gary-kim/open-ias-scoreboard/releases")).json());
    
    document.querySelectorAll('.download-links').forEach((curr) => {
        setLinks(curr, info);
    });
    
    let version_dom = document.querySelector('#version');
    version_dom.innerText = info[0].name + ' Changelog';
    version_dom.href = info[0].html_url;
}
async function getRelease(info, type) {
    for(let i = 0; i < info.length; i++) {
        let cr = await getReleaseH(info, type, i);
        if (cr !== undefined) {
            return cr;
        }
    }
}
async function getReleaseH(info, type, i) {
    return info[i].assets.filter(current => current.name.substring(current.name.length - type.length) === type)[0] || undefined;
}
async function setLinks(element, info) {
    let rinfo = await getRelease(info, element.getAttribute('download-type'));
    console.log(rinfo);
    element.href = rinfo.browser_download_url;
    element.innerText = rinfo.name;
}