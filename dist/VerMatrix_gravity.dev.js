"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// PARAMETERS
var GAME_FIELD_SIZE = 5;

var _require = require('./gravity'),
    gravity = _require.gravity;

var N = 10;
var M = 40;
var points = 0;
var wins = 0;
var loses = 0;

var fs = require("fs");

var name = 0;

function CreateJsonFile() {
  var dict = {
    matrix: previos_Matrix,
    //gameBoard,
    loading: fullSeq,
    points: points
  };
  var dictstring = JSON.stringify(dict);
  fs.writeFileSync("matrixes/".concat(name, ".json"), dictstring);
  name++;
}

function getMotherMatrix() {
  name -= 1;

  if (name >= 0) {
    gameBoard = JSON.parse(fs.readFileSync("matrixes/".concat(name, ".json")))["matrix"];
    fullSeq = JSON.parse(fs.readFileSync("matrixes/".concat(name, ".json")))["loading"];
    points = Number(JSON.parse(fs.readFileSync("matrixes/".concat(name, ".json")))["points"]); //console.log(gameBoard)

    return true;
  } else {
    return false;
  }
}

function createVerMatrix(list) {
  var matrix = [];
  var subListIndex = 0;

  for (var i = 0; i < GAME_FIELD_SIZE; i++) {
    matrix.push([]);
  }

  for (var _i = 0; _i < list.length; _i++) {
    if (subListIndex < GAME_FIELD_SIZE) {
      matrix[subListIndex].push(list[_i]);
    }

    if (_i % GAME_FIELD_SIZE == 0 && subListIndex < GAME_FIELD_SIZE) {
      subListIndex++;
    } else if (subListIndex >= GAME_FIELD_SIZE) {
      subListIndex = 0;
    }
  }

  return matrix;
}

function generateNumberSeq(seed) {
  var currentGenNum = seed;
  var result = []; // INT sequence

  for (var i = 0; i < 1000; i++) {
    // currentGenNum = (((currentGenNum / seed) * 0.99) % 32) * 5000000;
    currentGenNum = (Math.cos(currentGenNum) - GAME_FIELD_SIZE) * 1000 / (GAME_FIELD_SIZE * 10);
    var num = Number(String(currentGenNum)[5]);

    if (num > GAME_FIELD_SIZE) {
      result.push(parseInt(Math.abs(num - GAME_FIELD_SIZE)));
    } else {
      result.push(num);
    }
  } // can be changed to createVerMatrix(result) or createMatrix(result)


  return createVerMatrix(result);
}

function getRelativeDirection(coord1, coord2) {
  var x1 = coord1.x;
  var y1 = coord1.y;
  var x2 = coord2.x;
  var y2 = coord2.y;

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

function checkCoords(x, y, replaceValCoords, direction) {
  var stepAmount = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var result = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {
    steps: [],
    value: false
  };

  if (gameBoard[replaceValCoords.y] == undefined || gameBoard[replaceValCoords.y][replaceValCoords.x] == undefined) {
    return result;
  }

  var x2 = x;
  var y2 = y;
  var step = stepAmount;
  var directionKeyWord = direction.toLowerCase();
  var replaceVal = gameBoard[replaceValCoords.y][replaceValCoords.x];
  var relativeDirection = getRelativeDirection({
    x: x,
    y: y
  }, replaceValCoords);
  var sideLimit = replaceVal == gameBoard[y][x] ? "none" : relativeDirection;

  if (directionKeyWord == "right" && sideLimit != "right") {
    x2 += step;
  } else if (directionKeyWord == "left" && sideLimit != "left") {
    x2 -= step;
  } else if (directionKeyWord == "top" && sideLimit != "top") {
    y2 -= step;
  } else if (directionKeyWord == "bottom" && sideLimit != "bottom") {
    y2 += step;
  }

  if (gameBoard[y2] !== undefined && gameBoard[y2][x2] !== undefined && replaceVal == gameBoard[y2][x2]) {
    result.value = true;
    result.steps.push(step);
    step += 1;
    return checkCoords(x, y, replaceValCoords, directionKeyWord, step, result);
  }

  return result;
}

function singleIntCheck(x, y, replaceValCoords) {
  if (gameBoard[replaceValCoords.y] === undefined || gameBoard[replaceValCoords.y][replaceValCoords.x] == undefined) {
    return; // `\nSKIPPED {y: ${replaceValCoords.y} x: ${replaceValCoords.x}} \n`
  } // const replaceVal = gameBoard[replaceValCoords.y][replaceValCoords.x];


  var right = checkCoords(x, y, replaceValCoords, "right");
  var left = checkCoords(x, y, replaceValCoords, "left");
  var top = checkCoords(x, y, replaceValCoords, "top");
  var bottom = checkCoords(x, y, replaceValCoords, "bottom");
  var result = {
    coords: {
      y: y,
      x: x
    },
    checkedValue: gameBoard[replaceValCoords.y][replaceValCoords.x],
    collisions: {
      right: right,
      left: left,
      top: top,
      bottom: bottom
    }
  };
  return result;
}

function getCoordsToRm(checkedIntObj) {
  var coordsToRemove = {
    right: [],
    left: [],
    top: [],
    bottom: [],
    own: []
  };
  var stepsHor = 0;
  var stepsVer = 0; // console.log(`POS: y: ${checkedIntObj.coords.y}, x: ${checkedIntObj.coords.x}`)
  // console.log("value: " + checkedIntObj.checkedValue);
  // if (checkedIntObj.collisions.right.value || checkedIntObj.collisions.left.value || checkedIntObj.collisions.top.value || checkedIntObj.collisions.bottom.value) {
  //     // coordsToRemove.own.push({y: checkedIntObj.coords.y, x: checkedIntObj.coords.x})
  // }

  for (var side in checkedIntObj.collisions) {
    // console.log("side : " + side);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = checkedIntObj.collisions[side].steps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var step = _step.value;

        if (side == "top" || side == "bottom") {
          stepsVer++;
        }

        if (side == "right" || side == "left") {
          stepsHor++;
        } // console.log(checkedIntObj.collisions[side].steps.length)
        // console.log("steps : " + step)


        switch (side) {
          case "right":
            coordsToRemove[side].push({
              y: checkedIntObj.coords.y,
              x: checkedIntObj.coords.x + step
            });
            break;

          case "left":
            coordsToRemove[side].push({
              y: checkedIntObj.coords.y,
              x: checkedIntObj.coords.x - step
            });
            break;

          case "top":
            coordsToRemove[side].push({
              y: checkedIntObj.coords.y - step,
              x: checkedIntObj.coords.x
            });
            break;

          case "bottom":
            coordsToRemove[side].push({
              y: checkedIntObj.coords.y + step,
              x: checkedIntObj.coords.x
            });
            break;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  if (stepsHor >= 2 || stepsVer >= 2) {
    coordsToRemove.own.push({
      y: checkedIntObj.coords.y,
      x: checkedIntObj.coords.x
    });
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
  } // console.log("\n============")
  // console.log(checkedIntObj.coords)
  // console.log("Value: " + checkedIntObj.checkedValue)
  //console.log("Ver steps " + stepsVer);
  //console.log("Hor steps " + stepsHor);
  //console.log(coordsToRemove)
  // console.log("============\n")


  return coordsToRemove;
}

function removeItemsByCoords(sideCoords) {
  var isSomethigDel = false;

  for (var side in sideCoords) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = sideCoords[side][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var coord = _step2.value;
        points += 1;
        gameBoard[coord.y][coord.x] = 0;
        isSomethigDel = true;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }

  if (isSomethigDel) {
    CreateJsonFile();
    gravity(gameBoard, fullSeq);
    console.log(gameBoard); //console.log(fullSeq);

    workWithMatrix();
    previos_Matrix = _toConsumableArray(gameBoard);
    getMotherMatrix();
  }
}

function updateMatrix(fullList) {
  var updatedFullList = _toConsumableArray(fullList);

  var GameBoard = [];

  for (var i = 0; i < GAME_FIELD_SIZE; i++) {
    GameBoard.push([]);
  }

  for (var _i2 = 0; _i2 < fullList.length; _i2++) {
    for (var j = 0; j < GAME_FIELD_SIZE; j++) {
      GameBoard[_i2].push(fullList[_i2][j]);

      updatedFullList[_i2].shift();
    }
  }

  return {
    updatedGameBoard: GameBoard,
    updatedFullList: updatedFullList
  };
}

function isUndefined(toCheck) {
  return toCheck === undefined;
}

function mainAction(x, y) {
  var stepX = 0;
  var stepY = 0;

  for (var i = 0; i < 4; i++) {
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

      case 4:
        stepX = 0;
        stepY = 0;
        break;
    }

    var check = singleIntCheck(x, y, {
      y: y + stepY,
      x: x + stepX
    });

    if (!isUndefined(check)) {
      removeItemsByCoords(getCoordsToRm(check));
    }
  }
} // 58316
// 74610


var fullSeq = generateNumberSeq(58316).reverse();
fullSeq = updateMatrix(fullSeq).updatedFullList;
var gameBoard = updateMatrix(fullSeq).updatedGameBoard;

var previos_Matrix = _toConsumableArray(gameBoard);

function workWithMatrix() {
  if (points > M && name <= N) {
    wins += 1;
    return;
  } else if (name > N) {
    loses += 1;
    return;
  }

  for (var y = 0; y < gameBoard.length; y++) {
    for (var x = 0; x < gameBoard[y].length; x++) {
      mainAction(x, y);
    }
  }
}

workWithMatrix();
console.log(wins);
console.log(loses);