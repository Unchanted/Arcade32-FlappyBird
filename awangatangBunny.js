function awangatangBunny() {

 	var bunnyParams = {
	bodyRadius: 10,
	bodyScale: 1.2,
	headRadius: 8,
	sphereDetail: 20,
	appRadius: 2,
	appScale: 4,
	tailRadius: 4,
	furColor: new THREE.Color(0xF0F0F0),
	texture: new THREE.ImageUtils.loadTexture( "/images/fur.jpg",
                                                     THREE.UVMapping,
                                                     // onload event handler
                                                     function () {
                                                         console.log("image is loaded.");
                                                         imageLoaded = true;
                                                         render();
                                                     })
	

};

// creates a material for the bunny with fur texture
var bunnyMat = new THREE.MeshPhongMaterial( {color: bunnyParams.furColor,
											ambient: bunnyParams.furColor,
											specular: 0xFFFFFF,
											shininess: 5,
											map: bunnyParams.texture} );
/* returns complete bunny object with head & ears, body, feet, and tail */
function buildBunny() {
	var bunny = new THREE.Object3D();
	var body = buildBody();
	bunny.add(body);

	var head = buildHead();
	head.position.set(bunnyParams.bodyScale*bunnyParams.bodyRadius, 
					  bunnyParams.bodyRadius, 
					  0);
	bunny.add(head);

	var feet = buildFeetSet();
	feet.position.set(0,-bunnyParams.bodyRadius,0);
	bunny.add(feet);

	var tail = buildTail();
	tail.position.set(-bunnyParams.bodyRadius*bunnyParams.bodyScale,bunnyParams.bodyRadius-2,0);
	bunny.add(tail);

	return bunny;
}

/* returns a sphere mesh for the body */
function buildBody() {
	var bunnyGeom = new THREE.SphereGeometry(bunnyParams.bodyRadius, 
		bunnyParams.sphereDetail, bunnyParams.sphereDetail);

	var bunnyMesh = new THREE.Mesh(bunnyGeom, bunnyMat);

	bunnyMesh.scale.x = bunnyParams.bodyScale;
	return bunnyMesh;
}

/* returns a head object including ears
   calls buildEarSet() */
function buildHead() {
	var head = new THREE.Object3D();
	var headGeom = new THREE.SphereGeometry(bunnyParams.headRadius,
		bunnyParams.sphereDetail, bunnyParams.sphereDetail);
    var headMesh = new THREE.Mesh(headGeom, bunnyMat);
    head.add(headMesh);

    var ears = buildEarSet();
	ears.position.set(0, bunnyParams.headRadius, 0);
	head.add(ears);
    return head;
}

/* returns a flattened 3D ellipse to be used as ears and feet */
function buildAppendage() {
	var appGeom = new THREE.SphereGeometry(bunnyParams.appRadius, 
		bunnyParams.sphereDetail, bunnyParams.sphereDetail);

	var appMesh = new THREE.Mesh(appGeom, bunnyMat);

	appMesh.scale.y = bunnyParams.appScale;
	return appMesh;
}

/* returns an ear set object
   positions earLeft and earRight left and right of center, respectively (x-axis)
   calls buildAppendage() */
function buildEarSet() {
	var ears = new THREE.Object3D();
	var earLeft = buildAppendage();
	var earRight = buildAppendage();
	earLeft.position.x = -bunnyParams.headRadius/4;
	earRight.position.x = bunnyParams.headRadius/4;
	ears.add(earLeft);
	ears.add(earRight);
	return ears;
}

/* returns a feet set object 
   positions footLeft and footRight left and right of center, respectively (x-axis)
   rotates the feet to the proper orientation (long-side horizontally on x-axis) 
   calls buildAppendage() */
function buildFeetSet() {
	var feet = new THREE.Object3D();
	var footLeft = buildAppendage();
	var footRight = buildAppendage();
	footLeft.rotation.z = Math.PI/2;
	footRight.rotation.z = Math.PI/2;
	footLeft.position.x = -(bunnyParams.bodyRadius*bunnyParams.bodyScale)/2;
	footRight.position.x = (bunnyParams.bodyRadius*bunnyParams.bodyScale)/2;
	feet.add(footLeft);
	feet.add(footRight);
	return feet;
}

/* returns a sphere mesh for the tail */
function buildTail() {
	var tailGeom = new THREE.SphereGeometry(bunnyParams.tailRadius,
		bunnyParams.sphereDetail, bunnyParams.sphereDetail);
    var tailMesh = new THREE.Mesh(tailGeom, bunnyMat);

    return tailMesh;
}

var bunny = buildBunny();
return bunny;

}
