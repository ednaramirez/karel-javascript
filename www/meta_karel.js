
var MAX_LENGHT_IDENTIFICADOR = 25,
	MAX_SYMBOL = 25,
	instructions = {'CALL': 1,
    'RET': 2,
    'JMP': 3,
    'IF': 4,
    'FRONT_IS_CLEAR': 5,
    'FRONT_IS_BLOCKED': 6,
    'LEFT_IS_CLEAR': 7,
    'LEFT_IS_BLOCKED': 8,
    'RIGHT_IS_CLEAR': 9,
    'RIGHT_IS_BLOCKED': 10,
    'NEXT_TO_A_BEEPER': 11,
    'NOT_NEXT_TO_A_BEEPER': 12,
    'ANY_BEEPERS_IN_BEEPER_BAG': 13,
    'NOT_ANY_BEEPERS_IN_BEEPER_BAG': 14,
    'FACING_NORTH': 15,
    'FACING_SOUTH': 16,
    'FACING_EAST': 17,
    'FACING_WEST': 18,
    'NOT_FACING_NORTH': 19,
    'NOT_FACING_SOUTH': 20,
    'NOT_FACING_EAST': 21,
    'NOT_FACING_WEST': 22};

var SymbolTable = [];

var InterCode = [];
var InterCodeIndex =0;
var lastSymbol = 0;

function string_without_spaces(nameFunction){
		nameFunction = aTokensInput[currentToken];

}

function require(requiredToken){
	return requiredToken == aTokensInput[currentToken++];
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
	SymbolTable.push({identificador:requiredToken});
	lastSymbol++;
}