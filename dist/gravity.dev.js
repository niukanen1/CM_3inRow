"use strict";

var _require = require("./index"),
    generateNumberSeq = _require.generateNumberSeq,
    singleIntCheck = _require.singleIntCheck;

var SIZE = 5;
var gameBoard = generateNumberSeq(58316).reverse();

function displayGameBoard(seq) {
  console.log(seq.slice(seq.length - SIZE), seq.length);
}

;

for (var y = 0; y < gameBoard.length; y++) {
  for (var x = 0; x < gameBoard[y].length; x++) {
    singleIntCheck(x, y, {
      y: y,
      x: x - 1
    }, gameBoard);
  }
}