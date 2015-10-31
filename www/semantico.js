
var karel = {
	"column": 1,
	"row": 2,
	"beepers": 0, //number of beepers
	"facing": 'R' //Up:U Down:D Left:L Right:R
}
var world = [
			['','','','',''],
			['','','W','B',''],
			['','','W','W',''],
			['','','','',''],
			['','','','','']
			];


function execute(){
alert("Karel is in: row " + karel.row + " column " + karel.column);

var i=0;


while(InterCode[i] != instructions.TURNOFF){

	switch(InterCode[i]){

		case instructions.MOVE: 
				if(karel.facing == "U"){
					
					karel.row--;
					
				}
				else if(karel.facing == "D"){
					karel.row++;
				}
				else if (karel.facing == "R"){
					karel.column++;
				}
				else{
					karel.column--;
				}

				i++;
				alert("Karel is in: row " + karel.row + " column " + karel.column);
				break;

		case instructions.TURNLEFT:
				if(karel.facing == "U"){
					karel.facing = "L";
				}
				else if(karel.facing == "L"){
					karel.facing = "D";
				}
				else if(karel.facing == "D"){
					karel.facing = "R";
				}
				else if(karel.facing == "R"){
					karel.facing = "U";
				}
				i++;
				break;
		case instructions.PICKBEEPER:
				if(world[karel.row][karel.column] == "B"){
					karel.beepers++;
					world[karel.row][karel.column] =="";
				}
				else{
					return;
				}
		default:


	}


}


}

