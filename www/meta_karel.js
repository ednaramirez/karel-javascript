
var MAX_LENGHT_IDENTIFICADOR = 25,
	MAX_SYMBOL = 25,
	instructions = {'CALL': 1,
    'RET': 2,
    'JMP': 3,
    'IF': 4,
    'OR': 5,
    'AND': 6,
    'NOT': 7,
    'FRONT_IS_CLEAR': 8,
    'FRONT_IS_BLOCKED': 9,
    'LEFT_IS_CLEAR': 10,
    'LEFT_IS_BLOCKED': 11,
    'RIGHT_IS_CLEAR': 12,
    'RIGHT_IS_BLOCKED': 13,
    'NEXT_TO_A_BEEPER': 14,
    'NOT_NEXT_TO_A_BEEPER': 15,
    'ANY_BEEPERS_IN_BEEPER_BAG': 16,
    'NOT_ANY_BEEPERS_IN_BEEPER_BAG': 17,
    'FACING_NORTH': 18,
    'FACING_SOUTH': 19,
    'FACING_EAST': 20,
    'FACING_WEST': 21,
    'NOT_FACING_NORTH': 22,
    'NOT_FACING_SOUTH': 23,
    'NOT_FACING_EAST': 24,
    'NOT_FACING_WEST': 25,
    'JMP_COND' : 26,
    'ITERATE' : 27,
    'MOVE' : 28,
    'TURNLEFT' : 29,
    'TURNOFF' : 30,
    'PICKBEEPER' : 31,
    'PUTBEEPER' : 32,
    'BEGIN' : 33,
    'CLONE' : 34,
    'CLONE_END' : 35,
    };

var SymbolTable = []
var InterCode = [];
var InterCodeIndex = [];
InterCodeIndex[0] = 0;
var cloneCount = 0;
var lastSymbol = 0;

function string_without_spaces(nameFunction){
		return nameFunction = aTokensInput[currentToken++];

}

function require(requiredToken){
	return requiredToken == aTokensInput[currentToken++];
}

function requireN(){
    return  !isNaN(aTokensInput[currentToken]); 
}

function read(requiredToken){
	return requiredToken == aTokensInput[currentToken];
}

function findStartPointOfFunction(nameFunction){
	for(var i=0; i < lastSymbol && nameFunction==SymbolTable[i].identificador; i++);
	if(i<lastSymbol){
		return i;
	}
	return 0xff;
}

function AddNewFunction(requiredToken){
    console.log("requiredToken: ")
    console.log(requiredToken);
	SymbolTable.push({'identificador':requiredToken});
	lastSymbol++;
}