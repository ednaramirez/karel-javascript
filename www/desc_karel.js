//<program> ::= "class program" "{" <functions> <main function> "}"

function program(){
  if(require("class")){
    if(require("program")){
      if(require("{")){
        functions();
        main_function();
        if(!require("}")){
          showErrorMessage(3);
        }
      }
    }
    else {
      showErrorMessage(4);
    }
  }
  else{
    showErrorMessage(4);
  }
}

//<functions> ::= <functions prima>
function functions() { 
  function_prima();   
}


//<functions prima> ::= <function> <functions prima> | lambda
function function_prima(){
  if ( read("void") )
  {
    _function();
    function_prima();
  } 
}

//<main function> ::= "program()" "{" <body> "}"
function main_function() {
  if(require("program")){
    if(require("(")){
      if(require(")")){
        if(require("{")){
          InterCode[InterCodeIndex++] = instructions.BEGIN;
          beginProgram = InterCodeIndex;
          body();
          if(!require("}")){
            showErrorMessage(3);
          }
        }
        else {
          showErrorMessage(1);
        }
      }
      else {
        showErrorMessage(2);
      }
    }
    else {
      showErrorMessage(5);
    }
  }
  else {
    showErrorMessage(4);
  }
}


//<function> := "void" <name function> "()" "{" <body> "}"

function _function () {
  if(require("void")){
    name_function();
    if(require("(")){
      if(require(")")){
        if(require("{")){
          body();
          if(!require("}")){
            showErrorMessage(3);
          }
          InterCode[InterCodeIndex++] = instructions.RET;
        }
        else
        {
          showErrorMessage(1);
        }
      }
      else
      {
        showErrorMessage(2)
      }
    }
    else
    {
      showErrorMessage(5);
    }
  }
  else
  {
      //Syntax error
    }
  }

// <name function> ::= <string without spaces>
function name_function() {

 var  nameFunction=string_without_spaces(nameFunction);

  AddNewFunction(nameFunction, InterCodeIndex);
}

//<body> ::= <expressions>
function body()
{
  expressions();
}

//<expressions> ::= <expression> <expressions prima>
function expressions()
{
  expression();
  expressions_prima();
}

//<expressions prima> ::= <expression> <expressions prima> | lambda
function expressions_prima()
{
  if ( !read("}") )
  {
    expression();
    expressions_prima();
  }
}

//<expression> ::= <call function> |
//  <if expression> |
//  <while expression> |
//  <iterate expression>
function expression()
{
  if ( read("if") )
  {
    if_expression();
  }
  else
  {
    if ( read("while") )
    {
      while_expression();
    }
    else
    {
      if ( read("iterate") )
      {
        iterate_expression();
      }
      else
      {
        call_function();
      }
    }
  }
}

//<call function> ::= <name of function>()
function call_function()
{
  name_of_function();
  if ( require("(") )
  {
    if ( !require(")") )
    {
      showErrorMessage( 2 );
    }
  }
  else
  {
    showErrorMessage( 5 );
  }
}

//<name of function> ::= <official function> | <customer function>
function name_of_function()
{
  if ( read("move") ||
   read("turnoff") ||
   read("pickbeeper") ||
   read("turnleft") ||
   read("putbeeper")
   )
  {
    official_function();
  }
  else
  {
    customer_function();
  }
}

/*
<official function> ::=
    "move" |
    "turnoff" |
    "pickbeeper" |
    "turnleft" |
    "putbeeper"
    */
  function official_function()
  {
    if ( read("move")){
      require("move");
      InterCode[ InterCodeIndex++ ] = instructions.MOVE;


    }
    else if(read("turnoff")){
      require("turnoff");
      InterCode[ InterCodeIndex++ ] = instructions.TURNOFF;

    }
    else if(read("pickbeeper")) {
      require("pickbeeper");
      InterCode[ InterCodeIndex++ ] = instructions.PICKBEEPER;

    }
    else if(read("turnleft")){
      require("turnleft");
      InterCode[ InterCodeIndex++ ] = instructions.TURNLEFT;

    }
    else{
      require("putbeeper");
      InterCode[ InterCodeIndex++ ] = instructions.PUTBEEBER;

    }
  }

//<customer function> ::= <string without spaces>
function customer_function()
{
  var nameFunction = [];
  var PosFunctionInCodeInter;
  string_without_spaces( nameFunction );
  PosFunctionInCodeInter = findStartPointOfFunction( nameFunction );
  if ( PosFunctionInCodeInter != 0xFF )
  {
    InterCode[ InterCodeIndex++ ] = instructions.CALL;
    InterCode[ InterCodeIndex++ ] = PosFunctionInCodeInter;
  }
  else
  {
    showErrorMessage(6);
  }
}

//<if expression> ::= "if" ( <conditional> ) "{" <body> "}" [ <elseif> ]
function if_expression()
{
  var PosX_jmptrue= 0;
  if ( require("if") ) {
    InterCode[ InterCodeIndex++ ] = instructions.IF;
    if ( require("(") ) {

      conditional();

      if ( require(")") ) {
        InterCode[ InterCodeIndex++ ] = instructions.JMP;
        PosX_jmptrue = InterCodeIndex++;
        if ( require("{") )
        {
          body();
          if ( require("}") )
          {
            if ( read("else") )
            {
              elseif( PosX_jmptrue );
            }
            else
            {
              InterCode[ PosX_jmptrue ] = InterCodeIndex;
            }
          }
          else
          {
            showErrorMessage(3);
          }
        }
        else
        {
          showErrorMessage(1);
        }
      }
      else
      {
        showErrorMessage(2);
      }
    }
    else
    {
      showErrorMessage(5);
    }
  }
  else
  {
    //error de sintaxis, fin de ejecucion
  }
}

//<elseif> ::= "else" "{" <body> "}"
function elseif( PosX_jmptrue )
{
  var PosY_jmpfalse= 0;
  if ( require("else") )
  {
    InterCode[ InterCodeIndex++ ] = instructions.JMP;
    PosY_jmpfalse = InterCodeIndex++;
    InterCode[ PosX_jmptrue ] = InterCodeIndex;
    if ( require("{") )
    {
      body();
      if ( !require("}") )
      {
        showErrorMessage(3);
      }
      InterCode[ PosY_jmpfalse ] = InterCodeIndex;
    }
    else
    {
      showErrorMessage(1);
    }
  }
  else
  {
    showErrorMessage(4);
  }
}

//<while expression> ::= "while" "(" <conditional> "," "{" <body> "}"
  function while_expression()
  {
    var PosX_jmptrue;
    var PosY_beginWhile;
    if ( require("while") )
    {
      PosY_beginWhile = InterCodeIndex;
      InterCode[ InterCodeIndex++ ] = instructions.IF;
      if ( require("(") )
      {
        conditional();
        if ( require(")") )
        {
          InterCode[ InterCodeIndex++ ] = instructions.JMP;
          PosX_jmptrue = InterCodeIndex++;
          if ( require("{") )
          {
            body();
            if ( !require("}") )
            {
              showErrorMessage(3);
            //error de sintaxis, fin de ejecucion
          }
          InterCode[ InterCodeIndex++ ] = instructions.JMP;
          InterCode[ InterCodeIndex++ ] = PosY_beginWhile;
          InterCode[ PosX_jmptrue ] = InterCodeIndex;
        }
        else
        {
          showErrorMessage(1);
          //error de sintaxis, fin de ejecucion
        }
      }
      else
      {
        showErrorMessage(2);
        //error de sintaxis, fin de ejecucion
      }
    }
    else
    {
      showErrorMessage(5);
      //error de sintaxis, fin de ejecucion
    }
  }
  else
  {
    showErrorMessage(4);
  }
}
// <composed condition> ::= <not condition> <simple condition>

// <composed condition prima>

// <not condition> ::= "!" | lambda

// <composed condition prima> ::= <or condition> | lambda

// <or condition> ::= "||" <simple condition> | <and condition>

// <and condition> ::= "&&" <simple condition> | lambda



//<iterate expression> ::= "iterate" "(" <number> ")" "{" <body> "}"

function iterate_expression(){
  var iterate_position;
  var number;
  if(require("iterate")){
    iterate_position = currentToken;
    if(require("(")){
      if(requireN()){
        number =  parseInt(aTokensInput[currentToken++]);
        if(require(")")){
          if(require("{")){
            for(var i=0; i < number ; i++){
               body();
               var outToken = currentToken;
               currentToken = iterate_position;
            }
            currentToken = outToken;
          
            if(require("}")){
            }
            else{
              showErrorMessage(3);

            }
          }
          else{
            showErrorMessage(1);

          }

        }
        else{
          showErrorMessage(2);
        }
      }
      else{
        showErrorMessage(8);

      }
    }
    else{
      showErrorMessage(5);
    }
  }
  else{
    showErrorMessage(4);
  }
}




//<conditional> ::= <simple condition> | <composed condition>
function conditional(){
	// do{
		if (read("!")) {
			require("!");
			InterCode [InterCodeIndex++] = instructions.NOT;
		}
		if (read_simple_condition()) {
			currentToken++;

      if (read("&&")){
        currentToken-=1;
        and_condition();
      }
      else if (read("||")) {
        currentToken-=1;
 
        or_condition();
      }
      else{
        currentToken--;
        require_simple_condition();
      


      }

    }
    else{
     showErrorMessage(5);
   }
	// }while ((read("!") || read("||") || read("&&") || read_simple_condition()))
}

function or_condition(){
	
  InterCode [InterCodeIndex++] = instructions.OR;


  if (require_simple_condition()){

   if(require("||")){

     if(require_simple_condition()){
      return
    }
    else{
      showErrorMessage(5);
    }
  }
  else{
   showErrorMessage(2);
 }
}
else{
  showErrorMessage(5);
}
}

function and_condition(){
	InterCode [InterCodeIndex++] = instructions.AND;

	if (require_simple_condition()){
		if(require("&&")){
			if(require_simple_condition()){
				return
			}
      else{
        showErrorMessage(5);
      }
    }
    else{
     showErrorMessage(2);
   }
 }
 else{
  showErrorMessage(5);
}
}

function read_simple_condition(){

	return (read("frontIsClear") ||
   read("frontIsBlocked") ||
   read("leftIsClear") ||
   read("leftIsBlocked") ||
   read("rightIsClear") ||
   read("rightIsBlocked") ||
   read("nextToABeeper") ||
   read("notNextToABeeper") ||
   read("anyBeepersInBeeperBag") ||
   read("noBeepersInBeeperBag") ||
   read("facingNorth") ||
   read("facingSouth") ||
   read("facingEast") ||
   read("facingWest") ||
   read("notFacingNorth") ||
   read("notFacingSouth") ||
   read("notFacingEast") ||
   read("notFacingWest")
   );
}
function translate(instruction){
  string = "";
  for(var i = 0; i<instruction.length;i++){
    if(instruction[i]>='A' && instruction[i]<='Z'){
      string+='_';
    }
    string += instruction[i].toUpperCase();
  }
  return string;
}
function require_simple_condition(){

  
  if(read_simple_condition()){

    InterCode[InterCodeIndex++]=instructions[translate(aTokensInput[currentToken++])]
    return true;
  }
  else{
    return false;
  }
 

}
/*function conditional()
{
  var condition;

  if(leerCondicional(&condition))
  {
    exigir(conditionals[condition]);
    InterCode[InterCodeIndex++] = condition;

    if(leer("&&") || leer("||"))
    {
      if(exigir("&&"))
      {
        if(leerCondicional(&condition))
        {
          exigir(conditionals[condition]);
          InterCode[InterCodeIndex++] = condition;
          InterCode[InterCode++] =
        }
        else {
          showErrorMessage(7);
        }
      }
      else
      {
        //kewl
      }
    }
  }
  else
  {
    showErrorMessage(7);
  }
}

function leerCondicional(condition)
{
  int i;
  for(i=0;i<sizeof(conditionals);i++){
    if(leer(conditionals[i])){
      condition = i;
      return true;
    }
  }
  condition = -1;
  return false;
}
*/
/*
<simple condition> ::=
    "frontIsClear"
  | "frontIsBlocked"
  | "leftIsClear"
  | "leftIsBlocked"
  | "rightIsClear"
  | "rightIsBlocked"
  | "nextToABeeper"
  | "notNextToABeeper"
  | "anyBeepersInBeeperBag"
  | "noBeepersInBeeperBag"
  | "facingNorth"
  | "facingSouth"
  | "facingEast"
  | "facingWest"
  | "notFacingNorth"
  | "notFacingSouth"
  | "notFacingEast"
  | "notFacingWest"
*/
