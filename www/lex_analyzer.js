function lexAnalyzer(string){
	var accepted = [], end, type, tokens[];

	for(var i=0;i<string.length;i++){
		if((string[i]>='a' && string[i]<='z') || (string[i]>='A' && string[i]<='Z')){
			end = getWord(string,i);
			type = "Word"
		}
		if((string[i]>=0 && string[i]<=9)){
			end = getNumber(string,i);
			type = "Number"

		}
		if(string[i]=='{' || string[i]=='}' || string[i]=='(' || string[i]==')' || string[i] == '!'){
			end = i+1;
			type= getType(string[i])
		}
		if(string[i] == '|' || string[i] == '&'){
			var character = string[i];
			end = getComposite(string,character,i);
			type= getType(string[i])
		}
		if(end!=-1){
      tokens.push(string.substring(i,end));
			accepted.push("("+string.substring(i,end) +"," + type + ")");
			i = end-1;
			type= getType(string[i])

		}
		end = -1;

	}

	console.log(accepted);
}

function getWord(string, pos){
	for(var i = pos+1;i<string.length;i++){
		if(!((string[i]>='a' && string[i]<='z') || (string[i]>='A' && string[i]<='Z'))) {

			return i;

		}
	}
	return i;
}

function getNumber(string, pos){
	for(var i = pos+1;i<string.length;i++){
		if(!(string[i]>=0 && string[i]<=9)){
			return i;
		}
	}
	return i;
}
function getComposite(string, char, pos){
	if(string[pos+1]==char){

		return pos+2;
	}
	else {
		return -1;
	}
}

function getType(char){
	if(char=='('){
		return "PA"
	}
	else if(char==")"){
		return "PC"
	}
	else if(char=="|"){
		return "OR"
	}
	else{
		return "AND"
	}

}
