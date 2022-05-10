"use strict";

// PARAMETERS
var GAME_FIELD_SIZE = 5;

function createMatrix(list) {
  var matrix = [];
  var subListIndex = 0;

  for (var i = 0; i < list.length; i++) {
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
  var currentGenNum = seed;
  var result = [];

  for (var i = 0; i < 100; i++) {
    currentGenNum = currentGenNum / seed * 0.99 % 32 * 5000000;
    result.push(Number(String(currentGenNum)[0]));
  }

  return createMatrix(result);
}

var gameBoard = generateNumberSeq(58316).slice(0, 5);
console.log(gameBoard);

function checkCoords(x, y, replaceVal, direction) {
  var stepAmount = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var result = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {
    steps: [],
    value: false
  };
  var x2 = x;
  var y2 = y;
  var step = stepAmount;
  var directionKeyWord = direction.toLowerCase();

  if (directionKeyWord == "right") {
    x2 += step;
  } else if (directionKeyWord == "left") {
    x2 -= step;
  } else if (directionKeyWord == "top") {
    y2 -= step;
  } else if (directionKeyWord == "bottom") {
    y2 += step;
  }

  if (gameBoard[y2] !== undefined && gameBoard[y2][x2] !== undefined && replaceVal == gameBoard[y2][x2]) {
    result.value = true;
    result.steps.push(step);
    step += 1;
    return checkCoords(x, y, replaceVal, directionKeyWord, step, result);
  }

  return result;
}

function singleIntCheck(x, y, replaceVal) {
  var right = checkCoords(x, y, replaceVal, "right");
  var left = checkCoords(x, y, replaceVal, "left");
  var top = checkCoords(x, y, replaceVal, "top");
  var bottom = checkCoords(x, y, replaceVal, "bottom");

  if (right.value) {
    console.log("row: ".concat(y, ", coloumn ").concat(x, " is right ").concat(right.steps));
  }

  if (top.value) {
    console.log("row: ".concat(y, ", coloumn ").concat(x, " is top ").concat(top.steps));
  }

  if (bottom.value) {
    console.log("row: ".concat(y, ", coloumn ").concat(x, " is bottom ").concat(bottom.steps));
  }

  if (left.value) {
    console.log("row: ".concat(y, ", coloumn ").concat(x, " is left ").concat(left.steps));
  }

  console.log("========");
}

for (var y = 0; y < gameBoard.length; y++) {
  for (var x = 0; x < gameBoard[y].length; x++) {
    singleIntCheck(x, y, gameBoard[y][x + 1]);
  }
} // for (let y = 0; y < gameBoard.length; y++){
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