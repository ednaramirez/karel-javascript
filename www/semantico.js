/**
* Variables needed for graphics
*/

var camera,
		scene,
		renderer,
		geometry,
		material,
		sphere,
		pointLight,
		plane,
		plane2,
		center,
		facing = ['FRONT', 'LEFT', 'BACK', 'RIGHT'];
/**
* Variables for initializing the world of karel.
* The variable world consists of a square matrix were every space consists of a single character:
* 		void: 		space
* 		"W": 		wall
* 		number: 	beeper(s)
* The variable maze is a structure for the graphics containing information about the world boundaries and unit size.
*/

var world = [
			['','','','','W',''],
			['','','','','W','2'],
			['','','','','','1'],
			['','','','W','',''],
			['','','','','',''],
			['','','','','','']
			];
var maze = {width: world.length, large:world.length, cellSize:100};


var karelArr = [];
var currentKarel = 0;
var beginProgram, initialDuration = 1000;
window.wallGeometries = [];
var errorMessage;

function addKarelModel (karel, index){
	var wallTexture = THREE.ImageUtils.loadTexture('textures/bmo.png');
		wallTexture.wrapS = THREE.RepeatWrapping;
		wallTexture.wrapT = THREE.RepeatWrapping;
		wallTexture.needsUpdate = true;
	function getRandomColor() {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}
	var karelModel = new THREE.Mesh(geometrySphere, new THREE.MeshBasicMaterial({map : wallTexture, color: getRandomColor(), wireframe: false}));

	karelModel.position.x = translateToCartesianY(karel.y)*maze.cellSize;
	karelModel.position.z = translateToCartesianX(karel.x)*maze.cellSize;
	karelModel.rotation.y += (karel.facingIndex*Math.PI) / 2;
	console.log("X "+translateToCartesianY(karel.y)+" Y "+translateToCartesianX(karel.x))
	karelModel.name = "karel"+(index);
	karel.karelModel = karelModel;
}
function addKarel(){
	karelArr.push({
		x: translateToMatricialX(0),
		y: translateToMatricialY(0),
		movementSequence: [],
		beeperCount: 0,
		startSequence: 0,
		facingIndex: 0,
		parent: 0
	});
}
function init() {

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(10, 500 / 500, 1, 8500);
		camera.position.set(0,5000,0);
		center = new THREE.Vector3(0,0,0);
		camera.lookAt(center);
		camera.rotateOnAxis((new THREE.Vector3(0, 0, 1)).normalize(), Math.PI);
		geometry = new THREE.CubeGeometry(maze.cellSize/2, maze.cellSize/2, maze.cellSize/2,16,16);
		geometrySphere = new THREE.SphereGeometry(maze.cellSize/3, 16, 16);
		material = new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: true, side: THREE.DoubleSide});
		geometryPlane = new THREE.CubeGeometry(maze.width*maze.cellSize, maze.large*maze.cellSize,20);
		geometryPlaneBasic = new THREE.CubeGeometry(maze.cellSize, maze.cellSize, maze.cellSize);


		var texture = THREE.ImageUtils.loadTexture('textures/floor.jpg', {}, function(){
				renderer.render(scene, camera);
				animate();
		});
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(maze.width, maze.large);
		texture.needsUpdate = true;
		material = new THREE.MeshBasicMaterial({ map : texture, doubleSided: true,side: THREE.DoubleSide });

		var wallTexture = THREE.ImageUtils.loadTexture('textures/Wall_Texture_by_shadowh3.jpg');
		wallTexture.wrapS = THREE.RepeatWrapping;
		wallTexture.wrapT = THREE.RepeatWrapping;
		wallTexture.needsUpdate = true;



		plane2 = new THREE.Mesh(geometryPlane, material);
		plane2.rotation.x = -Math.PI/2;
		plane2.position.y=-250;

		var wall;
		var wallMaterial = new THREE.MeshBasicMaterial({ map : wallTexture, doubleSided: true,side: THREE.DoubleSide });
		var offsizeX=0;
		var offsizeZ=0;

		for(var i = 0; i<world.length; i++){
			for(var j = 0; j<world.length; j++){
				if(world[i][j]=='W'){
					wall = new THREE.Mesh(geometryPlaneBasic, wallMaterial);
					wall.position.z = translateToCartesianX(j)*maze.cellSize;
					wall.position.x =  translateToCartesianY(i)*maze.cellSize;

					scene.add(wall);
			
				}
				if(parseInt(world[i][j])>0){
					
					sphere = new THREE.Mesh(geometrySphere, new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('textures/beeper.jpg')}));
					sphere.position.z = translateToCartesianX(j)*maze.cellSize;
					sphere.position.x = translateToCartesianY(i)*maze.cellSize;
					sphere.name= i.toString() + j.toString();	
					scene.add(sphere);
				}
			}
		}
		scene.add(sphere);
		scene.add(plane2);

		pointLight = new THREE.DirectionalLight( 0xffffff );
		pointLight.position.set( 0, 0, 1 ).normalize();
		var ambientLight = new THREE.AmbientLight(0xffffff);
		scene.add(ambientLight);
		scene.add(pointLight);


		renderer = new THREE.WebGLRenderer();
		renderer.setSize(500, 500);
		window.camera = camera;

		document.getElementById('karel-body').insertBefore(renderer.domElement, document.getElementById('div'));

};

function translateToCartesianY(position){
	return maze.width-1-position-(Math.floor(maze.width/2));
}
function translateToCartesianX(position){
	return position - (Math.floor(maze.width/2));
}
function translateToMatricialY(position){
	return maze.width-1-Math.round(position/maze.cellSize)-(Math.floor(maze.width/2));
}
function translateToMatricialX(position){
	return (Math.floor(maze.width/2)) + Math.round(position/maze.cellSize);
}

var rotate = function(karel){
	karel.facingIndex++;
	if(karel.facingIndex==4) {
		karel.facingIndex = 0;
	}
	karel.movementSequence.push("rotate");
}
var move = function (karel){
	var newPosition = hashCheck['FRONT'][facing[karel.facingIndex]];
	if((karel.y+newPosition[0])<maze.width
			&& (karel.x + newPosition[1])<maze.width
			&& (karel.y+newPosition[0])>=0
			&& (karel.x + newPosition[1])>=0
			&& (world[karel.y + newPosition[0]][karel.x + newPosition[1]] != "W")) {
		karel.x += newPosition[1];
		karel.y += newPosition[0];
		karel.movementSequence.push("move");

	}
	else{
		if(!errorMessage)errorMessage = "Bad movement from "+ currentKarel;
		karel.movementSequence.push("kill");

	}

}


var checkBeepers = function (karel){

var beepers = parseInt(world[karel.y][karel.x]);
			
	if(beepers > 0){
		world[karel.y][karel.x] = (beepers - 1).toString() ;
		karel.beeperCount++;	
	} 
	else{
		if(!errorMessage)errorMessage = "No beeper to pick from " + currentKarel;
		karel.movementSequence.push("kill");
	}
}
var pickbeeper = function (karel){
	karel.movementSequence.push("pickbeeper");
}
var putbeeper = function (karel){
	karel.movementSequence.push("putbeeper");
}
var rotateAnimation = function(karel, duration){
	var self = karel;
	setTimeout(function (){
		self.karelModel.rotation.y += Math.PI / 2;
	}, duration);
}

var moveAnimation = function(karel, duration){
	var self = karel;
	setTimeout(function (){
		self.karelModel.translateX(maze.cellSize);
	}, duration);
}
var pickbeeperAnimate = function(karel, duration){
	var self = karel;
	
	setTimeout(function (){
		var sceneObject = scene.getObjectByName(translateToMatricialY(self.karelModel.position.x).toString()+translateToMatricialX(self.karelModel.position.z).toString());
		scene.remove(sceneObject);

	}, duration);
}
var putbeeperAnimate = function(karel, duration){
	var self = karel;
	setTimeout(function (){
		sphere = new THREE.Mesh(geometrySphere, new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('textures/beeper.jpg')}));
		sphere.position.z = self.karelModel.position.z;
		sphere.position.x =  self.karelModel.position.x;
		sphere.name=translateToMatricialY(self.karelModel.position.x).toString()+translateToMatricialX(self.karelModel.position.z).toString();	
		console.log(sphere);
		scene.add(sphere);
	}, duration);
}
var killAnimate = function(karel, duration){
	var self = karel;
	setTimeout(function(){
		alert(errorMessage);
	},duration);
}

function animate() {


		requestAnimationFrame(animate);

		sphere.rotation.y -= 0.01;

		//camera.position.x += (mouseX - camera.position.x) * 0.05;
		//camera.position.y += (-mouseY - camera.position.y) * 0.05;

		renderer.render(scene, camera);

};

var hashCheck = {
	"FRONT": {
		"FRONT": [-1,0],
		"BACK": [1,0],
		"LEFT": [0,-1],
		"RIGHT": [0,1]
	},
	"BACK": {
		"FRONT": [1,0],
		"BACK": [-1,0],
		"LEFT": [0,1],
		"RIGHT": [0,-1]
	},
	"RIGHT": {
		"FRONT": [0,1],
		"BACK": [0,-1],
		"LEFT": [-1,0],
		"RIGHT": [1,0]
	},
	"LEFT": {
		"FRONT": [0,-1],
		"BACK": [0,1],
		"LEFT": [1,0],
		"RIGHT": [-1,0]
	}
}

var checkedPos;

function execute(){
	addKarel();
	addKarelModel(karelArr[0], 0);

	var ifStack = [], callStack = [];
	var i=beginProgram;
	var checkIfClear = function (karel, checkedPos) {
		if((karel.y+checkedPos[0])<maze.width
				&& (karel.x + checkedPos[1])<maze.width
				&& (karel.y+checkedPos[0])>=0
				&& (karel.x + checkedPos[1])>=0
				&& (world[karel.y + checkedPos[0]][karel.x + checkedPos[1]] != "W")) {
			ifStack.push(1);

		}
		else{
			ifStack.push(0);
		}
	},
	checkIfBlocked = function (karel, checkedPos) {
		if(karel.y+checkedPos[0]>=maze.width
			&& karel.x + checkedPos[1]>=maze.width
			&& karel.y+checkedPos[0]<0
			&& karel.x + checkedPos[1]<0
			&& world[karel.y+checkedPos[0]][karel.x+checkedPos[1]]=="W"){
			ifStack.push(1);
		}
		else{
			ifStack.push(0);
		}
	};
	while(InterCode[i] != instructions.TURNOFF){
		console.log("i: "+i+" @ "+currentKarel);
		switch(InterCode[i]){

			case instructions.MOVE:
					move(karelArr[currentKarel]);
					break;

			case instructions.TURNLEFT:
					rotate(karelArr[currentKarel]);
					break;

			//CASES FOR FACING
			case instructions.FACING_NORTH:
				if(karelArr[currentKarel].facingIndex==0){
					ifStack.push(1);
				}
				else{ifStack.push(0);}

				break;
			case instructions.FACING_WEST:
				if(karelArr[currentKarel].facingIndex==1){
					ifStack.push(1);
				}
				else{ifStack.push(0);}

				break;
			case instructions.FACING_SOUTH:
				if(karelArr[currentKarel].facingIndex==2){
					ifStack.push(1);
				}
				else{ifStack.push(0);}

				break;
			case instructions.FACING_EAST:
				if(karelArr[currentKarel].facingIndex==3){
					ifStack.push(1);
				}
				else{ifStack.push(0);}

				break;

			//CASES FOR NOT FACING
			case instructions.NOT_FACING_NORTH:
				if(karelArr[currentKarel].facingIndex!=0){
					ifStack.push(1);
				}
				else{ifStack.push(0);}

				break;
			case instructions.NOT_FACING_WEST:
				if(karelArr[currentKarel].facingIndex!=1){
					ifStack.push(1);
				}
				else{ifStack.push(0);}

				break;
			case instructions.NOT_FACING_SOUTH:
				if(karelArr[currentKarel].facingIndex!=2){
					ifStack.push(1);
				}
				else{ifStack.push(0);}

				break;
			case instructions.NOT_FACING_EAST:
				if(karelArr[currentKarel].facingIndex!=3){
					ifStack.push(1);
				}
				else{ifStack.push(0);}

				break;

			//CASES FOR CLEAR AND BLOCKED
			case instructions.FRONT_IS_CLEAR:
				console.log("Checking front is clear")
				checkedPos=hashCheck.FRONT[facing[karelArr[currentKarel].facingIndex]];
				console.log("Row: "+(karelArr[currentKarel].y+checkedPos[0])+" column: "+(karelArr[currentKarel].x+checkedPos[1]));
				checkIfClear(checkedPos);
				break;
			case instructions.FRONT_IS_BLOCKED:
				checkedPos=hashCheck.FRONT[facing[karelArr[currentKarel].facingIndex]];
				checkIfBlocked(checkedPos);

				break;
			case instructions.LEFT_IS_CLEAR:
				checkedPos=hashCheck.LEFT[facing[karelArr[currentKarel].facingIndex]];
				checkIfClear(checkedPos);

				break;
			case instructions.LEFT_IS_BLOCKED:
				checkedPos=hashCheck.LEFT[facing[karelArr[currentKarel].facingIndex]];
				checkIfBlocked(checkedPos);

				break;
			case instructions.RIGHT_IS_CLEAR:
				checkedPos=hashCheck.RIGHT[facing[karelArr[currentKarel].facingIndex]];
				checkIfClear(checkedPos);

				break;
			case instructions.RIGHT_IS_BLOCKED:
				checkedPos=hashCheck.RIGHT[facing[karelArr[currentKarel].facingIndex]];
				checkIfBlocked(checkedPos);

				break;
			case instructions.BACK_IS_CLEAR:
				checkedPos=hashCheck.BACK[facing[karelArr[currentKarel].facingIndex]];
				checkIfClear(checkedPos);

				break;
			case instructions.BACK_IS_BLOCKED:
				checkedPos=hashCheck.BACK[facing[karelArr[currentKarel].facingIndex]];
				checkIfBlocked(checkedPos);

				break;
			//CASES FOR BEEPERS
			case instructions.NEXT_TO_A_BEEPER:

				if(parseInt(world[karelArr[currentKarel].y][karelArr[currentKarel].x]) > 0){
					ifStack.push(1);
				}
				else{
					ifStack.push(0);

				}
				break;
			case instructions.NOT_NEXT_TO_A_BEEPER:

				if(!(parseInt(world[karelArr[currentKarel].y][karelArr[currentKarel].x]) > 0)){
					ifStack.push(1);
				}
				else{
					ifStack.push(0);
				}
				break;
			case instructions.ANY_BEEPERS_IN_BEEPER_BAG:
				if(karelArr[currentKarel].beeperCount > 0){
					ifStack.push(1);
				}
				else{ifStack.push(0);
				}
				break;
			case instructions.NOT_ANY_BEEPERS_IN_BEEPER_BAG:
				if(karelArr[currentKarel].beeperCount == 0){
					ifStack.push(1);
				}
				else{ifStack.push(0);
				}
				break;

			case instructions.JMP:
					var x;
					var result;
					var cond=0;
					console.log(ifStack);
					while(ifStack.length != 0){
						x = ifStack[ifStack.length-1];
						ifStack.splice(ifStack.length-1,1);
						console.log(x + " | " + ifStack);
						console.log("Cond: "+cond)
						if(x < 2){
							cond += x;
						}
						if(x == instructions.NOT){
							 cond = !cond;
						}
						console.log("Cond: "+cond)
						if(x == instructions.AND){
							if(cond == 2){
								cond = 1;
							}
							else{
								cond = 0;
							}
						}
						if(x == instructions.OR){
							if(cond > 0){
								cond = 1;
							}
							else{
								cond = 0;
							}
						}
						if(x == 4){
							ifStack = [];
						}
					}
					if(cond){
						i++;
						console.log("GO!");
					}else{
						i = InterCode[i+1] - 1;
						console.log("NVM");
					}
					break;
			case instructions.IF:
					ifStack.push(InterCode[i]);
					break;
			case instructions.NOT:
					ifStack.push(InterCode[i]);
					break;
			case instructions.OR:
					ifStack.push(InterCode[i]);
					break;
			case instructions.AND:
					ifStack.push(InterCode[i]);
					break;
			case instructions.CALL:
					callStack.push(i+1);
					i = InterCode[i+1]-1;
					break;

			case instructions.RET:
					i = callStack[callStack.length-1];
					callStack.splice(callStack.length-1,1);
					break;

			case instructions.PICKBEEPER:
					checkBeepers(karelArr[currentKarel]);
					//kill
					if(world[karelArr[currentKarel].y][karelArr[currentKarel].x] == "0"){
						world[karelArr[currentKarel].y][karelArr[currentKarel].x] = "";
						pickbeeper(karelArr[currentKarel]);
					}
					
					break;
			case instructions.PUTBEEPER:
					if(karelArr[currentKarel].beeperCount == 0){
						if(!errorMessage)errorMessage = "No beepers to put from "+ currentKarel;
						karelArr[currentKarel].movementSequence.push("kill");
					}
					var beepers = parseInt(world[karelArr[currentKarel].y][karelArr[currentKarel].x]);
					console.log("Beepers "+beepers);
					if(isNaN(beepers)){
						world[karelArr[currentKarel].y][karelArr[currentKarel].x] = 1
						putbeeper(karelArr[currentKarel]);
					}
					else{
						world[karelArr[currentKarel].y][karelArr[currentKarel].x] = (beepers + 1).toString();
					}	
					karelArr[currentKarel].beeperCount--;
					break;
			case instructions.CLONE:
					addKarel();
					karelArr[karelArr.length-1].startSequence = karelArr[currentKarel].movementSequence.length;
					karelArr[karelArr.length-1].x = karelArr[currentKarel].x;
					karelArr[karelArr.length-1].y = karelArr[currentKarel].y;
					console.log("Clone position ");
					console.log(karelArr[karelArr.length-1])
					karelArr[karelArr.length-1].parent = currentKarel;
					karelArr[karelArr.length-1].facingIndex = karelArr[currentKarel].facingIndex;
					addKarelModel(karelArr[karelArr.length-1], karelArr.length-1);
					currentKarel = karelArr.length-1;
					break;
			case instructions.CLONE_END:
					currentKarel = karelArr[currentKarel].parent;
					break;
			default:
					alert("Unknown command " + InterCode[i]);


		}
		console.log("i: "+i+" InterCode: "+InterCode[i]);
		i++;

	}
	function initialize(karel, duration){
		var self = karel;
		setTimeout(
			function(){scene.add(self.karelModel)
		}, duration);
	}
	
		var duration, deltaDuration=500;
		for(var k = 0 ; k < karelArr.length ; k++){
			console.log("Karel in position ",k);
			console.log(karelArr[k]);
			
			duration = initialDuration+((karelArr[k].startSequence)*deltaDuration);
			initialize(karelArr[k], duration);
			for(var p=0;p<karelArr[k].movementSequence.length;p++){
				duration+=deltaDuration;
				var currentAnimationKarel = karelArr[k];
				console.log(duration + "Object:Object" + currentAnimationKarel.karelModel.name);
				switch(currentAnimationKarel.movementSequence[p]){
					case 'move':
						moveAnimation(currentAnimationKarel, duration);
						break;
					case 'rotate':
						rotateAnimation(currentAnimationKarel, duration);
						break;
					case 'pickbeeper':
						pickbeeperAnimate(currentAnimationKarel, duration);	
						break;
					case 'putbeeper':
						putbeeperAnimate(currentAnimationKarel, duration);	
						break;
					case 'kill':
						killAnimate(currentAnimationKarel,duration);
						return;
				}
			}
		}
	}
