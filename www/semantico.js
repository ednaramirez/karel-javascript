var camera,
		scene,
		renderer,
		geometry,
		material,
		mesh,
		karel,
		sphere,
		pointLight,
		plane,
		plane2,
		plane3,
		plane4,
		center,
		facing = ['FRONT', 'LEFT', 'BACK', 'RIGHT'],
		facingIndex = 0,
		rays = [
			new THREE.Vector3(0, 0, 1),
			new THREE.Vector3(1, 0, 1),
			new THREE.Vector3(1, 0, 0),
			new THREE.Vector3(1, 0, -1),
			new THREE.Vector3(0, 0, -1),
			new THREE.Vector3(-1, 0, -1),
			new THREE.Vector3(-1, 0, 0),
			new THREE.Vector3(-1, 0, 1)
		];

var mouseX = 0,
		mouseY = 0,
		mouseZ = 0;
var world = [
			['','','','','W',''],
			['','','','','W','2'],
			['','','','','','1'],
			['','','','W','',''],
			['','','','','',''],
			['','','','','','']
			];
var maze = {width: world.length, large:world.length, cellSize:500};

var karelPosX, karelPosY;
var karelArr = [];
var karelStartPosition = [0];
var currentKarel = 0;
var movementSequence = [];
var beginProgram;

window.wallGeometries = [];
var beeperArray = [];
function addKarel (){
	var loader = new THREE.OBJMTLLoader();
	loader.load( "android.obj", "android.mtl", function( object ) {

		object.scale.x=object.scale.z=object.scale.y=100;
		object.traverse( function ( child )
		{
			if ( child instanceof THREE.Mesh )
				child.material.color.setRGB (Math.random(), Math.random(), Math.random());
		});

		karelArr[currentKarel] = object;
		karelArr[currentKarel].rotation.y += Math.PI / 2;
		karelArr[currentKarel].position.x = 0;
		karelArr[currentKarel].position.z = 0;

		scene.add(karelArr[currentKarel++]);
	} );
}
function init() {

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
		//camera.position.x = (posInitial.x-maze.width/2)*maze.cellSize;
		//camera.position.z = (posInitial.z-maze.large/2)*maze.cellSize-maze.cellSize/2;
		camera.position.set(0,5000,0);
		center = new THREE.Vector3(0,0,0);
		camera.lookAt(center);
		camera.rotateOnAxis((new THREE.Vector3(0, 0, 1)).normalize(), Math.PI);
		geometry = new THREE.CubeGeometry(maze.cellSize/2, maze.cellSize/2, maze.cellSize/2,16,16);
		geometrySphere = new THREE.SphereGeometry(maze.cellSize/2, 16, 16);
		material = new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: true, side: THREE.DoubleSide});
		geometryPlane = new THREE.CubeGeometry(maze.width*maze.cellSize, maze.large*maze.cellSize,20);
		geometryPlaneBasic = new THREE.CubeGeometry(maze.cellSize, maze.cellSize, maze.cellSize);


		var texture = THREE.ImageUtils.loadTexture('textures/floor5b.jpg', {}, function(){
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



//		karel = new THREE.Mesh(geometrySphere, new THREE.MeshBasicMaterial({map : wallTexture,color: 0x00ff00, wireframe: false}));





		plane2 = new THREE.Mesh(geometryPlane, material);
		plane2.rotation.x = -Math.PI/2;
		plane2.position.y=-250;
		//plane.position.x = 0;
		//plane.position.z = 0;

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
					
					sphere = new THREE.Mesh(geometrySphere, new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('textures/fire_texture.jpg')}));
					sphere.position.z = translateToCartesianX(j)*maze.cellSize;
					sphere.position.x = translateToCartesianY(i)*maze.cellSize;
					sphere.name= i.toString() + j.toString();	
					scene.add(sphere);
				}
			}
		}
		//wall.rotation.x = -Math.PI/2;
		karelPosX = translateToMatricialX(0);
		karelPosY = translateToMatricialY(0);

		addKarel();
		scene.add(sphere);

		scene.add(plane2);

		//addiding some light to the scene
		pointLight = new THREE.DirectionalLight( 0xffffff );
		pointLight.position.set( 0, 0, 1 ).normalize();
		var ambientLight = new THREE.AmbientLight(0xffffff);
		scene.add(ambientLight);
		scene.add(pointLight);


		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		window.camera = camera;
		document.body.insertBefore(renderer.domElement, document.getElementById('footer'));
		document.addEventListener('keydown', onDocumentKeyDown, false);

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
	//console.log(Math.round(position/maze.cellSize));
	//console.log((Math.floor(maze.width/2)));
	return (Math.floor(maze.width/2)) + Math.round(position/maze.cellSize);
}

function onDocumentKeyDown(e){
		var keyCode = e.which||e.keyCode;
		if(keyCode == 87){
			move();
		}
		if(keyCode == 65){
			rotate();
		}

};

var rotate = function(){
	facingIndex++;
	if(facingIndex==4) {
		facingIndex = 0;
	}
	movementSequence.push("rotate");
	//karel.rotation.y += Math.PI / 2;
}
var move = function (){
	var newPosition = hashCheck['FRONT'][facing[facingIndex]];
	if((karelPosY+newPosition[0])<maze.width
			&& (karelPosX + newPosition[1])<maze.width
			&& (karelPosY+newPosition[0])>=0
			&& (karelPosX + newPosition[1])>=0
			&& (world[karelPosY + newPosition[0]][karelPosX + newPosition[1]] != "W")) {
		karelPosX += newPosition[1];
		karelPosY += newPosition[0];
		movementSequence.push("move");

	}
	//karel.translateX(maze.cellSize);

}
var pickbeeper = function (){
	movementSequence.push("pickbeeper");
}
var putbeeper = function (){
	movementSequence.push("putbeeper");
}
var rotateAnimation = function(){
	karelArr[0].rotation.y += Math.PI / 2;
}

var moveAnimation = function(){

	karelArr[0].translateZ(maze.cellSize);
}
var pickbeeperAnimate = function(){
	var sceneObject = scene.getObjectByName(karelPosY.toString() + karelPosX.toString());
	scene.remove(sceneObject);
	
}
var putbeeperAnimate = function(x,y){
	sphere = new THREE.Mesh(geometrySphere, new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('textures/fire_texture.jpg')}));
	sphere.position.z = translateToCartesianX(karelPosX)*maze.cellSize;
	sphere.position.x = translateToCartesianY(karelPosY)*maze.cellSize;
	sphere.name= karelPosY.toString() + karelPosX.toString();	
	scene.add(sphere);
	
	
}
function checkCollide(){
	ray = new THREE.Raycaster();
	ray.far=100;
	for (i = 0; i < rays.length; i ++ ) {
		ray.set(karel.position, rays[i]);
		if(ray.intersectObjects(wallGeometries).length>0){
				karel.translateX(-maze.cellSize/2);
				break;
		}
		if(ray.intersectObject(mesh).length>0){
				scene.remove(mesh);
				document.getElementById('cube').setAttribute('style','text-decoration:line-through;color:#007700');
				break;
		}
		if(ray.intersectObject(sphere).length>0){
				scene.remove(sphere);
				document.getElementById('ball').setAttribute('style','text-decoration:line-through;color:#EE8712');
				break;
		}
	}
}

function animate() {


		requestAnimationFrame(animate);

		sphere.rotation.y -= 0.01;

		//camera.position.x += (mouseX - camera.position.x) * 0.05;
		//camera.position.y += (-mouseY - camera.position.y) * 0.05;

		renderer.render(scene, camera);

};

var beeperCount=0;;
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
	var ifStack = [], callStack = [];
	var i=beginProgram;
	var checkIfClear = function () {
		if((karelPosY+checkedPos[0])<maze.width
				&& (karelPosX + checkedPos[1])<maze.width
				&& (karelPosY+checkedPos[0])>=0
				&& (karelPosX + checkedPos[1])>=0
				&& (world[karelPosY + checkedPos[0]][karelPosX + checkedPos[1]] != "W")) {
			ifStack.push(1);

		}
		else{
			ifStack.push(0);
		}
	},
	checkIfBlocked = function (checkedPos) {
		if(karelPosY+checkedPos[0]>=maze.width
			&& karelPosX + checkedPos[1]>=maze.width
			&& karelPosY+checkedPos[0]<0
			&& karelPosX + checkedPos[1]<0
			&& world[karelPosY+checkedPos[0]][karelPosX+checkedPos[1]]=="W"){
			ifStack.push(1);
		}
		else{
			ifStack.push(0);
		}
	};
	while(InterCode[i] != instructions.TURNOFF){
		console.log("i: "+i+" @");
		switch(InterCode[i]){

			case instructions.MOVE:

					move();

					break;

			case instructions.TURNLEFT:
					rotate();
					break;


			//CASES FOR FACING
			case instructions.FACING_NORTH:
				if(facingIndex==0){
					ifStack.push(1);
				}
				else{ifStack.push(0);}

				break;
			case instructions.FACING_WEST:
				if(facingIndex==1){
					ifStack.push(1);
				}
				else{ifStack.push(0);}

				break;
			case instructions.FACING_SOUTH:
				if(facingIndex==2){
					ifStack.push(1);
				}
				else{ifStack.push(0);}

				break;
			case instructions.FACING_EAST:
				if(facingIndex==3){
					ifStack.push(1);
				}
				else{ifStack.push(0);}

				break;

			//CASES FOR NOT FACING
			case instructions.NOT_FACING_NORTH:
				if(facingIndex!=0){
					ifStack.push(1);
				}
				else{ifStack.push(0);}

				break;
			case instructions.NOT_FACING_WEST:
				if(facingIndex!=1){
					ifStack.push(1);
				}
				else{ifStack.push(0);}

				break;
			case instructions.NOT_FACING_SOUTH:
				if(facingIndex!=2){
					ifStack.push(1);
				}
				else{ifStack.push(0);}

				break;
			case instructions.NOT_FACING_EAST:
				if(facingIndex!=3){
					ifStack.push(1);
				}
				else{ifStack.push(0);}

				break;

			//CASES FOR CLEAR AND BLOCKED
			case instructions.FRONT_IS_CLEAR:
				console.log("Checking front is clear")
				checkedPos=hashCheck.FRONT[facing[facingIndex]];
				console.log("Row: "+(karelPosY+checkedPos[0])+" column: "+(karelPosX+checkedPos[1]));
				checkIfClear(checkedPos);
				break;
			case instructions.FRONT_IS_BLOCKED:
				checkedPos=hashCheck.FRONT[facing[facingIndex]];
				checkIfBlocked(checkedPos);

				break;
			case instructions.LEFT_IS_CLEAR:
				checkedPos=hashCheck.LEFT[facing[facingIndex]];
				checkIfClear(checkedPos);

				break;
			case instructions.LEFT_IS_BLOCKED:
				checkedPos=hashCheck.LEFT[facing[facingIndex]];
				checkIfBlocked(checkedPos);

				break;
			case instructions.RIGHT_IS_CLEAR:
				checkedPos=hashCheck.RIGHT[facing[facingIndex]];
				checkIfClear(checkedPos);

				break;
			case instructions.RIGHT_IS_BLOCKED:
				checkedPos=hashCheck.RIGHT[facing[facingIndex]];
				checkIfBlocked(checkedPos);

				break;
			case instructions.BACK_IS_CLEAR:
				checkedPos=hashCheck.BACK[facing[facingIndex]];
				checkIfClear(checkedPos);

				break;
			case instructions.BACK_IS_BLOCKED:
				checkedPos=hashCheck.BACK[facing[facingIndex]];
				checkIfBlocked(checkedPos);

				break;
			//CASES FOR BEEPERS
			case instructions.NEXT_TO_A_BEEPER:

				if(parseInt(world[karelPosY][karelPosX])>0){
					ifStack.push(1);
				}
				else{
					ifStack.push(0);

				}
				break;
			case instructions.NOT_NEXT_TO_A_BEEPER:

				if(!(parseInt(world[karelPosY][karelPosX])>0)){
					ifStack.push(1);
				}
				else{
					ifStack.push(0);
				}
				break;
			case instructions.ANY_BEEPERS_IN_BEEPER_BAG:
				if(beeperCount >0){
					ifStack.push(1);
				}
				else{ifStack.push(0);
				}
				break;
			case instructions.NOT_ANY_BEEPERS_IN_BEEPER_BAG:
				if(beeperCount == 0){
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
					// cond = 0;
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
				var beepers = parseInt(world[karelPosY][karelPosX]);
			
					if(beepers > 0){
						world[karelPosY][karelPosX] = (beepers - 1).toString() ;
						beeperCount++;	
					} 
					if(world[karelPosY][karelPosX] == "0"){
						pickbeeper();
					}
					
					break;
			case instructions.PUTBEEPER:

					var beepers = parseInt(world[karelPosY][karelPosX]);
					if(isNaN(beepers)){
						world[karelPosY][karelPosX] = 1
						putbeeper(karelPosY,karelPosX);
					}
					else{
					world[karelPosY][karelPosX] = (beepers  +1).toString() ;
					}	
					beeperCount--;
					break;
			case instructions.CLONE:
					karelStartPosition.push(movementSequence.length-1);
					console.log("KAGEBUNSHINNOJUTSU!!");
					break;
			case instructions.CLONE_END:
					console.log("Clone Cancel");
					break;
			default:
					alert("Unknown command " + InterCode[i]);


		}
		console.log("i: "+i+" InterCode: "+InterCode[i]);
		i++;

	}

	var duration = 0, deltaDuration=500;
	for(var p=0;p<movementSequence.length;p++){
		duration+=deltaDuration;
		console.log(duration);
		switch(movementSequence[p]){
			case 'move':
				setTimeout(moveAnimation,duration);
				break;
			case 'rotate':
				setTimeout(rotateAnimation,duration);
				break;
			case 'pickbeeper':
				setTimeout(pickbeeperAnimate,duration);	
				break;
			case 'putbeeper':
				setTimeout(putbeeperAnimate,duration);	
				break;
		}
	}


}
