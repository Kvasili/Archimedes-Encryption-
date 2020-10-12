// js script implementing Archimedes encryption for military coordinates
// usage archimedesDecryption.js
// Author : KV
// Date : 07/04/2020
// check https://mappingsupport.com/p2/coordinates-mgrs-gissurfer-maps.html
// usage : archimedesDecryptionImproved.js





// dreate empty object
function DencryptCoords() {}

//instantiate an instance of object
var dencr = new DencryptCoords();

DencryptCoords.prototype.rollOver = function(myElement, arr){
    // function implementing the rollover of the circles of Archimedes encryption 
    while(arr[0] != myElement){
        arr.push(arr.shift()); 
    }
    return arr; 
}

DencryptCoords.prototype.getRow = function (myArr, indexOfRow){

    // function for extracting specific row from a 2-d array
    var row = [];

    for(var i = 0; i<myArr[0].length; i++) {
        row.push(myArr[indexOfRow][i]); 
    }
    return row;
}



DencryptCoords.prototype.dencryptCoords = function(kleida, encryptedCoords) {
    
    // separate number from characters in encrypredCoords
    var splitCoordsString = encryptedCoords.split(/(\d+)/); 
    //console.log(split_string);
    //split_string[1] // numbers
    //split_string[2] // letters
    
    var circleOfArchimedes = [

        [1,2,3,4,5,6,7,8,9,0],
        ['Α','Ε','Ι','Η','Γ','Ζ','Β','Θ','Δ', 'Κ'],
        ['Ρ','Ν','Π','Υ','Ο','Σ','Μ','Ξ','Τ','Λ'],
        ['Φ','','U','Ψ','','J','Χ','V','','Ω']

    ] ; 

    var surroundingElements = [

        [ [ ], ['A',1],['D',1], ['G',1],['K',1], ['N',''], ['Q',3], ['T',3], ['W',3], ['X',1] ],
        [ [ ], ['B',2], ['E',2], ['H',2], ['L',2], [], ['P',2], ['S',2], ['V',2], ['Y',2] ],
        [ [ ], ['C',3], ['F',3], ['I',3], ['M',3], [], ['O',1], ['R',1], ['U',1],['Z',3]  ]

    ] ;

    // ρυθμιση κύκλων αναλόγως κλείδας 
    var archimedesOrdered = [];

    for(var i=0; i<kleida.length;i++){

        if(i==0){

            archimedesOrdered.push(dencr.rollOver(Number(kleida[0]), dencr.getRow(circleOfArchimedes, 0)));

        }else{

            archimedesOrdered.push(dencr.rollOver(kleida[i], dencr.getRow(circleOfArchimedes, i)));
        }
    }

    // finds decryption for letters of coordinate string 
    var decryptedCoords = ''; 

    //console.log(dDencryptCoords('1ΑΡΦ', '633ΙΓΠΒΕΑ')); // NF353721

    if(splitCoordsString[1].length == 1){ // means that there are two Ns

        return "wrong input decrypted coordinates";

    }else if(splitCoordsString[1].length == 2){ // means that there are two Ns

        decryptedCoords += "NN";

    }else if(splitCoordsString[1].length == 3){ // means there is a N as first or second coordinate letter - needs investigation

        var index = archimedesOrdered[0].findIndex(function(el) { return el == Number(splitCoordsString[1][0]); }); 
        var index2 = archimedesOrdered[0].findIndex(function(el) { return el == Number(splitCoordsString[1][1]); }); 

        for(var j=0;j<surroundingElements.length;j++){

            if(surroundingElements[j][index][0] != 'N' && surroundingElements[j][index][1] == splitCoordsString[1][1] ){

                decryptedCoords += surroundingElements[j][index][0] ; // first letter not N
                decryptedCoords += 'N' ;                              // second letter N
                break;

            }

            if(surroundingElements[0][index][0] == 'N' && surroundingElements[j][index2][1] == splitCoordsString[1][2]){

                decryptedCoords += 'N' ;               // 1st letter N
                decryptedCoords += surroundingElements[j][index2][0] ; // 2nd letter whatever
                break; 
            
            }

        }

    }else{ // 4 digits 

        var index = archimedesOrdered[0].findIndex(function(el) { return el == Number(splitCoordsString[1][0]); });
        //console.log(index1);

        for(var j=0;j<surroundingElements.length;j++){

            if(surroundingElements[j][index][1] == splitCoordsString[1][1]){
                decryptedCoords += surroundingElements[j][index][0] ;
            }
        }

        var index2 = archimedesOrdered[0].findIndex(function(el) { return el == Number(splitCoordsString[1][2]); });
        //console.log(index2);
    
        for(var j=0;j<surroundingElements.length;j++){
    
            if(surroundingElements[j][index2][1] == splitCoordsString[1][3]){
                decryptedCoords += surroundingElements[j][index2][0] ;
            }
        }
        
    }

    // finds decryption for numbers of coordinate string 

    for (var k=0;k<splitCoordsString[2].length;k++){ //loop over numbers of encrypted coords

        for(var i=1;i<archimedesOrdered.length;i++){ //loop over 3 next rows of ordered table  

            // index of every encrypted coordinate in ordered Archimedes table
            var index = archimedesOrdered[i].findIndex(function(el) { return el == splitCoordsString[2][k]; });
        
            if(index != -1) break;             
        }

        var coor = archimedesOrdered[0][index];
        decryptedCoords += coor; 

    }

    return decryptedCoords ;

}

console.log('************************************');
console.log(dencr.dencryptCoords('9ΑΛΩ', '3302ΚΔΒΓΥΣ')) ; // MB875335
console.log(dencr.dencryptCoords('7ΑΡΦ', '9313ΚΘΔΑΡΕ')) ; // FM645778
console.log(dencr.dencryptCoords('1ΑΡΦ', '3301ΖΣJΖΖΖ')) ; // FX666666

console.log(dencr.dencryptCoords('1ΑΡΦ', '66ΙΓΠΒΕΑ')) ; // NN353721
console.log(dencr.dencryptCoords('1ΑΡΦ', '66ΖΗΓΒΜΘ')) ; // NN645778

console.log(dencr.dencryptCoords('1ΑΡΦ', '336ΑΕΙΓΖΒ')) ;  // FN123567
console.log(dencr.dencryptCoords('1ΑΡΦ', '623ΑΕΙΓΖΒ')) ;  // NC123567