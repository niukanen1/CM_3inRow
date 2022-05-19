// PARAMETERS
const prompt = require("prompt-sync")();

const GAME_FIELD_SIZE = Number(process.argv.slice(2)[1]);

const { gravity } = require("./gravity");

const N = 10;
const M = 40;

let points = 0;
let wins = 0;
let loses = 0;

let winRate = {};
for (let i = 0; i <= N; i++) {
	winRate[i] = 0;
}

const fs = require("fs");
let name = 0;
//58316
const seed = Number(process.argv.slice(2)[0]);

let fullSeq = generateNumberSeq(seed).reverse();

fullSeq = updateMatrix(fullSeq).updatedFullList;
let gameBoard = updateMatrix(fullSeq).updatedGameBoard;
let previos_Matrix = [...gameBoard];

function CreateJsonFile() {
	let dict = {
		matrix: previos_Matrix, //gameBoard,
		loading: fullSeq,
		points: points,
	};
	const dictstring = JSON.stringify(dict);

	fs.writeFileSync(`matrixes/${name}.json`, dictstring);
	name += 1;
}

function getMotherMatrix() {
	name -= 1;
	if (name >= 0) {
		gameBoard = JSON.parse(fs.readFileSync(`matrixes/${name}.json`))["matrix"];
		fullSeq = JSON.parse(fs.readFileSync(`matrixes/${name}.json`))["loading"];
		points = Number(
			JSON.parse(fs.readFileSync(`matrixes/${name}.json`))["points"]
		);
		//console.log(gameBoard)
		return true;
	} else {
		return false;
	}
}

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
			subListIndex = 0;
		}
	}
	return matrix;
}

function generateNumberSeq(seed) {
	let currentGenNum = seed;
	const result = [];

	// INT sequence
	for (let i = 0; i < 1000; i++) {
		// currentGenNum = (((currentGenNum / seed) * 0.99) % 32) * 5000000;
		currentGenNum =
			((Math.cos(currentGenNum) - GAME_FIELD_SIZE) * 1000) /
			(GAME_FIELD_SIZE * 10);

		let num = Number(String(currentGenNum)[5]);
		if (num != 0) {
			if (num > GAME_FIELD_SIZE) {
				result.push(parseInt(Math.abs(num - GAME_FIELD_SIZE)));
			} else {
				result.push(num);
			}
		} else {
			num = 1;
		}
	}

	// can be changed to createVerMatrix(result) or createMatrix(result)
	return createVerMatrix(result);
}

function getRelativeDirection(coord1, coord2) {
	const x1 = coord1.x;
	const y1 = coord1.y;
	const x2 = coord2.x;
	const y2 = coord2.y;

	if (x1 == x2 && y1 == y2) {
		return "equal";
	}

	if (y1 == y2) {
		if (x1 - x2 < 0) {
			return "right";
		} else {
			return "left";
		}
	} else if (x1 == x2) {
		if (y1 - y2 < 0) {
			return "bottom";
		} else {
			return "top";
		}
	}
}

function checkCoords(
	x,
	y,
	replaceValCoords,
	direction,
	stepAmount = 1,
	result = { steps: [], value: false }
) {
	if (
		gameBoard[replaceValCoords.y] == undefined ||
		gameBoard[replaceValCoords.y][replaceValCoords.x] == undefined
	) {
		return result;
	}
	let x2 = x;
	let y2 = y;
	let step = stepAmount;
	let directionKeyWord = direction.toLowerCase();
	const replaceVal = gameBoard[replaceValCoords.y][replaceValCoords.x];
	const relativeDirection = getRelativeDirection(
		{ x: x, y: y },
		replaceValCoords
	);

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

	if (
		gameBoard[y2] !== undefined &&
		gameBoard[y2][x2] !== undefined &&
		replaceVal == gameBoard[y2][x2]
	) {
		result.value = true;
		result.steps.push(step);
		step += 1;
		return checkCoords(x, y, replaceValCoords, directionKeyWord, step, result);
	}

	return result;
}

function singleIntCheck(x, y, replaceValCoords) {
	if (
		gameBoard[replaceValCoords.y] === undefined ||
		gameBoard[replaceValCoords.y][replaceValCoords.x] == undefined
	) {
		return;
		// `\nSKIPPED {y: ${replaceValCoords.y} x: ${replaceValCoords.x}} \n`
	}

	// const replaceVal = gameBoard[replaceValCoords.y][replaceValCoords.x];
	const right = checkCoords(x, y, replaceValCoords, "right");
	const left = checkCoords(x, y, replaceValCoords, "left");
	const top = checkCoords(x, y, replaceValCoords, "top");
	const bottom = checkCoords(x, y, replaceValCoords, "bottom");

	const result = {
		coords: {
			y: y,
			x: x,
		},
		// checkedValue: gameBoard[replaceValCoords.y][replaceValCoords.x],
        checkedValue: { 
            x: replaceValCoords.x, 
            y: replaceValCoords.y
        },
		collisions: {
			right: right,
			left: left,
			top: top,
			bottom: bottom,
		},
	};

	return result;
}

function getCoordsToRm(checkedIntObj) {
	const coordsToRemove = {
        sides: {
            right: [],
            left: [],
            top: [],
            bottom: [],
            own: [],
        },
        replaceValCoords: { 
            x: checkedIntObj.checkedValue.x,
            y: checkedIntObj.checkedValue.y
        }
	};
    console.log(coordsToRemove.replaceValCoords.y + " " + coordsToRemove.replaceValCoords.x)
	let stepsHor = 0;
	let stepsVer = 0;

	for (let side in checkedIntObj.collisions) {
		// console.log("side : " + side);
		for (let step of checkedIntObj.collisions[side].steps) {
			if (side == "top" || side == "bottom") {
				stepsVer++;
			}
			if (side == "right" || side == "left") {
				stepsHor++;
			}
			// console.log(checkedIntObj.collisions[side].steps.length)
			// console.log("steps : " + step)
			switch (side) {
				case "right":
					coordsToRemove.sides[side].push({
						y: checkedIntObj.coords.y,
						x: checkedIntObj.coords.x + step,
					});
					break;
				case "left":
					coordsToRemove.sides[side].push({
						y: checkedIntObj.coords.y,
						x: checkedIntObj.coords.x - step,
					});
					break;
				case "top":
					coordsToRemove.sides[side].push({
						y: checkedIntObj.coords.y - step,
						x: checkedIntObj.coords.x,
					});
					break;
				case "bottom":
					coordsToRemove.sides[side].push({
						y: checkedIntObj.coords.y + step,
						x: checkedIntObj.coords.x,
					});
					break;
			}
		}
	}
	if (stepsHor >= 2 || stepsVer >= 2) {
		coordsToRemove.sides.own.push({
			y: checkedIntObj.coords.y,
			x: checkedIntObj.coords.x,
		});
	}

	if (stepsHor >= 2 && stepsVer < 2) {
		coordsToRemove.sides.bottom = [];
		coordsToRemove.sides.top = [];
	}
	if (stepsVer >= 2 && stepsHor < 2) {
		coordsToRemove.sides.left = [];
		coordsToRemove.sides.right = [];
	}
	if (stepsVer < 2) {
		coordsToRemove.sides.top = [];
		coordsToRemove.sides.bottom = [];
	}
	if (stepsHor < 2) {
		coordsToRemove.sides.left = [];
		coordsToRemove.sides.right = [];
	}

	// console.log("\n============")
	// console.log(checkedIntObj.coords)
	// console.log("Value: " + checkedIntObj.checkedValue)
	//console.log("Ver steps " + stepsVer);
	//console.log("Hor steps " + stepsHor);
	//console.log(coordsToRemove)
	// console.log("============\n")
	return coordsToRemove;
}

function removeItemsByCoords(sideCoords) {
	let isSomethigDel = false;

	for (let side in sideCoords.sides) {
		for (let coord of sideCoords.sides[side]) {
			points += 1;
            gameBoard[sideCoords.replaceValCoords.y][sideCoords.replaceValCoords.x] = gameBoard[coord.y][coord.x]
			gameBoard[coord.y][coord.x] = 0;
			isSomethigDel = true;
		}
	}

	if (isSomethigDel) {
		CreateJsonFile();

		gravity(gameBoard, fullSeq);
		//workWithMatrix(false)
		workWithMatrix();

		getMotherMatrix();
		previos_Matrix = [...gameBoard];
	}
}

function updateMatrix(fullList) {
	let updatedFullList = [...fullList];
	const GameBoard = [];

	for (let i = 0; i < GAME_FIELD_SIZE; i++) {
		GameBoard.push([]);
	}

	for (let i = 0; i < fullList.length; i++) {
		for (let j = 0; j < GAME_FIELD_SIZE; j++) {
			GameBoard[i].push(fullList[i][j]);
			updatedFullList[i].shift();
		}
	}
	return {
		updatedGameBoard: GameBoard,
		updatedFullList: updatedFullList,
	};
}

function isUndefined(toCheck) {
	return toCheck === undefined;
}

function mainAction(x, y) {
	let stepX = 0;
	let stepY = 0;
	for (let i = 0; i < 4; i++) {
		switch (i) {
			case 0:
				stepX = -1;
				stepY = 0;
				break;
			case 1:
				stepX = 1;
				stepY = 0;
				break;
			case 2:
				stepX = 0;
				stepY = 1;
				break;
			case 3:
				stepX = 0;
				stepY = -1;
				break;
		}
		let check = singleIntCheck(x, y, { y: y + stepY, x: x + stepX });
		if (!isUndefined(check)) {
			removeItemsByCoords(getCoordsToRm(check));
		}
	}
}

function NoShiftChange(x, y) {
	let check = singleIntCheck(x, y, { y: y, x: x });
	if (!isUndefined(check)) {
		let prev = [...gameBoard];
		if (NOSHIFTcoordRM(getCoordsToRm(check))) {
			handleNonUserAction();
		}
	}
}

function NOSHIFTcoordRM(sideCoords) {
	let isSomeToRM = false;
	for (let side in sideCoords.sides) {
		for (let coord of sideCoords.sides[side]) {
			points += 1;
			gameBoard[coord.y][coord.x] = 0;
			isSomeToRM = true;
		}
	}

	if (isSomeToRM) {
		gravity(gameBoard, fullSeq);
		return true;
	}
	return false;
}

function handleNonUserAction() {
	for (let y = 0; y < gameBoard.length; y++) {
		for (let x = 0; x < gameBoard[y].length; x++) {
			NoShiftChange(x, y);
		}
	}
}

// 58316
// 74610

function workWithMatrix() {
	handleNonUserAction();

	if (points >= M && name <= N) {
		winRate[name] += 1;
		wins += 1;
		return;
	} else if (name > N) {
		loses += 1;
		return;
	}

	console.log(`Branch: ${name}\nPoints: ${points}`);
	console.log(gameBoard);

	prompt("");

	for (let y = 0; y < gameBoard.length; y++) {
		for (let x = 0; x < gameBoard[y].length; x++) {
			// handleNonUserAction();
			mainAction(x, y);
		}
	}
}

workWithMatrix();
//console.log(wins)
//console.log(loses)
for (let i = 0; i <= N; i++) {
	if (winRate[i] != 0) {
		let p = (winRate[i] / wins) * 100;
		winRate[i] = Math.round(p * 10) / 10;
	}
}

console.table(winRate);
