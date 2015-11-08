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

var maze = {width: 10, large:10, cellSize:500};

var angleY=0;
var angleX=0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var posInitial = {x:1, z:8};
var ray;

window.wallGeometries = [];

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
		geometryPlaneBasic = new THREE.CubeGeometry(maze.cellSize, maze.cellSize, 20);


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

		sphere = new THREE.Mesh(geometrySphere, new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture('textures/fire_texture.jpg')}));
		sphere.position.z = 2000;
		sphere.position.x = 1000;

		karel = new THREE.Mesh(geometrySphere, new THREE.MeshBasicMaterial({map : wallTexture,color: 0x00ff00, wireframe: false}));
		karel.position.x = maze.cellSize*-4;
		karel.position.z = maze.cellSize*4;


		plane2 = new THREE.Mesh(geometryPlane, material);
		plane2.rotation.x = -Math.PI/2;
		plane2.position.y=-250;
		//plane.position.x = 0;
		//plane.position.z = 0;

		var wall;
		var wallMaterial = new THREE.MeshBasicMaterial({ map : wallTexture, doubleSided: true,side: THREE.DoubleSide });

		for(var i=0; i<maze.width; i ++){
				wall = new THREE.Mesh(geometryPlaneBasic, wallMaterial);
				wall.position.z = maze.large/2*maze.cellSize;
				wall.position.y = 0;
				wall.position.x = (i-maze.width/2)*maze.cellSize+maze.cellSize/2;
				scene.add(wall);
				wallGeometries.push(wall);
				wall = new THREE.Mesh(geometryPlaneBasic, wallMaterial);
				wall.position.z = -maze.large/2*maze.cellSize;
				wall.position.y = 0;
				wall.position.x = (i-maze.width/2)*maze.cellSize+maze.cellSize/2;
				scene.add(wall);
				wallGeometries.push(wall);
		}
		for(var i=0; i<maze.large; i ++){
				wall = new THREE.Mesh(geometryPlaneBasic, wallMaterial);
				wall.position.x = maze.width/2*maze.cellSize;
				wall.rotation.y= Math.PI/2;
				wall.position.y = 0;
				wall.position.z = (i-maze.large/2)*maze.cellSize+maze.cellSize/2;
				scene.add(wall);
				wallGeometries.push(wall);
				wall = new THREE.Mesh(geometryPlaneBasic, wallMaterial);
				wall.position.x = -maze.width/2*maze.cellSize;
				wall.rotation.y= Math.PI/2;
				wall.position.y = 0;
				wall.position.z = (i-maze.large/2)*maze.cellSize+maze.cellSize/2;
				scene.add(wall);
				wallGeometries.push(wall);
		}

		var offsizeX=0;
		var offsizeZ=0;

		for(var i = 0; i<walls.length; i++){
				wallData = walls[i];
				wall = new THREE.Mesh(geometryPlaneBasic, wallMaterial);
				if(wallData.orientation=='front'){
						offsizeX=-250;
						offsizeZ=-maze.cellSize;
				}else if(wallData.orientation=='left'){
						offsizeX=-250;
						offsizeZ=0;
				}else if(wallData.orientation=='left'){
						offsizeX=-maze.cellSize;
						offsizeZ=-250;
				}else if(wallData.orientation=='right'){
						offsizeX=0;
						offsizeZ=-250;
				}
				wall.position.x = (wallData.x-maze.width/2)*maze.cellSize+offsizeX;
				wall.rotation.y= wallData.orientation=='left'||wallData.orientation=='right'?Math.PI/2:0;
				wall.position.y = 0;
				wall.position.z = (wallData.z-maze.large/2)*maze.cellSize+offsizeZ;
				scene.add(wall);
				wallGeometries.push(wall);
		}
		//wall.rotation.x = -Math.PI/2;


		scene.add(sphere);
		scene.add(karel);
		scene.add(plane2);

		//addiding some light to the scene
		pointLight = new THREE.DirectionalLight( 0xffffff );
		pointLight.position.set( 0, 0, 1 ).normalize();

		scene.add(pointLight);


		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		window.camera = camera;
		document.body.insertBefore(renderer.domElement, document.getElementById('footer'));
		document.addEventListener('keydown', onDocumentKeyDown, false);

};

function onDocumentMouseMove(e) {
		/*difference = mouseX-e.clientX;
		angleX-=incrementoX*difference;

		mouseX = e.clientX;
		if(mouseX<=windowHalfX-100&&difference>0){
				angleX-=incrementoX*5;
		}
		if(mouseX>=windowHalfX+100&&difference<0){
				angleX+=incrementoX*5;
		}
		//x movement ok
		e.preventDefault();
		*/
};
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
	if(facingIndex==4){
		facingIndex = 0;
	}
	karel.rotation.y += Math.PI / 2;
}
var move = function (){
	karel.translateX(maze.cellSize);
	checkCollide();
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

var karel2 = {
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

var ifStack = [];
function execute(){
//alert("Karel is in: row " + karel2.row + " column " + karel2.column);

var i=0, duration = 0, durationDelta = 1000;
var karePos = [{x:1 , z:2}];

var flagOR, flagNOT, flagAND;
// var ifStack = [];

while(InterCode[i] != instructions.TURNOFF){
	duration += durationDelta/16;
	console.log("i: "+i+" @");
	switch(InterCode[i]){

		case instructions.MOVE:

				// setTimeout(move,duration);
				// duration += durationDelta;
				move();

				break;

		case instructions.TURNLEFT:
			// setTimeout(rotate,duration);
			// duration += durationDelta;
			rotate();

				break;
		case instructions.PICKBEEPER:
				if(!isNaN(world[karel2.row][karel2.column]) && world[karel2.row][karel2.column]){
					if(Number(world[karel2.row][karel2.column]) - 1 == 0){
						world[karel2.row][karel2.column] = "";
					}
					else{
						var n = Number(world[karel2.row][karel2.column]) - 1;
						world[karel2.row][karel2.column] = n.toString();
					}
					karel2.beepers++;
					world[karel2.row][karel2.column] == "";
				}
				else{
					// alert("Kill me because of PICKBEEPER")
					return;
				}
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

		//CASES FOR CLEAR
		case instructions.FRONT_IS_CLEAR:
				ifStack.push(1);
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
		default:
				alert("Unknown command" + InterCode[i]);


	}
	console.log("i: "+i+" InterCode: "+InterCode[i]);
	i++;

}

}
