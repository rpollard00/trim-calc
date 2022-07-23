#!/usr/bin/node


// optimally fit cuts into a given board length
// e.g. you need to know how many 144 baseboards needed
// given a list of lengths, optimally fit those lengths into
// max board length

// read a file with the format
// firstline = max material length
// all subsequent lines are read into an array, and then sorted descending

// create a counter for how many boards you need
// create a remaining material length variable, set to value of max
// create an array that will hold all the arrays of cuts that fit into the material length

// create a sub array to hold the cuts for a given single max material length
// search array, find longest value that fits into max material length
// remove that value from the original cut list array
// add that value to the current optimal cut list array
// subtract that value from remaining material length
// if no more cuts fit into that given max material length, 
// start process again

const fs = require('fs');

// read the contents of the input file
fs.readFile('baseboards.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    
    // convert string to array of integer values
    const materialArray = data.split('\n').map( val => parseInt(val));

    // grab the max material length as the first value
    const maxMaterialLength = materialArray.shift();

    // sort descending
    let sortedMaterialArray = materialArray.sort((a, b) => b - a);
    const rawMaterialLength = sumArray(sortedMaterialArray);
    
    // this is the number of boards, with cuts as sub arrays
    let cutArrays = [];
    
    // while any cuts remain to be sorted to a board
    while (sortedMaterialArray.length > 0) {
        let remainingMaterialLength = maxMaterialLength;
        let cutArray = [];
        
        for (let index = 0; index < sortedMaterialArray.length; index++) {
        //sortedMaterialArray.forEach((val, index, array) => {
            if (sortedMaterialArray[index] <= remainingMaterialLength) {
                remainingMaterialLength -= sortedMaterialArray[index];
                cutArray.push(sortedMaterialArray[index]);
                // remove from sortedMaterialArray
                sortedMaterialArray.splice(index, 1);
                index = 0;
                //elementsRemove.push(val);
            } 
            if (!arrayContainsCandidate(sortedMaterialArray,remainingMaterialLength)) {
                // exit the loop
                break;
            } 
        }
        cutArrays.push(cutArray);
    }
    
    // pretty print
    cutArrays.forEach((val) => console.log(`Cuts: ${val.join(', ')} : Total Length ${sumArray(val)}`));
    console.log(`\nBoards of length ${maxMaterialLength}: ${cutArrays.length}`);
    wastePercent = 100 - ((rawMaterialLength/(cutArrays.length*maxMaterialLength))*100);
    console.log(`Waste % ${wastePercent.toFixed(2)}`)
});


function arrayContainsCandidate(array, value) {
    const lessthanconstraint = (x) => x <= value;
    return array.some(lessthanconstraint)
}

function sumArray(array) {
    // calls the callback function once for each element in the array
    // callback function written adds previous value to current value
    const sum = array.reduce((partialSum, a) => partialSum + a, 0); // 0 is initial value to avoid empty
    return sum;
}
