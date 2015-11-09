var error_table = ["DescError: Missing left brace",
                   "DescError: Missing right parenthesis",
                   "DescError: Missing right brace",
                   "DescError: Reserved word error",
                   "DescError: Missing left parenthesis",
                   "DescError: Undefined function",
                   "DescError: Missing conditional",
                   "DescError: Iterate value is not a number"];

function showErrorMessage(indexMessage){
  if(error_table[indexMessage-1]){
    alert(error_table[indexMessage-1]);
  }
  else {
    console.log("Error not found")
  }
}
