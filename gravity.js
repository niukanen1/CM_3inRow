function changeLocation(gameBoard, fullSeq, line, s) {
	if (line > 0) {
		gameBoard[line][s] = gameBoard[line - 1][s];
		changeLocation(gameBoard, fullSeq, line - 1, s);
	} else {
		gameBoard[line][s] = fullSeq[s][0];
		fullSeq[s].shift();
	}
}

function gravity(gameBoard, fullSeq) {
	for (let line in gameBoard) {
		for (let s in gameBoard[line]) {
			if (gameBoard[line][s] == 0) {
				changeLocation(gameBoard, fullSeq, line, s);
			}
		}
	}
}



module.exports = { 
    gravity
}