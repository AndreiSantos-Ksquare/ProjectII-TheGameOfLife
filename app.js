// variables
let sizeLX = 1;
let sizeLY = 1;
let counter = 0;
let pause = false;
let timeOut;
let layoutSizeText = '33x11';
const hide = 'hide';
let statePlay = false;

let layoutSizeContent = [];
let cellNeighborsCurent = [];

// Dom variables
const labelGenerationCount = document.getElementById("labelLife");
const labelLayoutSize = document.getElementById("labelSize");
const layout = document.getElementById("layoutTGOL");
const btnStart = document.getElementById("buttonStart");
const btnClear = document.getElementById("buttonClear");
const btnRandom = document.getElementById("buttonRandom");
const btnRestart = document.getElementById("buttonRestart");
const layoutButtons = document.getElementById("layoutButtons");

// Function used to generate dynamic array of objects of the cells
function generateCellContent() {
    layoutSizeContent = [];
    cellNeighborsCurent = [];
    for (let sizeYPos = 1; sizeYPos <= sizeLY; sizeYPos++) {
        for (let sizeXPos = 1; sizeXPos <= sizeLX; sizeXPos++) {
            const xyData = {
                x: sizeXPos,
                y: sizeYPos,
                id: `cellX${sizeXPos}Y${sizeYPos}`,
                state: 'death'
            }
            layoutSizeContent.push(xyData);
            cellNeighborsCurent.push(xyData);
        }
    }
}

// Function used to generate dynamic layout, creating sections for each cell
function sectionLayout(newGridId) {
    const gridId = document.getElementById(newGridId);
    const cellNewContent = statePlay ? cellNeighborsCurent.slice() : layoutSizeContent.slice();
    cellNewContent.forEach( (element, index) => {
        if (element.x > 1 && element.x < sizeLX && element.y > 1 && element.y < sizeLY) {
            const newCell = document.createElement('section');
            newCell.setAttribute('id', `${element.id}`);
            newCell.setAttribute('class', `cell ${element.state}`);
            newCell.setAttribute('type', 'button');
            newCell.setAttribute('onclick', `cellStateChange(${index})`)
            gridId.appendChild(newCell);
        }
    });
}

// Function used to generate the section element who contain all the cells
function gridLayout(width, height, state) {
    sizeLX = width;
    sizeLY = height;
    statePlay = state;

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
    sectionLayout(gridId);
}

// Function used to change the size of the layout using the buttons size
function changeLayout(width, height, size) {
    layoutSizeText = size;
    sizeLX = width;
    sizeLY = height
    labelLayoutSize.innerHTML = `Size: ${layoutSizeText}`;
    generateCellContent();
    gridLayout(width, height, false);
}

// Function used to change cell state to alive or death on grid template
function cellStateChange(positionNumber) {
    const currentCell = layoutSizeContent[positionNumber];
    const cell = document.getElementById(currentCell.id);

    cell.classList[1] === "death" ? alive(cell, positionNumber) : death(cell, positionNumber);
}

// Function used to set alive state to a cell. Called from cellStateChange function
function alive(cell, positionNumber) {
    cell.classList.remove("death");
    cell.classList.add("alive");
    layoutSizeContent[positionNumber].state = 'alive';
    cellNeighborsCurent[positionNumber].state = 'alive';
}

// Function used to set death state to a cell. Called from cellStateChange function
function death(cell, positionNumber) {
    cell.classList.remove("alive");
    cell.classList.add("death");
    layoutSizeContent[positionNumber].state = 'death';
    cellNeighborsCurent[positionNumber].state = 'death';
}

// Function used to generate a random template of alive and death cells on grid template
function random() {
    generateCellContent();
    const size = Math.floor(Math.random() * ((sizeLX * sizeLY) - 60)) + 1;
    for (let count = 1; count < size; count++) {
        const posCell = Math.floor(Math.random() * (layoutSizeContent.length) - 1) + 1;
        layoutSizeContent[posCell].x > 1 && layoutSizeContent[posCell].x < sizeLX && layoutSizeContent[posCell].y > 1 && layoutSizeContent[posCell].y < sizeLY ?
            layoutSizeContent[posCell].state = 'alive' : null;
        cellNeighborsCurent[posCell].x > 1 && cellNeighborsCurent[posCell].x < sizeLX && cellNeighborsCurent[posCell].y > 1 && cellNeighborsCurent[posCell].y < sizeLY ?
            cellNeighborsCurent[posCell].state = 'alive' : null;
    }
    gridLayout(sizeLX, sizeLY, false)
}

//Functions to play the game. Change btnStart value. Hide buttons and disabled cells onclick
function start() {
    layoutButtons.classList.add(hide);
    btnRandom.classList.add(hide);
    btnRestart.classList.remove(hide);
    btnClear.classList.add(hide);
    
    if (btnStart.value == "Start" || btnStart.value == "Continue") {
        buttonsDisabled('');
        btnStart.value = "Pause";
        btnRandom.classList.add(hide);
    } else {
        btnStart.value = "Continue";
        buttonsDisabled('');
    }
    increase();
}

// start setTimeout. Initialize secuence of new generation. Change generation number
function play() {
    playSequence();
    counter += 1;
    labelGenerationCount.innerHTML = "Generation: " + counter;
    if (pause) {
        timeOut = setTimeout(play, 1000);
    }
}

// Get number of alive neighbors and apply rules to each cell.
function playSequence() {
    cellNeighborsCurent.forEach( (element, index) => {
        if (element.x > 1 && element.x < sizeLX && element.y > 1 && element.y < sizeLY) {
            const aliveNeighbor = cellAlive(element, index);
            if (element.state === 'alive') {
                if (aliveNeighbor < 2) {
                    element.state = 'death';
                }

                if (aliveNeighbor === 2 || aliveNeighbor === 3) {
                    element.state = 'alive';
                }

                if (aliveNeighbor > 3) {
                    element.state = 'death';
                }
            }
            
            if (element.state === 'death') {
                if (aliveNeighbor === 3) {
                    element.state = 'alive';
                }
            }
        }
    });
    gridLayout(sizeLX, sizeLY, true)
    buttonsDisabled('');
}

//  Function used to count which neighbors of the cell sent are alive
function cellAlive(element, index) {
    const cellPosX = element.x;
    const cellPosY = element.y;
    let countAliveNeighbor = 0;
    for (let y = (cellPosY - 1); y <= (cellPosY + 1); y++) {
        for (let x = (cellPosX - 1); x <= (cellPosX + 1); x++) {
            cellNeighborsCurent.forEach((neighbor, indexN) => {
                if (neighbor.x === x && neighbor.y === y) {
                    if (index !== indexN) {
                        neighbor.state === 'alive' ? countAliveNeighbor+=1 : null;
                    }
                }
            });
        }
    }
    return countAliveNeighbor
}

// Used to pause the game
function stop() {
    pause = false;
}

// Function used to start and clear the timeout of generation time
function increase() {
    if (pause) {
        pause = false;
        clearTimeout(timeOut);
    } else {
        pause = true;
        play();
    }
}

// Reset the game.
function restart(){
    clearTimeout(timeOut);
    btnClear.classList.remove(hide);
    cellNeighborsCurent = [];
    pause = false;
    counter = 0;
    labelGenerationCount.innerHTML = "Generation: " + counter;
    btnStart.value = "Start";
    
    gridLayout(sizeLX, sizeLY, false);
    buttonsDisabled();
}

// Clear the board.
function clearBoard(){
    counter = 0;
    btnRestart.classList.add(hide);
    btnClear.classList.add(hide);
    labelGenerationCount.innerHTML = "Generation: " + counter;
    layoutSizeText = '33x11';
    layoutButtons.classList.remove(hide);
    btnRandom.classList.remove(hide);
    restart();
    cellNeighborsCurent = []
    changeLayout(35, 13, layoutSizeText);
}

// Function used to disable the cells during the game.
function buttonsDisabled() {
    layoutSizeContent.forEach(element => {
        if (element.x > 1 && element.x < sizeLX && element.y > 1 && element.y < sizeLY) {
            const cellDisabled = document.getElementById(element.id);
            cellDisabled.onclick = '';
        }
    })
}

// Initialize the grid Layout by a default size
(()=>{
    changeLayout(35, 13, layoutSizeText);
})();