// PARAMETERS 

const GAME_FIELD_SIZE = 5; 


function createMatrix(list) {
    const matrix = []; 
    let subListIndex = 0; 
    for (let i = 0; i < list.length; i++) {
        if (i!=0 && i % GAME_FIELD_SIZE == 0) { 
            subListIndex ++;
        }
        if (i == 0 || (i % GAME_FIELD_SIZE) == 0 ) { 
            matrix[subListIndex] = []
            matrix[subListIndex].push(list[i]);
        } else {
            matrix[subListIndex].push(list[i]);
        }
    }
    return matrix 
}   

function generateNumberSeq(seed) { 
    let currentGenNum = seed; 
    const result = []; 

    for (let i = 0; i < 100; i++) { 
        currentGenNum = (currentGenNum / seed * 0.99 % 32) * 5000000
        result.push(Number(String(currentGenNum)[0]))
    }
    return createMatrix(result) 
}

generateNumberSeq(58316);