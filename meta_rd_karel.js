
var MAX_LENGHT_IDENTIFICADOR = 25,
	MAX_SYMBOL = 25,
	CALL = 1,
	RET = 2,
	JMP = 3,
	IF = 4;

var SymbolTable = [];

var InterCode = [];
var InterCodeIndex =0;
var lastSymbol = 0;

function string_without_spaces(var nameFunction){
		nameFunction = aTokensInput[currentToken];

}

function exigir (var tokenRequerido){
	return tokenRequerido == aTokensInput[currentToken++];
}

function leer(var tokenRequerido){
	return tokenRequerido == aTokensInput[currentToken];
}

function findStartPointOfFunction(var nameFunction){
	for(int i=0; i < lastSymbol && nameFunction==SymbolTable[i].identificador){
		if(i<lastSymbol){
		return i;
	}
	return 0xff;

	}
}

function AddNewFunction(var tokenRequerido){
		SymbolTable.push({identificador:tokenRequerido});
		lastSymbol++;
}