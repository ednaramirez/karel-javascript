
// //<program> ::= "class program" "{" <functions> <main function> "}"
// void program()
// {
//   if ( exigir("class") )
//   {
//     if ( exigir("program") )
//     {
//       if ( exigir("{") )
//       {
//         printf("exigir llave inicial\n");
//         // functions();
//         main_function();
//         if ( !exigir("}") )
//         {    
//           showErrorMessage( 3 );
//         }
//        }
//     }
//     else 
//     {
//       printf("exigir program");
//       showErrorMessage( 4 );
//     }  
//   }
//   else 
//   {
//     printf("exigir class");
//     showErrorMessage( 4 );
//   }
// }

// //<main function> ::= "program()" "{" <body> "}"
// void main_function()
// {
//   if ( exigir("program") )
//   {
//     if ( exigir("(") )
//     {
//       if ( exigir(")") )
//       {
//         if ( exigir("{") )
//         {
//           body();
//           if ( exigir("}") )
//           {
//             showErrorMessage( 3 );
//           }
//         }
//         else 
//         {
//           showErrorMessage( 1 );
//         }
//       }
//       else
//       {
//         showErrorMessage( 2 );
//       }
//     }
//     else
//     {
//       showErrorMessage( 5 );
//     }
//   }
//   else 
//   {
//     showErrorMessage( 4 );
//   }
// }

// //<function> := "void" <name function> "()" "{" <body> "}"
// void function() 
// {
//   if ( exigir("void") )
//   {
//     name_function();
//     if ( exigir("(") )
//     {
//       if ( exigir(")") )
//       {
//         if ( exigir("{") )
//         {
//           body();
//           if ( !exigir("}") )
//           {
//             showErrorMessage( 3 );
//           }
//           InterCode[ InterCodeIndex++ ] = RET;
//         }
//         else
//         {
//           showErrorMessage( 1 );
//         }          
//       }
//       else
//       {
//         showErrorMessage( 2 );
//       }    
//     }
//     else
//     {
//       showErrorMessage( 5 );
//     }    
//   }
//   else
//   {
//     //error de sintaxis, fin de ejecucion
//   }
// }

// // <name function> ::= <string without spaces>
// void name_function()
// {
//   char nameFunction[ LENGTH_MAX_STRING ];
//   string_without_spaces( nameFunction );
//   AddNewFunction( nameFunction, InterCodeIndex );
// }

// //<body> ::= <expressions>
// void body() 
// {
//   expressions();
// }

// //<expressions> ::= <expression> <expressions prima>
// void expressions()
// {
//   expression();
//   expressions_prima();
// }

// //<expressions prima> ::= <expression> <expressions prima> | lambda
// void expressions_prima() 
// {
//   if ( !leer("}") )
//   {
//     expression();
//     expressions_prima();
//   }
// }

// //<expression> ::= <call function> |
// //  <if expression> |
// //  <while expression> |
// //  <iterate expression>
// void expression()
// {
//   if ( leer("if") )
//   {
//     if_expression();
//   }
//   else 
//   {
//     if ( leer("while") )
//     {
//       while_expression();
//     }
//     else 
//     {
//       if ( leer("iterate") )
//       {
//         //iterate_expression();
//       }
//       else 
//       {
//         call_function();
//       }      
//     }  
//   }
// }

// //<call function> ::= <name of function>()
// void call_function() 
// {
//   name_of_function();
//   if ( exigir("(") )
//   {
//     if ( !exigir(")") )
//     {
//       showErrorMessage( 2 );
//     }    
//   }
//   else
//   {
//     showErrorMessage( 5 );
//   }  
// }

// //<name of function> ::= <official function> | <customer function>
// void name_of_function()
// {
//   if ( leer("move") ||
//        leer("turnoff") ||
//        leer("pickbeeper") ||
//        leer("turnleft") ||
//        leer("putbeeper")
//      )
//   {
//     official_function();
//   }
//   else
//   {
//     customer_function();
//   }
// }



function official_function() {
	if (read("turnleft")) {
		require("turnleft");
	}
	else{
		if (read("turnoff")) {
			require("turnoff");
		}
		if (read("move")) {
			require("move");
		}
		if (read("pickbeeper")) {
			require("pickbeeper");
		}
		if (read("putbeeper")) {
			require("putbeeper");
		}
	}
}

function customer_function() {
	var nameFunction[50] = {};
	var PosFunctionInCodeInter = {};
	string_without_spaces(nameFunction);
	PosFunctionInCodeInter = findStartPointOfFunction(nameFunction);
	if (PosFunctionInCodeInter != 0xFF) {
		InterCode [InterCodeIndex++] = CALL;
		InterCode [InterCodeIndex++] = PosFunctionInCodeInter;
	}
	else{
		showErrorMessage(6);
	}
}

function if_expression() {
	var PosX_jmptrue = 0;
	if (require("if")) {
		InterCode [InterCodeIndex++] = IF;
		if (require("(")) {
			conditional();
			if (require(")")) {
				InterCode [InterCodeIndex++] = JMP;
				PosX_jmptrue = InterCodeIndex++;
				if (require("{")) {
					body();
					if (require("}")) {
						if (read("else")) {
							elseif(PosX_jmptrue);
						}
						else{
							InterCode [PosX_jmptrue] = InterCodeIndex;
						}
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
			showErrorMessage(5);
		}
	}
	else{
		//Sintax error
	}
}

function elseif(PosX_jmptrue){
	var PosY_jmpfalse = 0;
	if (require("else")) {
		InterCode [InterCodeIndex++] = JMP;
		PosY_jmpfalse = InterCodeIndex++;
		InterCode [PosX_jmptrue] = InterCodeIndex;
		if (require("{")) {
			body();
			if (!require("}")) {
				showErrorMessage(3);
			}
			InterCode [PosY_jmpfalse] = InterCodeIndex;
		}
		else {
			showErrorMessage(1);
		}
	}
	else {
		showErrorMessage(4);
	}
}

function while_expression(){
	var PosX_jmptrue, PosY_beginWhile;
	if (require("while")) {
		PosY_beginWhile = InterCodeIndex;
		InterCode [InterCodeIndex++] = IF;
		if (require("(")) {
			conditional();
			if (require(")")) {
				InterCode[InterCodeIndex++] = JMP;
				PosX_jmptrue = InterCodeIndex++;
				if (require("{")) {
					body();
					if (!require("}")) {
						showErrorMessage(3);
					};
					InterCode [InterCodeIndex++] = JMP;
					InterCode [InterCodeIndex++] = PosY_beginWhile;
					InterCode [PosX_jmptrue] = InterCodeIndex;
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
// //<iterate expression> ::= "iterate" "(" <number> ")" "{" <body> "}"

// //<conditional> ::= <simple condition> | <composed condition>
// void conditional( void )
// {
//   InterCode[ InterCodeIndex++ ] = FRONT_IS_CLEAR;
// }

// /*
// <simple condition> ::= 
//   "frontIsClear"
//   | "frontIsBlocked"
//   | "leftIsClear"
//   | "leftIsBlocked"
//   | "rightIsClear"
//   | "rightIsBlocked"
//   | "nextToABeeper"
//   | "notNextToABeeper"
//   | "anyBeepersInBeeperBag"
//   | "noBeepersInBeeperBag"
//   | "facingNorth"
//   | "facingSouth"
//   | "facingEast"
//   | "facingWest"
//   | "notFacingNorth"
//   | "notFacingSouth"
//   | "notFacingEast"
//   | "notFacingWest"
// */

// //<composed condition> ::=   <simple condition> [ <or condition> ]

// /*
// <or condition> ::= 
//     "||" <simple condition> | 
//     [ <and condition> ]
// */

// /*
// <and condition> ::=     
//     "&&" <simple condition> | 
//     [ <not condition> ]
// */

// /*
// <not condition> ::= 
//   "!" <simple condition> |
//   <simple condition>
// */  