
var karel = {
	"column": 1,
	"row": 2,
	"beepers": 0, //number of beepers
	"facing": 'R' //Up:U Down:D Left:L Right:R
}
var world = [
			['','','','',''],
			['','','W','2',''],
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
					if(world[karel.row - 1][karel.column] == "W" || karel.row == 0){
						alert("Kill me because MOVE")
						return
					}
					karel.row--;
					
				}
				else if(karel.facing == "D"){
					if(world[karel.row + 1][karel.column] == "W" || karel.row == world.lenght - 1){
						alert("Kill me because MOVE")
						return
					}
					karel.row++;
				}
				else if (karel.facing == "R"){
					if(world[karel.row][karel.column + 1] == "W" || karel.column == world.lenght - 1){
						alert("Kill me because MOVE")
						return
					}
					karel.column++;
				}
				else{
					if(world[karel.row][karel.column - 1] == "W" || karel.column == 0){
						alert("Kill me because MOVE")
						return
					}
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
				else{
					karel.facing = "U";
				}
				i++;
				break;
		case instructions.PICKBEEPER:
				if(!isNaN(world[karel.row][karel.column]) && world[karel.row][karel.column]){
					if(Number(world[karel.row][karel.column]) - 1 == 0){
						world[karel.row][karel.column] = "";
					}
					else{
						var n = Number(world[karel.row][karel.column]) - 1;
						world[karel.row][karel.column] = n.toString();
					}
					karel.beepers++;
					world[karel.row][karel.column] == "";
				}
				else{
					alert("Kill me because of PICKBEEPER")
					return;
				}
				i++;
				break;
		// case instructions.PUTBEEPER:
		// 		if(karel.beepers > 0 && ){

		// 		}
		default:


	}


}


}

