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



