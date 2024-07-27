/* 
creates a 3D game of flappy bird, with a bunny instead of a bird 

Dimensions of objects
Whole scene: -520 to 520 on the x-axis, -250 to 250 on the y-axis
Bunny: -[bodyRadius*bodyScale+tailRadius] to [bodyRadius*bodyScale+headRadius]
		-16 to 20 on the x-axis

		-[bodyRadius+appRadius] to [bodyRadius+headRadius+appRadius*appScale]
		-12 to 26 on the y-axis

		-[bodyRadius] to [bodyRadius]
		-10 to 10 on the z-axis
All pipe sets: [pipeOffsetX-pipeEndRadius] to [pipeOffsetX-pipeEndRadius]+[pipeOffsetX*number of pipes]
			   114 to 634 on the x-axis

			  -250 to 250 on the y-axis

			  -[pipeEndRadius] to [pipeEndRadius]
			  -16 to 16 on the z-axis

*/

var params = {
	fovy: 50,
	cameraAdjustX: -200,
	cameraAdjustX2: 400,
	cameraAdjustY: 0,

	bunnyScale: 2,
    bunnyStartOffset: -300,
	pipeRadius: 25,
	pipeCylDetail: 20,
	topPipeHeights: [140, 160, 150, 80, 20, 10, 30, 50],
	pipeColor: new THREE.Color(0x339933), // light green
	pipeEndColor: new THREE.Color(0x246B24), // dark green
	pipeEndRadius: 26,
	pipeEndHeight: 7,
    pipeSpaceHeight: 150, // space between top and bottom pipes (vertical)
	pipeOffsetX: 300, // space between pipe sets (horizontal)
	numPipes: 7,

	ambLightColor: 0xffffff, // soft, light gray
	directionalLightColor: 0xffffff, // white
	lightIntensity: .3,
	directionalX: 0, 
	directionalY: 2,
	directionalZ: 4,

	deltaT: 0.0035,
	bunnyDeltaY: 2.3,
	bunnyDeltaZ: 5,
	bunnyJumpY: 40,
	bunnyTiltDown: TW.degrees2radians(-2),
	bunnyTiltUp: TW.degrees2radians(30),
	tiltDownMax: -Math.PI/8,
	tiltUpMax: 0,
	pipesDeltaX: 2,
	plane1Delta: 1,
	plane2Delta: 0.5,

	scorePosX: -300,
	endTextPosX: -500
};

var scene = new THREE.Scene();

var sceneWidth = params.numPipes*params.pipeOffsetX;

var renderer = new THREE.WebGLRenderer();
function render() {
    renderer.render(scene, camera);
}

TW.mainInit(renderer,scene);

var canvas = TW.lastClickTarget;
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

// creates a custom camera
function myCamera(fovy, eye, at) {
	var canvas = TW.lastClickTarget;
	camera = new THREE.PerspectiveCamera( fovy, canvasWidth/canvasHeight, 1, sceneWidth*2);
	camera.position.copy(eye);
	camera.lookAt(at);
	scene.add(camera);
}

//adjust camera to display scene with bunny on far left and zoomed in view 
var eye = new THREE.Vector3(params.cameraAdjustX, params.cameraAdjustY, 500);
var at = new THREE.Vector3(params.cameraAdjustX, params.cameraAdjustY, 0);
myCamera(params.fovy, eye, at);
render();

/* toggle camera for different levels. level 2 moves the camera to the far left */
function changeView(level) {
	 scene.remove(camera);
	 if(level == 1) {
	 	//set camera for level 1
	 	var eye = new THREE.Vector3(params.cameraAdjustX,
	 		params.cameraAdjustY, 500);
	 	var at = new THREE.Vector3(params.cameraAdjustX, params.cameraAdjustY, 0);
	 	myCamera(params.fovy, eye, at);
	 } else if(level == 2) {
	 	//set camera for level 2
	 	var eye = new THREE.Vector3(params.cameraAdjustX-params.cameraAdjustX2,
	 		params.cameraAdjustY, 500);
	 	var at = new THREE.Vector3(params.cameraAdjustX, params.cameraAdjustY, 0);
	 	myCamera(params.fovy, eye, at);
	 }
	 render();
 }

var bunny, pipes, plane1, plane2;
// bounding boxes around bunny and pipes
var bunnyBox; 
var pipeBoxArray = new Array();

var texture = THREE.ImageUtils.loadTexture( "images/cutecloud.jpg" );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 4, 4 );

/* adds and positions background sphere, a bunny, all pipe sets, airplanes, and 
	lights to the scene */
function buildScene(params, scene) {
	var sphereBackground = new THREE.Mesh(
 		new THREE.SphereGeometry(sceneWidth, 50, 50),
  		new THREE.MeshBasicMaterial({
    		map: texture
  		})
	);
	sphereBackground.scale.x = -1;
	scene.add(sphereBackground);

	bunny = awangatangBunny();
    bunny.position.x = params.bunnyStartOffset;
    // enlarge bunny
    bunny.scale.set(params.bunnyScale, params.bunnyScale, params.bunnyScale); 
    bunny.name = "rabbit";
	scene.add(bunny);
	bunnyBox = new THREE.Box3();
	bunnyBox.setFromObject(bunny);

	pipes = buildAllPipes(params.numPipes);
	for(pipeIndex in pipes) {
		scene.add(pipes[pipeIndex]);
	} 

	plane1 = makePlane();
	scene.add(plane1);
	plane1.position.set(0, -200, -20);

	plane2 = makePlane();
	scene.add(plane2);
	plane2.position.set(-300, 150, 40);
	plane2.rotation.y = Math.PI;

	var ambLight = new THREE.AmbientLight(params.ambLightColor);
	scene.add(ambLight);

	var directionalLight = new THREE.DirectionalLight(params.directionalLightColor,
													  params.lightIntensity);
    directionalLight.position.set( params.directionalX, 
                                   params.directionalY, 
                                   params.directionalZ ); 
    scene.add(directionalLight);

	render();
}	

buildScene(params, scene);

// animation starts

var onLevel2 = false;

function resetAnimationState() {
    animationState = {
        bunnyPosY: 0, // fall from initial height
        bunnyPosZ: 0,
        pipePosX: params.pipeOffsetX,
        time: 0
    };
}
