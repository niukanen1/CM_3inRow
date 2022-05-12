// PARAMETERS

const GAME_FIELD_SIZE = 5;

function createVerMatrix(list) { 
    const matrix = [];
    let subListIndex = 0;

    for (let i = 0; i < GAME_FIELD_SIZE; i++) { 
        matrix.push([]);
    }
    for (let i = 0; i < list.length; i++) { 
        if (subListIndex < GAME_FIELD_SIZE) { 
            matrix[subListIndex].push(list[i]);
        }
        if (i % GAME_FIELD_SIZE == 0 && subListIndex < GAME_FIELD_SIZE) { 
            subListIndex++;
        } else if (subListIndex >= GAME_FIELD_SIZE) { 
            subListIndex = 0
        }
    }
    return matrix
}
function createMatrix(list) {
	const matrix = [];
	let subListIndex = 0;
	for (let i = 0; i < list.length; i++) {
		if (i != 0 && i % GAME_FIELD_SIZE == 0) {
			subListIndex++;
		}
		if (i == 0 || i % GAME_FIELD_SIZE == 0) {
			matrix[subListIndex] = [];
			matrix[subListIndex].push(list[i]);
		} else {
			matrix[subListIndex].push(list[i]);
		}
	}
	return matrix;
}

function generateNumberSeq(seed) {
	let currentGenNum = seed;
	const result = [];


    // INT sequence 
	for (let i = 0; i < 100; i++) {
		currentGenNum = (((currentGenNum / seed) * 0.99) % 32) * 5000000;
		result.push(Number(String(currentGenNum)[0]));
	}

    // can be changed to createVerMatrix(result) or createMatrix(result)
	return createVerMatrix(result);
}

function getRelativeDirection(coord1, coord2) { 
    const x1 = coord1.x
    const y1 = coord1.y
    const x2 = coord2.x
    const y2 = coord2.y

    if (x1 == x2 && y1 == y2) { 
        return "equal"
    }

    if (y1 == y2) { 
        if ((x1 - x2) < 0 ) { 
            return "right"
        } else { 
            return "left"
        }
    } else if (x1 == x2) { 
        if (y1 - y2 < 0) { 
            return "bottom"
        } else { 
            return "top"
        }
    }
}

function checkCoords(x, y, replaceValCoords, direction, stepAmount = 1, result = {steps: [], value: false}) {
    if (gameBoard[replaceValCoords.y] == undefined || gameBoard[replaceValCoords.y][replaceValCoords.x] == undefined) {
        return result
    }
    let x2 = x;
    let y2 = y;
    let step = stepAmount;
    let directionKeyWord = direction.toLowerCase();
    const replaceVal = gameBoard[replaceValCoords.y][replaceValCoords.x]
    const relativeDirection = getRelativeDirection({x: x, y: y}, replaceValCoords);

    let sideLimit = replaceVal == gameBoard[y][x] ? "none" : relativeDirection; 

    if (directionKeyWord == "right" && sideLimit != "right") { 
        x2 += step;
    } else if (directionKeyWord == "left" && sideLimit != "left") { 
        x2 -= step;
    } else if (directionKeyWord == "top" && sideLimit != "top") { 
        y2 -= step;
    } else if (directionKeyWord == "bottom" && sideLimit != "bottom") { 
        y2 += step;
    }

    if ((gameBoard[y2] !== undefined && gameBoard[y2][x2] !== undefined) && replaceVal == gameBoard[y2][x2]) { 
        result.value = true;
        result.steps.push(step);
        step += 1
        return checkCoords(x, y, replaceValCoords, directionKeyWord, step, result);
    }

    return result
}



function singleIntCheck(x, y, replaceValCoords) {
    if (gameBoard[replaceValCoords.y] === undefined || gameBoard[replaceValCoords.y][replaceValCoords.x] == undefined) {
        return 
        // `\nSKIPPED {y: ${replaceValCoords.y} x: ${replaceValCoords.x}} \n`
    }

    // const replaceVal = gameBoard[replaceValCoords.y][replaceValCoords.x];
    const right = checkCoords(x,y, replaceValCoords, "right"); 
    const left = checkCoords(x,y, replaceValCoords, "left"); 
    const top = checkCoords(x,y, replaceValCoords, "top"); 
    const bottom = checkCoords(x,y, replaceValCoords, "bottom");

    const result = { 
        coords: { 
            y: y,
            x: x, 
        }, 
        checkedValue: gameBoard[replaceValCoords.y][replaceValCoords.x], 
        collisions: { 
            right: right, 
            left: left, 
            top: top, 
            bottom: bottom
        }
    }

    return result
}


function getCoordsToRm(checkedIntObj) { 
    const coordsToRemove = {
        right: [], 
        left: [], 
        top: [], 
        bottom: [],
        own: []
    }
    let stepsHor = 0; 
    let stepsVer = 0; 
    // console.log(`POS: y: ${checkedIntObj.coords.y}, x: ${checkedIntObj.coords.x}`)
    // console.log("value: " + checkedIntObj.checkedValue);
    // if (checkedIntObj.collisions.right.value || checkedIntObj.collisions.left.value || checkedIntObj.collisions.top.value || checkedIntObj.collisions.bottom.value) { 
    //     // coordsToRemove.own.push({y: checkedIntObj.coords.y, x: checkedIntObj.coords.x})
    // }
    
    for (let side in checkedIntObj.collisions) { 
 
        // console.log("side : " + side); 
        for (let step of checkedIntObj.collisions[side].steps) { 
            if (side == "top" || side == "bottom") { 
                    stepsVer++
            }
            if (side == "right" || side == "left") { 
                stepsHor++; 
            }
            // console.log(checkedIntObj.collisions[side].steps.length)
            // console.log("steps : " + step)
            switch (side) { 
                case "right" : 
                    coordsToRemove[side].push({y: checkedIntObj.coords.y , x: checkedIntObj.coords.x + step})
                    break
                case "left": 
                    coordsToRemove[side].push({y: checkedIntObj.coords.y , x: checkedIntObj.coords.x - step})
                    break
                case "top" : 
                    coordsToRemove[side].push({y: checkedIntObj.coords.y - step , x: checkedIntObj.coords.x})
                    break
                case "bottom" : 
                    coordsToRemove[side].push({y: checkedIntObj.coords.y + step , x: checkedIntObj.coords.x})
                    break
            } 

        }
        
    }
    if (stepsHor >= 2 || stepsVer >= 2) { 
        coordsToRemove.own.push({y: checkedIntObj.coords.y, x: checkedIntObj.coords.x})
    }

    if (stepsHor >= 2 && stepsVer < 2) { 
        coordsToRemove.bottom = [];
        coordsToRemove.top = [];
    }
    if (stepsVer >= 2 && stepsHor < 2) { 
        coordsToRemove.left = [];
        coordsToRemove.right = [];
    } 
    if (stepsVer < 2) { 
        coordsToRemove.top = []; 
        coordsToRemove.bottom = [];
    } 
    if (stepsHor < 2) { 
        coordsToRemove.left = []; 
        coordsToRemove.right = [];
    } 

    // console.log("\n============")
    // console.log(checkedIntObj.coords)
    // console.log("Value: " + checkedIntObj.checkedValue)
    console.log("Ver steps " + stepsVer); 
    console.log("Hor steps " + stepsHor);
    console.log(coordsToRemove)
    // console.log("============\n")
    return coordsToRemove
}

function removeItemsByCoords(sideCoords) { 
    for (let side in sideCoords ) { 
        // console.log(coords[side])
        for (let coord of sideCoords[side]) { 
            console.log(coord)
            gameBoard[coord.y][coord.x] = 0
        }
        
    } 
    console.log(gameBoard)
}

function updateMatrix(fullList) {
    let subListIndex = 0; 
    let updatedFullList = [...fullList];
    const GameBoard = [[],[],[],[],[]];
    for (let i = 0; i < fullList.length; i++) {
        for (let j = 0; j < 5; j++)  {
            GameBoard[i].push(fullList[i][j]);
            updatedFullList[i].shift()
        }
    }
    return {
        updatedGameBoard: GameBoard, 
        updatedFullList: updatedFullList,
    }
}

function isUndefined(toCheck) { 
    return toCheck === undefined; 
}  


let fullSeq = generateNumberSeq(58316).reverse();

fullSeq = updateMatrix(fullSeq).updatedFullList;
let gameBoard = updateMatrix(fullSeq).updatedGameBoard

for (let y = 0; y < gameBoard.length; y++) {
    for (let x = 0; x < gameBoard[y].length; x++) {
        console.log(`TAGRET::: y: ${y} x: ${x}`)
        let check = singleIntCheck(x, y, {y: y, x: x}); 
        if (!isUndefined(check)) { 
            removeItemsByCoords(getCoordsToRm(check))
        }
    }
}

