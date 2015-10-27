var error_table = ["Missing left brace",
                  "Missing right parenthesis",
                  "Missing right brace",
                  "Reserved word error",
                  "Missing left parenthesis",
                  "Undefined function",
                  "Missing conditional"];

function showErrorMessage(indexMessage){
  if(error_table[indexMessage-1]){
    alert(error_table[indexMessage-1]);
  }
  else {
    console.log("Error not found")
  }
}
