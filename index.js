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

let workM = generateNumberSeq(58316).slice(0,5);
console.table(workM)

for (let y = 0; y < workM.length; y++){
    for (let x = 0; x < workM[y].length; x++){
        console.log(`Checking for x:${x} y:${y} ${workM[y][x]}`)

        let right = workM[y] != undefined && workM[y][x+2] !=undefined? workM[y][x+2] : "None"
        let bottom =  workM[y+1] != undefined && workM[y+1][x+1]!= undefined?  workM[y+1][x+1] : "None"
        let left = workM[y] != undefined && workM[y][x-2]!=undefined? workM[y][x-2] : "None"
        let top = workM[y-1] != undefined && workM[y-1][x-1]!=undefined? workM[y-1][x-1] : "None"
        console.log(bottom == workM[y][x])
        console.log(top == workM[y][x])
        switch (workM[y][x]){
            case right:
                console.log("Match on the right")
            case bottom:
                console.log("Match on the bottom")
            case left:
                console.log("Match on the left")
            case top:
                console.log("Match on the top")
        }



    }

    }
