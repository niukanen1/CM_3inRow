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
	createMatrix(result);
}


generateNumberSeq(58316);
// const fullSeq = generateNumberSeq(58316).reverse(); 
// const gameBoard = fullSeq.slice(fullSeq.length - 5 , fullSeq.length);


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
    }

    // const replaceVal = gameBoard[replaceValCoords.y][replaceValCoords.x];
    const right = checkCoords(x,y, replaceValCoords, "right"); 
    const left = checkCoords(x,y, replaceValCoords, "left"); 
    const top = checkCoords(x,y, replaceValCoords, "top"); 
    const bottom = checkCoords(x,y, replaceValCoords, "bottom"); 

    if (right.value) {  
        console.log(`row: ${y}, coloumn ${x} is right ${right.steps}`)
    }
    if (top.value) { 
        console.log(`row: ${y}, coloumn ${x} is top ${top.steps}`)
    }
    if (bottom.value) { 
        console.log(`row: ${y}, coloumn ${x} is bottom ${bottom.steps}`)
    }
    if (left.value) { 
        console.log(`row: ${y}, coloumn ${x} is left ${left.steps}`)
    }
    console.log("========")
}

// for (let y = 0; y < gameBoard.length; y++) {
// 	for (let x = 0; x < gameBoard[y].length; x++) {
//         singleIntCheck(x, y, {y: y, x: x-1},)
//     }
// }