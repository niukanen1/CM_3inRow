// PARAMETERS

const GAME_FIELD_SIZE = 5;

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

	for (let i = 0; i < 100; i++) {
		currentGenNum = (((currentGenNum / seed) * 0.99) % 32) * 5000000;
		result.push(Number(String(currentGenNum)[0]));
	}
	return createMatrix(result);
}

const gameBoard = generateNumberSeq(58316).slice(0, 5);
console.log(gameBoard);


function checkCoords(x, y, direction, stepAmount = 1, result = {steps: [], value: false}) {
    let x2 = x;
    let y2 = y;
    let step = stepAmount;
    let directionKeyWord = direction.toLowerCase();

    if (directionKeyWord == "right") { 
        x2 += step;
    } else if (directionKeyWord == "left") { 
        x2 -= step;
    } else if (directionKeyWord == "top") { 
        y2 -= step;
    } else if (directionKeyWord == "bottom") { 
        y2 += step;
    }

    if ((gameBoard[y2] !== undefined && gameBoard[y2][x2] !== undefined) && gameBoard[y][x] == gameBoard[y2][x2]) { 
        console.log(gameBoard[y][x] + " " + gameBoard[y2][x2])
        result.value = true; 
        result.steps.push(step);
        step += 1
        return checkCoords(x, y, directionKeyWord, step, result);
    }

    return result
}

function singleIntCheck(x, y) {
    const right = checkCoords(x,y, "right"); 
    const left = checkCoords(x,y, "left"); 
    const top = checkCoords(x,y, "top"); 
    const bottom = checkCoords(x,y, "bottom"); 
    
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

for (let y = 0; y < gameBoard.length; y++) {
	for (let x = 0; x < gameBoard[y].length; x++) {
        singleIntCheck(x, y)
    }
}


// for (let y = 0; y < gameBoard.length; y++){
//     for (let x = 0; x < gameBoard[y].length; x++){
//         console.log(`Checking for x:${x} y:${y} --- value: ${gameBoard[y][x]}`)

//         let right = gameBoard[y] != undefined && gameBoard[y][x+2] !=undefined ? gameBoard[y][x+2] : "None"
//         let bottom =  gameBoard[y+1] != undefined && gameBoard[y+1][x+1]!= undefined ?  gameBoard[y+1][x+1] : "None"
//         let left = gameBoard[y] != undefined && gameBoard[y][x-2]!=undefined ? gameBoard[y][x-2] : "None"
//         let top = gameBoard[y-1] != undefined && gameBoard[y-1][x-1]!=undefined ? gameBoard[y-1][x-1] : "None"
//         console.log(`BOTTOM: ${bottom == gameBoard[y][x]}`)
//         console.log(`TOP: ${top == gameBoard[y][x]}`)
//         switch (gameBoard[y][x]){
//             case right:
//                 console.log("Match on the right")
//                 break;
//             case bottom:
//                 console.log("Match on the bottom");
//                 break;
//             case left:
//                 console.log("Match on the left")
//                 break;
//             case top:
//                 console.log("Match on the top")
//                 break;
//         }
//         console.log("===============");

//     }

//     }
