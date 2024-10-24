const sun = document.querySelector('.sun');
const skybarDiv = document.querySelector('.skybars');
const sky = document.querySelector('.sky');
const ground = document.querySelector('.ground');
const vertical = document.getElementById('vertical');
const mountainWrapper = document.querySelector('.mountain-wrapper');

makeVerticalGroundHr();
makeHorizontalGroundHr();
makeSunBars();
makeSkyBars();
createMountains();

function makeHorizontalGroundHr() {
    for (let hor = 1; hor <= 20; hor++) {
        ground.innerHTML += `<hr class="horizontal-hr" data="hor ${hor}">`;
    }   
}

function makeVerticalGroundHr() {
    for (let vert = 1; vert <= 20; vert++) {
        vertical.innerHTML += `<hr class="vertical-hr" data="vert ${vert}">`;
    }
}

function makeSunBars() {
    for (let bar = 1; bar <= 20; bar++) {
        sun.innerHTML += `<hr class="sunbar-hr" data="sunbar ${bar}">`;
    }
}

function makeSkyBars() {
    for (let skybar = 1; skybar <= 20; skybar++) {
        skybarDiv.innerHTML += `<hr class="skybar-hr" data="${skybar}">`;
    } 
}

function createMountains() {
    for (m = 1; m <= 4; m++) {

        const newRow = document.createElement('div');
        newRow.classList.add('mountain-row');
        
        for (mo = 1; mo <= 5; mo++) {
            const newMountain = document.createElement('hr');
            newMountain.classList.add('mountain');
            newRow.appendChild(newMountain);
        }

        mountainWrapper.appendChild(newRow);
    }
}

setInterval( ()=> {

    sky.classList.add('sky-animate-thunder');

    setTimeout( () => {
        sky.classList.remove('sky-animate-thunder');
    }, 2000);

}, 9000);