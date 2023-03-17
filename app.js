// variables
let sizeLX = 1;
let sizeLY = 1;
let counter = 0;
let pause = false;
let timeOut;
const hide='hide';

//posible variables
let rows;
let columns;
let grid=new Array(rows);
let nextGrid=new Array(columns);
let layoutSizeContent = [];

const layoutsTGOL = {
    1: "color1",
    2: "color2",
    3: "color3",
    4: "color4",
    5: "color5",
};

// Dom variables
let layout = document.getElementById("layoutTGOL");
let btnStart = document.getElementById("buttonStart");
const btnClear=document.getElementById("buttonClear");
const btnRandom=document.getElementById("buttonRandom");

function generateCellContent() {
    layoutSizeContent = [];
    for (let sizeYPos = 1; sizeYPos <= sizeLY; sizeYPos++) {
        for (let sizeXPos = 1; sizeXPos <= sizeLX; sizeXPos++) {
            const xyData = {
                x: sizeXPos,
                y: sizeYPos,
                id: `cellX${sizeXPos}Y${sizeYPos}`,
                state: 'death'
            }
            layoutSizeContent.push(xyData);
        }
    }

    console.log(layoutSizeContent);
}

function sectionLayout(sizeX, sizeY, newGridId) {
    const gridId = document.getElementById(newGridId);

    layoutSizeContent.forEach( (element, index) => {
        if (element.x > 1 && element.x < sizeLX && element.y > 1 && element.y < sizeLY) {
            const newCell = document.createElement('section');
            newCell.setAttribute('id', `${element.id}`);
            newCell.setAttribute('class', `cell ${element.state}`);
            newCell.setAttribute('onclick', `cellStateChange(${index})`)
            gridId.appendChild(newCell);
        }
    });
    // for (let indexX = 1; indexX <= sizeX; indexX++) {
    //     for (let indexY = 1; indexY<= sizeY; indexY++) {
    //         const newCell = document.createElement('section');
    //         newCell.setAttribute('id', `cellX${indexX}Y${indexY}`);
    //         newCell.setAttribute('class', `cell death`);
    //         newCell.setAttribute('onclick', 'cellStateChange(this.id)')
    //         gridId.appendChild(newCell);
    //     }
    // }
}

function gridLayout(width, height) {
    sizeLX = width;
    sizeLY = height;

    generateCellContent();

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
        grid-template-columns: repeat(${width-2}, 1fr);
        grid-template-rows: repeat(${height-2}, 1fr);
    }`;
    document.getElementsByTagName("head")[0].appendChild(styleLayout);
    const newLayout = document.createElement("section");
    newLayout.setAttribute("id", "layoutSize");
    newLayout.setAttribute("class", "grid-layout-TGOL");
    layout.appendChild(newLayout);
    sectionLayout(width, height, gridId);
}

function cellStateChange(elementId) {
    const cell = document.getElementById(elementId);

    cell.classList[1] === "death" ? alive(cell) : death(cell);
}

function random() {
    deathAll();
    const size = Math.floor(Math.random() * (sizeLX * sizeLY - 50)) + 1;
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
    cell.classList.remove("death");
    cell.classList.add("alive");
}

function death(cell) {
    cell.classList.remove("alive");
    cell.classList.add("death");
}

// initialize and generate principal layout
(()=>{
    gridLayout(35,13);
})();

//Functions to play the game

function start() {
    if (btnStart.value == "Start" || btnStart.value == "Continue") {
        btnStart.value = "Pause";
        btnClear.classList.remove(hide);
        btnRandom.classList.add(hide);
    } else {
        btnStart.value = "Continue";
    }
    increase();
}

function play() {
    counter += 1;
    document.getElementById("labelLife").innerHTML = "Generation: "+counter;
    if (pause) {
        timeOut = setTimeout(play, 1000);
    }
}

function stop() {
    pause = false;
}

function increase() {
    if (pause) {
        pause = false;
        clearTimeout(timeOut);
    } else {
        pause = true;
        play();
    }
}

//reset the game
function clearBoard(){
    pause=false;
    btnStart.value="Start";
    clearTimeout(timeOut);
    //poner todas las celulas en light
    //poner el arreglo vacio.
    var cells=[];
    //crear un ciclo for para agregar todas las celulas light en "cells"


    resetGrid();
}

function resetGrid(){
    for(var i=0;i<rows;i++){
        for(var j=0;j<columns;j++){
            grid[i][j]=0;
            nextGrid[i][j]=0;
        }
    }
}
(()=>{
    gridLayout(35,13);
})();
