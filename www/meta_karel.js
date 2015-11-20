/**
*Standard Underlying layer for the recursive descendent containing very basic functions and variables for the creation of the Intercode
*/

/**
* The instructions hash table contains the pre-set instructions for karel.
* The intercode is composed of these instructions along with indexes for traversing the code
*/
var //MAX_LENGHT_IDENTIFICADOR = 25,
	// MAX_SYMBOL = 25,
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

/**
* Variables needed for the creation of the Intercode and the Symbol table.
*/
var SymbolTable = []
var InterCode = [];
var InterCodeIndex = 0;
// var cloneCount = 0;
// var lastSymbol = 0;

/**
* Returns the current token and advances the token index to the next token.
*/
function string_without_spaces(){
    return aTokensInput[currentToken++];

}

/**
* Checks whether the current token is equal to the token sent as parameter.
* Advances the token index effectively consuming the token.
*/
function require(requiredToken){
	return requiredToken == aTokensInput[currentToken++];
}

/**
*Requires the current token to be a number, returns boolean evaluation.
*/
function requireN(){
    return !isNaN(aTokensInput[currentToken]);
}

/**
* Checks whether the current token is equal to the token sent as parameter.
* Token index remains on the same position.
*/
function read(requiredToken){
	return requiredToken == aTokensInput[currentToken];
}

/**
* Returns an Intercode index corresponding to the starting point of the function name sent as parameter.
*/
function findStartPointOfFunction(nameFunction){
    // console.log("Find start of function "+nameFunction)
    // console.log(SymbolTable);
    if(SymbolTable[nameFunction]!=undefined){
        return SymbolTable[nameFunction];
    }
    return -1;
}
/**
*Adds new function name to the Symbol table
*/
function AddNewFunction(requiredToken){
    // console.log("requiredToken: ")
    // console.log(requiredToken);
	SymbolTable[requiredToken] = InterCodeIndex;
    // console.log(SymbolTable);
}