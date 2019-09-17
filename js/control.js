!function(e){var t={};function r(o){if(t[o])return t[o].exports;var c=t[o]={i:o,l:!1,exports:{}};return e[o].call(c.exports,c,c.exports,r),c.l=!0,c.exports}r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var c in e)r.d(o,c,function(t){return e[t]}.bind(null,c));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/js",r(r.s=1)}([function(e,t){e.exports=require("electron")},function(e,t,r){
/**
 * @file Run control board
 * @license AGPL-3.0
 * @author Gary Kim
 */
const o=r(0).ipcRenderer,c=r(2);let n=[{clock:{state:!1,countdown:!0,last:new Date,current:0,display:HTMLDivElement,displaystate:HTMLDivElement},home:{current:0,scoreDisplay:HTMLDivElement,logo:HTMLImageElement},guest:{current:0,scoreDisplay:HTMLDivElement,logo:HTMLImageElement},tab:HTMLButtonElement}],a=0;function l(e){n[e]=JSON.parse(JSON.stringify(n[0]));let t=function(e){let t,r={};r.tab=document.createElement("button"),r.tab.setAttribute("scoreboard-id",e.toString()),r.tab.classList.add("tab-button"),r.tab.innerText=`Scoreboard #${e.toString()}`,r.tab.addEventListener("click",e=>{g(e.currentTarget.getAttribute("scoreboard-id"))}),r.controls=document.querySelector("template#newcontrols").content.children[0].cloneNode(!0),r.controls.setAttribute("scoreboard-id",e.toString()),r.controls.querySelector("#visibility").addEventListener("click",t=>{let r=t.currentTarget.checked?"show":"hide";o.send("window-op",{id:e,action:r})}),r.controls.querySelector("#close-tab").addEventListener("click",()=>{o.send("window-op",{id:e,action:"close"})}),r.controls.querySelector("#focus-window").addEventListener("click",()=>{o.send("window-op",{id:e,action:"focus"})});let a=r.controls.querySelector("#rename-tab");function l(t,r,o){t.scoreDisplay=r.querySelector(".team-score"),r.querySelector(".increase-score").addEventListener("click",()=>{u(e,o,1)}),r.querySelector(".decrease-score").addEventListener("click",()=>{u(e,o,-1)})}return a.value=`Scoreboard #${e}`,a.addEventListener("input",t=>{let r=t.currentTarget.value;n[e].tab.innerText=r,p(e,"title-set",r)}),r.controls.querySelector("#clock-toggle").addEventListener("click",()=>{i(e)}),n[e].clock.display=r.controls.querySelector("#clock-current"),n[e].clock.displaystate=r.controls.querySelector("#clock-state"),r.controls.querySelector("#clock-set-submit").addEventListener("click",t=>{t.preventDefault();let o=c(r.controls.querySelector("#clock-set-minutes").value,0,99),n=c(r.controls.querySelector("#clock-set-seconds").value,0,59);s(e,1e3*(60*o+n))}),r.controls.querySelector("#clock-direction").addEventListener("click",t=>{n[e].clock.countdown=t.currentTarget.checked}),r.controls.querySelector("#increase-clock").addEventListener("click",()=>{s(e,c(n[e].clock.current+1e3,0,5999e3))}),r.controls.querySelector("#decrease-clock").addEventListener("click",()=>{s(e,c(n[e].clock.current-1e3,0,5999e3))}),r.controls.querySelector("#scoreboard-scaling").addEventListener("change",t=>{p(e,"scale",t.currentTarget.value)}),n[e].home.logo=r.controls.querySelector(".logo-select.home img"),n[e].guest.logo=r.controls.querySelector(".logo-select.guest img"),r.controls.querySelector(".logo-select.home button").addEventListener("click",()=>{f(!0,e)}),(t=r.controls.querySelector(".logo-select.home .img-container")).ondragover=e=>{e.preventDefault()},t.ondrop=t=>{t.preventDefault(),1===t.dataTransfer.files.length&&/^image\/.+/.test(t.dataTransfer.files.item(0).type)&&(p(e,"set-logo",{home:!0,image_path:t.dataTransfer.files.item(0).path}),t.currentTarget.querySelector("img").src=t.dataTransfer.files.item(0).path)},r.controls.querySelector(".logo-select.guest button").addEventListener("click",()=>{f(!1,e)}),(t=r.controls.querySelector(".logo-select.guest .img-container")).ondragover=e=>{e.preventDefault()},t.ondrop=t=>{t.preventDefault(),1===t.dataTransfer.files.length&&/^image\/.+/.test(t.dataTransfer.files.item(0).type)&&(p(e,"set-logo",{home:!1,image_path:t.dataTransfer.files.item(0).path}),t.currentTarget.querySelector("img").src=t.dataTransfer.files.item(0).path)},r.controls.querySelector("#home-name").addEventListener("input",t=>{d(e,!0,t.currentTarget.value)}),r.controls.querySelector("#guest-name").addEventListener("input",t=>{d(e,!1,t.currentTarget.value)}),l(n[e].home,r.controls.querySelector("#home-controls"),!0),l(n[e].guest,r.controls.querySelector("#guest-controls"),!1),r}(e),r=document.querySelector(".tabs").appendChild(t.tab);document.querySelector(".content").appendChild(t.controls),n[e].tab=r,g(e)}function s(e,t,r){n[e].clock.current=!0===r?c(n[e].clock.current+t,0,5999e3):t,n[e].clock.display.innerText=`${Math.floor(n[e].clock.current/1e3/60).toString().padStart(2,"0")}:${Math.floor(n[e].clock.current/1e3%60).toString().padStart(2,"0")}`,p(e,"update-clock",n[e].clock.current/1e3)}function i(e){let t=n[e].clock;t.last=new Date,t.state=!t.state,t.displaystate.innerText=t.state?"Running":"Stopped"}function u(e,t,r){let o=n[e][t?"home":"guest"];o.current=c(o.current+r,0,99),o.scoreDisplay.innerText=o.current.toString().padStart(2,"0"),p(e,"set-score",{score:o.current,home:t})}function d(e,t,r){p(e,"set-name",{home:t,changeTo:r})}function g(e){a=e,document.querySelectorAll(".tabs > button").forEach(e=>{e.getAttribute("scoreboard-id").toString()===a.toString()?e.classList.add("active"):e.classList.remove("active")}),document.querySelectorAll(".controls").forEach(e=>{e.getAttribute("scoreboard-id").toString()===a.toString()?e.classList.remove("hidden"):e.classList.add("hidden")})}function m(){let e=[];for(let t=1;t<n.length;t++)n[t]&&e.push(t);return e}function f(e,t){o.send("set-logo",{scoreboard:t,home:e})}function p(e,t,r){o.send("relay",e,t,r)}function b(){for(let e=1;e<n.length;e++){if(!n[e])continue;let t=n[e];if(t.clock.state){let r=new Date,o=t.clock.countdown?t.clock.last-r:-(t.clock.last-r);t.clock.current=c(t.clock.current+o,0,5999e3),t.clock.last=r,p(e,"update-clock",t.clock.current/1e3),n[e].clock.display.innerText=`${Math.floor(t.clock.current/1e3/60).toString().padStart(2,"0")}:${Math.floor(t.clock.current/1e3%60).toString().padStart(2,"0")}`}}}window.onload=function(){setInterval(b,500),document.querySelector("#new-tab-button").addEventListener("click",()=>{o.send("create-scoreboard")}),document.querySelector("#about-program").addEventListener("click",()=>{o.send("open-about-program")})},o.on("destory-scoreboard",(e,t)=>{n[t]=null,document.querySelector(`.tabs > button[scoreboard-id='${t}']`).remove(),document.querySelector(`.content > div[scoreboard-id='${t}']`).remove();let r=m(),o=r.indexOf(a);g(r[(o+1)%r.length])}),o.on("set-logo",(e,t)=>{n[t.scoreboard][t.home?"home":"guest"].logo.src=t.image_path}),o.on("create-scoreboard",(e,t)=>{l(t)}),o.on("keyboard-input",(e,t)=>{if(!document.activeElement.matches("input[type=text]"))switch(t.action){case"home":switch(t.arg){case"increase":u(a,!0,1);break;case"decrease":u(a,!0,-1)}break;case"guest":switch(t.arg){case"increase":u(a,!1,1);break;case"decrease":u(a,!1,-1)}break;case"clock":switch(t.arg){case"toggle":i(a);break;case"increase":s(a,1e3,!0);break;case"decrease":s(a,-1e3,!0)}break;case"tabs":{let e=m(),r=e.indexOf(a);switch(t.arg){case"next":g(e[(r+1)%e.length]);break;case"new":o.send("create-scoreboard");break;case"previous":{let t=r-1;t<0&&(t=e.length-1),g(e[t]);break}case"close":-1!==r&&o.send("window-op",{id:a,action:"close"})}break}}})},function(e,t){e.exports=
/**
 * @file Main file of get-in-range
 * @license LGPL-3.0
 * @author Gary Kim
 */
function(e,t,r,o){let c=parseFloat(e),n=parseFloat(t),a=parseFloat(r);if(isNaN(n)||isNaN(a)||isNaN(c)){if(o)return NaN;throw"given a argument that is NaN"}if(n>a){if(o)return NaN;throw"provided minimum value is larger then maximum value"}return c<=n?n:c>=a?a:c}}]);
//# sourceMappingURL=control.js.map