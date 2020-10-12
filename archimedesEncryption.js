////////////////////////////////////

/////////////// NEW VERISON /////////

// NEW VERISON OF IMPLEMENTING  ENCRYPTION USIN PROTOTYPES 
// js script implementing Archimedes encryption for military coordinates
// Author : KV
// Date : 07/10/2020
// https://mappingsupport.com/p2/coordinates-mgrs-gissurfer-maps.html

// usage : archimedesEncryptionImproved.js

// dreate object
function EncryptCoords() {}
//instantiate an instance of object
var enc = new EncryptCoords();

EncryptCoords.prototype.rollOver = function(myElement, arr){
    // function implementing the rollover of the circles of Archimedes encryption 
    while(arr[0] != myElement){
        arr.push(arr.shift()); 
    }
    return arr; 
}

EncryptCoords.prototype.getRow = function (myArr, indexOfRow){

    // function for extracting specific row from a 2-d array
    var row = [];

    for(var i = 0; i<myArr[0].length; i++) {
        row.push(myArr[indexOfRow][i]); 
    }
    return row;
}

EncryptCoords.prototype.archiOrdered = function(kleida){

    var kleida = kleida.split(''); 

    var circleOfArchimedes = [

        [1,2,3,4,5,6,7,8,9,0],
        ['Α','Ε','Ι','Η','Γ','Ζ','Β','Θ','Δ', 'Κ'],
        ['Ρ','Ν','Π','Υ','Ο','Σ','Μ','Ξ','Τ','Λ'],
        ['Φ','','U','Ψ','','J','Χ','V','','Ω']
    
    ] ; 

    var archimedesOrdered = [];

    for(var i=0; i<kleida.length;i++){

        if(i==0){

            //var row1 = rollOver(Number(dailyCode[0]), getRow(circleOfArchimedes, 0));
            archimedesOrdered.push(enc.rollOver(Number(kleida[0]), enc.getRow(circleOfArchimedes, 0)));
        }else{

            //var nextRow = rollOver(dailyCode[i], getRow(circleOfArchimedes, i));
            archimedesOrdered.push(enc.rollOver(kleida[i], enc.getRow(circleOfArchimedes, i)));
        }
    }
    return archimedesOrdered; 
}

EncryptCoords.prototype.encrypt = function(kleida, coords){

    var surroundingElements = [
    
        [ [ ], ['A',1],['D',1], ['G',1],['K',1], ['N',''], ['Q',3], ['T',3], ['W',3], ['X',1] ],
        [ [ ], ['B',2], ['E',2], ['H',2], ['L',2], [], ['P',2], ['S',2], ['V',2], ['Y',2] ],
        [ [ ], ['C',3], ['F',3], ['I',3], ['M',3], [], ['O',1], ['R',1], ['U',1],['Z',3]  ]
    
    ] ;


    var frequencies = function (s) {
        var f = {};
        s.split("").forEach(function (e) {
            f[e] = f[e] || 0;
            f[e] += 1;
        });
        return f;
    }

    var cryptoCoords = ''; 

    // set crypto for the first two letters of given coordinates
    for (var i=0;i<2;i++){

    
        for(var j=0;j<surroundingElements.length;j++){
            //subarray of surroundingElements that contains the coordinate[0]
            var row = enc.getRow(surroundingElements, j) ;
            //index of coordinate[0] in subarray
            var index = row.findIndex(function(el) { return el[0] == coords[i]}); 

            if(index != -1){
                cryptoCoords += enc.archiOrdered(kleida)[0][index].toString() + surroundingElements[j][index][1];
            }
        }
    }

        // set crypto for the rest letters of given coordinates

    for(var i=2;i<coords.length;i++){

        ///index of every number coordinate in ordered Archimedes table
        var index = enc.archiOrdered(kleida)[0].findIndex(function(el) { return el == Number(coords[i]); });
    
        // take subarray of string coords till the i element
        var coordsMin = coords.slice(2,i+1);
        //check frequency of every char in subarray
        var fr = frequencies(coordsMin)[coords[i]];

        if(fr == 1){

            var crp = enc.archiOrdered(kleida)[1][index];

        }else if(fr == 2){

            crp = enc.archiOrdered(kleida)[2][index];

        }else if (fr == 3){

            if (enc.archiOrdered(kleida)[3][index] != ''){
                crp = enc.archiOrdered(kleida)[3][index];
            }else {
                crp = enc.archiOrdered(kleida)[1][index];
            }

        }else {
            // more than 3 same numbers put always the first letter
            crp = enc.archiOrdered(kleida)[1][index];

        }

        cryptoCoords += crp;

    }
    return cryptoCoords ; 

}


console.log('*******************************') ;
// console.log(enc.encrypt('9ΑΛΩ', 'MB875335')) ; //3302ΚΔΒΓΥΣ
// console.log(enc.encrypt('7ΑΡΦ', 'FM645778')) ; //9313ΚΘΔΑΡΕ
// console.log(enc.encrypt('1ΑΡΦ', 'FX666666')) ; //3301ΖΣJΖΖΖ

//console.log(enc.encrypt('1ΑΡΦ', 'NN353721')) ; //66ΙΓΠΒΕΑ
//console.log(enc.encrypt('1ΑΡΦ', 'NN645778')) ; //66ΖΗΓΒΜΘ

// console.log(enc.encrypt('1ΑΡΦ', 'FN123567')) ;  //336ΑΕΙΓΖΒ
// console.log(enc.encrypt('1ΑΡΦ', 'NC123567')) ;  //623ΑΕΙΓΖΒ