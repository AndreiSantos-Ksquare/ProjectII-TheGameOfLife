// variables
let sizeLX = 1;
let sizeLY = 1;

const layoutsTGOL = {
    1: "color1",
    2: "color2",
    3: "color3",
    4: "color4",
    5: "color5",
}

// Dom variables
let layout = document.getElementById("layoutTGOL");

function sectionLayout(sizeX, sizeY, newGridId) {
    const gridId = document.getElementById(newGridId);
    for (let indexX = 1; indexX <= sizeX; indexX++) {
        for (let indexY = 1; indexY<= sizeY; indexY++) {
            const newCell = document.createElement('section');
            newCell.setAttribute('id', `cellX${indexX}Y${indexY}`);
            newCell.setAttribute('class', `cell death`);
            newCell.setAttribute('onclick', 'cellStateChange(this.id)')
            gridId.appendChild(newCell);
        }
    }
}

function gridLayout(width, height) {
    sizeLX = width;
    sizeLY = height;
    let gridId = 'layoutSize';
    document.getElementById(gridId) ? document.getElementById(gridId).remove() : null;
    let styleLayout = document.createElement('style');
    styleLayout.type = 'text/css';
    styleLayout.innerHTML = 
    `.grid-layout-TGOL {
        place-items: center;
        align-items: center;
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-columns: repeat(${width}, 1fr);
        grid-template-rows: repeat(${height}, 1fr);
    }`;
    document.getElementsByTagName('head')[0].appendChild(styleLayout);
    const newLayout = document.createElement('section');
    newLayout.setAttribute('id', 'layoutSize');
    newLayout.setAttribute('class', 'grid-layout-TGOL');
    layout.appendChild(newLayout);
    sectionLayout(width, height, gridId);
}

function cellStateChange(elementId) {
    const cell = document.getElementById(elementId);

    function death() {
        cell.classList.remove('alive');
        cell.classList.add('death');
    }

    cell.classList[1] === 'death' ? alive(cell) : death();
}

function random() {
    deathAll();
    const size = Math.floor(Math.random() * ((sizeLX * sizeLY) - 50)) + 1;
    for (let count = 1; count < size; count++) {
        const posX = Math.floor(Math.random() * sizeLX) + 1;
        const posY = Math.floor(Math.random() * sizeLY) + 1;
        let sectionID = `cellX${posX}Y${posY}`;
        const cell = document.getElementById(sectionID);
        alive(cell);
    }
}

function deathAll() {
    gridLayout(sizeLX, sizeLY);
}

function alive(cell) {
    cell.classList.remove('death');
    cell.classList.add('alive');
}

// initialize and generate principal layout
(()=>{
    gridLayout(33,11);
})();