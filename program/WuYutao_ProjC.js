//=============================================================================
// Vertex shader program
//=============================================================================
var VSHADER_SOURCE =
	'precision highp float;\n' +
	'precision highp int;\n' +
	
	//-------------ATTRIBUTES of each vertex, read from our Vertex Buffer Object
	'attribute vec4 a_Position;\n' +
	'attribute vec4 a_Normal;\n' +

											
	//-------------UNIFORMS: values set from JavaScript before a drawing command.
	'uniform mat4 u_ModelMatrix;\n' +
	'uniform mat4 u_ProjMatrix;\n' +
	'uniform mat4 u_NormalMatrix;\n' +

	'uniform vec3 u_Ks;\n' +
	'uniform vec3 u_Ke;\n' +
	'uniform vec3 u_Ka;\n' +
	'uniform vec3 u_Kd; \n' +

	'uniform vec3 u_LightDiffuse;\n' +
	'uniform vec3 u_LightPosition;\n' +
	'uniform vec3 u_LightAmbient;\n' +
	'uniform vec3 u_LightSpecular;\n' +

	'uniform vec3 u_HeadlightDiffuse;\n' +
	'uniform vec3 u_HeadlightAmbient;\n' +
	'uniform vec3 u_HeadlightPosition;\n' +
	'uniform vec3 u_HeadlightSpecular;\n' +

	'uniform vec3 u_eyePosWorld; \n' +

	'uniform int headlightOn;\n' +
	'uniform int worldLightOn;\n' +
	'uniform int lMode;\n' +
	'uniform int sMode;\n' +

	'varying vec3 v_Kd;\n' +
	'varying vec4 v_Color;\n' +
	'varying vec3 v_Position;\n' +
	'varying vec3 v_Normal;\n' +

	'void main() {\n' +
	// Compute CVV coordinate values from our given vertex. This 'built-in'
	// 'varying' value gets interpolated to set screen position for each pixel.
	'	gl_Position = u_ProjMatrix * u_ModelMatrix * a_Position;\n' +
	// Calculate the vertex position & normal vec in the WORLD coordinate system
	// for use as a 'varying' variable: fragment shaders get per-pixel values
	// (interpolated between vertices for our drawing primitive (TRIANGLE)).
	'	v_Position = vec3(u_ModelMatrix * a_Position);\n' +
	// 3D surface normal of our vertex, in world coords.  ('varying'--its value
	// gets interpolated (in world coords) for each pixel's fragment shader.
	'	v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
	// find per-pixel diffuse reflectance from per-vertexa
	'	v_Kd = u_Kd; \n' +

	'	if(sMode == 0){\n' +
	'	}\n' +

	'	if(sMode == 1){\n' +
	'		vec3 normal = normalize(v_Normal); \n' +
	'		vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
	'		vec3 lightDirection_2 = normalize(u_HeadlightPosition - v_Position);\n' +
	'		vec3 eyeDirection = normalize(u_eyePosWorld - v_Position); \n' +
	//confused here.
	'		float nDotL = max(dot(lightDirection, normal), 0.0); \n' +
	'		float nDotL_2 = max(dot(lightDirection_2, normal),0.0);\n' +

	'		float nDotH = 0.0; \n' +
	'		float nDotH_2 = 0.0; \n' +

	'		if(lMode == 0){\n' +
	'			vec3 H = normalize(lightDirection + eyeDirection); \n' +
	'			nDotH = max(dot(H, normal), 0.0); \n' +
	'  			vec3 H_2 = normalize(lightDirection_2 + eyeDirection); \n' +
	'			nDotH_2 = max(dot(H_2, normal), 0.0); \n' +
	'		}\n' +

	'		if(lMode == 1){\n' +
	'  			vec3 L = normalize(lightDirection); \n' +
	'  			vec3 C = dot(normal, L)*normal; \n' +
	'		  	vec3 R = C + C - L; \n' +
	'  			nDotH = max(dot(eyeDirection, R), 0.0); \n' +
	'	  		vec3 L_2 = normalize(lightDirection_2); \n' +
	'	  		vec3 C_2 = dot(normal, L_2)*normal; \n' +
	'		  	vec3 R_2 = C_2 + C_2 - L_2; \n' +
	'  			nDotH_2 = max(dot(eyeDirection, R_2), 0.0); \n' +
	'		}\n' +

	'		float e32 = pow(nDotH,32.0); \n' +
	'		float e32_2 = pow(nDotH_2,32.0); \n' +

	'		vec4 emissive = vec4(u_Ke, 1.0);\n' +

	'		vec3 specular = u_LightSpecular * u_Ks * e32;\n' +
	'		vec3 ambient = u_LightAmbient * u_Ka;\n' +
	'		vec3 diffuse = u_LightDiffuse * v_Kd * nDotL;\n' +
	'		vec4 fragWorld = vec4(diffuse + ambient + specular,1.0);\n' +

	'		vec3 hspec = u_HeadlightSpecular * u_Ks * e32_2;\n' +
	'		vec3 hambi = u_HeadlightAmbient * u_Ka ;\n' +
	'		vec3 hdiff = u_HeadlightDiffuse * v_Kd * nDotL_2;\n' +
	'		vec4 fragHead = vec4(hdiff + hspec + hambi, 1.0);\n' +
	//no need for ambient of headlight

	'		vec4 frag;\n' +
	//headlight and world light determine
	'		if(headlightOn == 1 && worldLightOn == 1){\n' +
	'			frag = fragHead + fragWorld + emissive;\n' +
	'		}\n' +
	'		else if(headlightOn == 1 && worldLightOn == 0){\n' +
	'			frag = fragHead + emissive;\n' +
	'		}\n' +
	'		else\n' +
	'			frag = fragWorld + emissive;\n' +

	'		v_Color = frag;\n' +
	'	}\n' +
	'}\n';


//=============================================================================
// Fragment shader program
//=============================================================================
var FSHADER_SOURCE =
	'precision highp float;\n' +
	'precision highp int;\n' +

	'varying vec3 v_Normal;\n' +
	'varying vec3 v_Position;\n' +
	'varying vec3 v_Kd;\n' +
	'varying vec4 v_Color;\n' +

	//Uniforms
	'uniform vec3 u_eyePosWorld; \n' +

	//Material uniforms
	'uniform vec3 u_Ks;\n' +  //specular
	'uniform vec3 u_Ke;\n' +  //emissive
	'uniform vec3 u_Ka;\n' +  //ambience
	'uniform vec3 u_Kd; \n' + //diffuse

	//world light uniforms
	'uniform vec3 u_LightDiffuse;\n' +
	'uniform vec3 u_LightPosition;\n' +
	'uniform vec3 u_LightAmbient;\n' +
	'uniform vec3 u_LightSpecular;\n' +

	//head head light uniforms
	'uniform vec3 u_HeadlightDiffuse;\n' +
	'uniform vec3 u_HeadlightAmbient;\n' +
	'uniform vec3 u_HeadlightPosition;\n' +
	'uniform vec3 u_HeadlightSpecular;\n' +

	//Uniform to switch lighting modes
	'uniform int headlightOn;\n' +
	'uniform int worldLightOn;\n' +
	'uniform int lMode;\n' +
	'uniform int sMode;\n' +

	'void main(){ \n' +
	'	if(sMode == 1){\n' +
	'  		gl_FragColor = v_Color;\n' +
	'	};\n' +
	'	if(sMode == 0){\n' +
	     	// Normalize! !!IMPORTANT!! TROUBLE if you don't! 
     		// normals interpolated for each pixel aren't 1.0 in length any more!
	'		vec3 normal = normalize(v_Normal); \n' +
			//	'  vec3 normal = v_Normal; \n' +
     		// Find the unit-length light dir vector 'L' (surface pt --> light):
	'		vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
			// Find the unit-length eye-direction vector 'V' (surface pt --> camera)
	'		vec3 lightDirection_2 = normalize(u_HeadlightPosition - v_Position);\n' +
	'		vec3 eyeDirection = normalize(u_eyePosWorld - v_Position); \n' +
	     	// The dot product of (unit-length) light direction and the normal vector
     		// (use max() to discard any negatives from lights below the surface) 
     		// (look in GLSL manual: what other functions would help?)
     		// gives us the cosine-falloff factor needed for the diffuse lighting term:
	//confused here.
	'		float nDotL = max(dot(lightDirection, normal), 0.0); \n' +
	'		float nDotL_2 = max(dot(lightDirection_2, normal),0.0);\n' +
	  	 	// The Blinn-Phong lighting model computes the specular term faster 
  	 		// because it replaces the (V*R)^shiny weighting with (H*N)^shiny,
  	 		// where 'halfway' vector H has a direction half-way between L and V
  	 		// H = norm(norm(V) + norm(L)).  Note L & V already normalized above.
  	 		// (see http://en.wikipedia.org/wiki/Blinn-Phong_shading_model)

	'		float nDotH = 0.0; \n' +
	'		float nDotH_2 = 0.0; \n' +
			// (use max() to discard any negatives from lights below the surface)
			// Apply the 'shininess' exponent K_e:
			// Try it two different ways:		The 'new hotness': pow() fcn in GLSL.
			// CAREFUL!  pow() won't accept integer exponents! Convert K_shiny!  

	'		if(lMode == 0){\n' +
	'			vec3 H = normalize(lightDirection + eyeDirection); \n' +
	'			nDotH = max(dot(H, normal), 0.0); \n' +
	'  			vec3 H_2 = normalize(lightDirection_2 + eyeDirection); \n' +
	'			nDotH_2 = max(dot(H_2, normal), 0.0); \n' +
	'		}\n' +

	'		if(lMode == 1){\n' +
	'  			vec3 L = normalize(lightDirection); \n' +
	'  			vec3 C = dot(normal, L)*normal; \n' +
	'		  	vec3 R = C + C - L; \n' +
	'  			nDotH = max(dot(eyeDirection, R), 0.0); \n' +
	'	  		vec3 L_2 = normalize(lightDirection_2); \n' +
	'	  		vec3 C_2 = dot(normal, L_2)*normal; \n' +
	'		  	vec3 R_2 = C_2 + C_2 - L_2; \n' +
	'  			nDotH_2 = max(dot(eyeDirection, R_2), 0.0); \n' +
	'		}\n' +

	'		float e32 = pow(nDotH,32.0); \n' +
	'		float e32_2 = pow(nDotH_2,32.0); \n' +

	'		vec4 emissive = vec4(u_Ke, 1.0);\n' +

	'		vec3 specular = u_LightSpecular * u_Ks * e32;\n' +
	'		vec3 ambient = u_LightAmbient * u_Ka;\n' +
	'		vec3 diffuse = u_LightDiffuse * v_Kd * nDotL;\n' +
	'		vec4 fragWorld = vec4(diffuse + ambient + specular,1.0);\n' +

	'		vec3 hspec = u_HeadlightSpecular * u_Ks * e32_2;\n' +
	'		vec3 hambi = u_HeadlightAmbient * u_Ka ;\n' +
	'		vec3 hdiff = u_HeadlightDiffuse * v_Kd * nDotL_2;\n' +
	'		vec4 fragHead = vec4(hdiff + hspec + hambi, 1.0);\n' +
	//no need for ambient of headlight

	'		vec4 frag = fragHead + fragWorld + emissive;\n' +
	'		gl_FragColor = frag;\n' +
	'		}\n' +
	'}';

var floatsPerVertex = 7;

var canvas;
var gl;

var g_EyeX = 0, g_EyeY = 15.0, g_EyeZ = 10.00;
var g_AtX = 0.0, g_AtY = 0.0, g_AtZ = 0.0;

var sMode = 0;
var lMode = 0;
var u_sMode;
var u_lMode;

var u_ModelMatrix;
var u_ProjMatrix;
var u_NormalMatrix;
var viewMatrix = new Matrix4();
var modelMatrix = new Matrix4();
var projMatrix = new Matrix4();
var normalMatrix = new Matrix4();
var u_eyePosWorld;

var u_HeadlightSpecular;
var u_HeadlightDiffuse;
var u_HeadlightAmbient;
var u_HeadlightPosition;

var u_LightSpecular;
var u_LightAmbient;
var u_LightDiffuse;
var u_LightPosition;

var u_Ke;
var u_Ks;
var u_Ka;
var u_Kd;




//Light control
var headlightOn = true;
var worldLightOn = true;
var hlOn;
var wLOn;

//Variables for user adjusted aspects of world lights

var usrPosX = -2.0;
var usrPosY = 2.0;
var usrPosZ = 5.0;

var currentAngle;

function main() {
	// Retrieve <canvas> element
	canvas = document.getElementById('webgl');
	// Get the rendering context for WebGL
	gl = getWebGLContext(canvas);
	if (!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return;
	}

	// Initialize shaders
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Failed to intialize shaders.');
		return;
	}

	gl.enable(gl.DEPTH_TEST);

	// Set the vertex coordinates and color (the blue triangle is in the front)
	var n = initVertexBuffers(gl);

	if (n < 0) {
		console.log('Failed to specify the vertex information');
		return;
	}

	// Specify the color for clearing <canvas>
	gl.clearColor(0.1, 0.1, 0.1, 1);

	// Next, register all keyboard events found within our HTML webpage window:
	window.addEventListener("keydown", myKeyDown, false);
	window.addEventListener("keyup", myKeyUp, false);
	window.addEventListener("keypress", myKeyPress, false);

	//uniform matrices
	u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
	u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
	u_eyePosWorld = gl.getUniformLocation(gl.program, 'u_eyePosWorld');
	if (!u_ModelMatrix || !u_ProjMatrix || !u_NormalMatrix || !u_eyePosWorld) {
		console.log('Error here!___place1');
		return;
	}

	u_HeadlightDiffuse = gl.getUniformLocation(gl.program, 'u_HeadlightDiffuse');
	u_HeadlightAmbient = gl.getUniformLocation(gl.program, 'u_HeadlightAmbient');
	u_HeadlightPosition = gl.getUniformLocation(gl.program, 'u_HeadlightPosition');
	u_HeadlightSpecular = gl.getUniformLocation(gl.program, 'u_HeadlightSpecular');
	if (!u_HeadlightDiffuse || !u_HeadlightAmbient || !u_HeadlightPosition || !u_HeadlightSpecular) {
		console.log('Error here!___place2');
		return;
	}

	u_LightDiffuse = gl.getUniformLocation(gl.program, 'u_LightDiffuse');
	u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
	u_LightAmbient = gl.getUniformLocation(gl.program, 'u_LightAmbient');
	u_LightSpecular = gl.getUniformLocation(gl.program, 'u_LightSpecular');
	if (!u_LightDiffuse || !u_LightPosition || !u_LightAmbient || !u_LightSpecular) {
		console.log('Error here!___place3');
		return;
	}

	wLOn = gl.getUniformLocation(gl.program, 'worldLightOn');
	hlOn = gl.getUniformLocation(gl.program, 'headlightOn');
	u_sMode = gl.getUniformLocation(gl.program, 'sMode');
	u_lMode = gl.getUniformLocation(gl.program, 'lMode');
	if (!wLOn || !hlOn || !u_sMode || !u_lMode) {
		console.log('Error here!___place4');
		return;
	}

	u_Ke = gl.getUniformLocation(gl.program, 'u_Ke');
	u_Ks = gl.getUniformLocation(gl.program, 'u_Ks');
	u_Ka = gl.getUniformLocation(gl.program, 'u_Ka');
	u_Kd = gl.getUniformLocation(gl.program, 'u_Kd');
	if (!u_Ke || !u_Ks || !u_Ka || !u_Kd) {
		console.log('Error here!___place5');
		return;
	}

	gl.uniform3f(u_LightAmbient, 0.3, 0.3, 0.9);
	gl.uniform3f(u_LightDiffuse, 0.4, 0.2, 0.8);
	gl.uniform3f(u_LightSpecular, 0.7, 0.1, 0.3);

	gl.uniform3f(u_HeadlightDiffuse, 1.0, 1.0, 1.0);
	gl.uniform3f(u_HeadlightAmbient, 1.0, 1.0, 1.0);
	gl.uniform3f(u_HeadlightSpecular, 1.0, 1.0, 1.0);


	gl.uniform1i(wLOn, 1);
	gl.uniform1i(hlOn, 1);
	gl.uniform1i(u_sMode, sMode);
	gl.uniform1i(u_lMode, lMode);

	currentAngle = 0.0;

	var tick = function () {
		currentAngle = animate(currentAngle);  // Update the rotation angle
		draw();

		requestAnimationFrame(tick, canvas);
	};
	tick();

}



function initVertexBuffers(gl) {
	makeGroundGrid();
	makeSphere();
	makeCube();

	var mySize = gndVerts.length + sphVerts.length + cubVerts.length;

	var nn = mySize / floatsPerVertex;
	console.log('nn is', nn, 'mySize is', mySize, 'floatsPerVertex is', floatsPerVertex);

	var colorShapes = new Float32Array(mySize);
	gndStart = 0;
	for (i = 0, j = 0; j < gndVerts.length; i++ , j++) {
		colorShapes[i] = gndVerts[j];
	}
	sphStart = i;
	for (j = 0; j < sphVerts.length; i++ , j++) {
		colorShapes[i] = sphVerts[j];
	}
	cubStart = i;
	for (j = 0; j < cubVerts.length; i++ , j++) {
		colorShapes[i] = cubVerts[j];
	}


	// Create a buffer object on the graphics hardware:
	var shapeBufferHandle = gl.createBuffer();
	if (!shapeBufferHandle) {
		console.log('Failed to create the shape buffer object');
		return false;
	}

	// Bind the the buffer object to target:
	gl.bindBuffer(gl.ARRAY_BUFFER, shapeBufferHandle);
	gl.bufferData(gl.ARRAY_BUFFER, colorShapes, gl.STATIC_DRAW);


	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return -1;
	}

	var FSIZE = colorShapes.BYTES_PER_ELEMENT;
	// Assign the buffer object to a_Position and enable the assignment

	gl.vertexAttribPointer(a_Position, 4, gl.FLOAT, false, FSIZE * floatsPerVertex, 0);
	gl.enableVertexAttribArray(a_Position);

	var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
	if (a_Normal < 0) {
		console.log('Failed to get the storage location of a_Normal');
		return -1;
	}
	gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * floatsPerVertex, FSIZE * 4);
	gl.enableVertexAttribArray(a_Normal);

	return mySize / floatsPerVertex;	// return # of vertices
}

function makeGroundGrid() {
	var xcount = 100;     // # of lines to draw in x,y to make the grid.
	var ycount = 100;
	var xymax = 50.0;     // grid size; extends to cover +/-xymax in x and y.
	gndVerts = new Float32Array(floatsPerVertex * 2 * (xcount + ycount));
	// draw a grid made of xcount+ycount lines; 2 vertices per line.

	var xgap = xymax / (xcount - 1);    // HALF-spacing between lines in x,y;
	var ygap = xymax / (ycount - 1);    // (why half? because v==(0line number/2))

	// First, step thru x values as we make vertical lines of constant-x:
	for (v = 0, j = 0; v < 2 * xcount; v++ , j += floatsPerVertex) {
		if (v % 2 == 0) {  // put even-numbered vertices at (xnow, -xymax, 0)
			gndVerts[j] = -xymax + (v) * xgap;  // x
			gndVerts[j + 1] = -xymax;               // y
			gndVerts[j + 2] = 0.0;                  // z
			gndVerts[j + 3] = 1.0;                  // w
		}
		else {        // put odd-numbered vertices at (xnow, +xymax, 0).
			gndVerts[j] = -xymax + (v - 1) * xgap;  // x
			gndVerts[j + 1] = xymax;                // y
			gndVerts[j + 2] = 0.0;                  // z
			gndVerts[j + 3] = 1.0;                  // w
		}
		gndVerts[j + 4] = 0;     // red
		gndVerts[j + 5] = 0;     // grn
		gndVerts[j + 6] = 1;     // blu
	}
	// Second, step thru y values as wqe make horizontal lines of constant-y:
	// (don't re-initialize j--we're adding more vertices to the array)
	for (v = 0; v < 2 * ycount; v++ , j += floatsPerVertex) {
		if (v % 2 == 0) {    // put even-numbered vertices at (-xymax, ynow, 0)
			gndVerts[j] = -xymax;               // x
			gndVerts[j + 1] = -xymax + (v) * ygap;  // y
			gndVerts[j + 2] = 0.0;                  // z
			gndVerts[j + 3] = 1.0;                  // w
		}
		else {          // put odd-numbered vertices at (+xymax, ynow, 0).
			gndVerts[j] = xymax;                // x
			gndVerts[j + 1] = -xymax + (v - 1) * ygap;  // y
			gndVerts[j + 2] = 0.0;                  // z
			gndVerts[j + 3] = 1.0;                  // w
		}
		gndVerts[j + 4] = 0;     // red
		gndVerts[j + 5] = 0;     // grn
		gndVerts[j + 6] = 1;     // blu
	}
}

function makeSphere() {
	var slices = 30;		// # of slices of the sphere along the z axis. >=3 req'd
	var sliceVerts = 30	// # of vertices around the top edge of the slice
	var sliceAngle = Math.PI / slices;	// lattitude angle spanned by one slice.

	// Create a (global) array to hold this sphere's vertices:
	sphVerts = new Float32Array(((slices * 2 * sliceVerts) - 2) * floatsPerVertex);
	var cos0 = 0.0;					// sines,cosines of slice's top, bottom edge.
	var sin0 = 0.0;
	var cos1 = 0.0;
	var sin1 = 0.0;
	var j = 0;							// initialize our array index
	var isLast = 0;
	var isFirst = 1;
	for (s = 0; s < slices; s++) {	// for each slice of the sphere,
		// find sines & cosines for top and bottom of this slice
		if (s == 0) {
			isFirst = 1;	// skip 1st vertex of 1st slice.
			cos0 = 1.0; 	// initialize: start at north pole.
			sin0 = 0.0;
		}
		else {					// otherwise, new top edge == old bottom edge
			isFirst = 0;
			cos0 = cos1;
			sin0 = sin1;
		}								// & compute sine,cosine for new bottom edge.
		cos1 = Math.cos((s + 1) * sliceAngle);
		sin1 = Math.sin((s + 1) * sliceAngle);
		// go around the entire slice, generating TRIANGLE_STRIP verts
		// (Note we don't initialize j; grows with each new attrib,vertex, and slice)
		if (s == slices - 1) isLast = 1;	// skip last vertex of last slice.
		for (v = isFirst; v < 2 * sliceVerts - isLast; v++ , j += floatsPerVertex) {
			if (v % 2 == 0) {				// put even# vertices at the the slice's top edge
				// (why PI and not 2*PI? because 0 <= v < 2*sliceVerts
				// and thus we can simplify cos(2*PI(v/2*sliceVerts))  
				sphVerts[j] = sin0 * Math.cos(Math.PI * (v) / sliceVerts);
				sphVerts[j + 1] = sin0 * Math.sin(Math.PI * (v) / sliceVerts);
				sphVerts[j + 2] = cos0;
				sphVerts[j + 3] = 1.0;
			}
			else { 	// put odd# vertices around the slice's lower edge;
				sphVerts[j] = sin1 * Math.cos(Math.PI * (v - 1) / sliceVerts);		// x
				sphVerts[j + 1] = sin1 * Math.sin(Math.PI * (v - 1) / sliceVerts);		// y
				sphVerts[j + 2] = cos1;
				sphVerts[j + 3] = 1.0;
			}
			sphVerts[j + 4] = sin1 * Math.cos(Math.PI * (v - 1) / sliceVerts);
			sphVerts[j + 5] = sin1 * Math.sin(Math.PI * (v - 1) / sliceVerts);
			sphVerts[j + 6] = cos1;
		}
	}
}

function makeCube() {
	cubVerts = new Float32Array([
		//cube is easy to calculate the normal vector
		// +x face
		1.0, -1.0, -1.0, 1.0, 1, 0, 0,
		1.0, 1.0, -1.0, 1.0, 1, 0, 0,
		1.0, 1.0, 1.0, 1.0, 1, 0, 0,

		1.0, 1.0, 1.0, 1.0, 1, 0, 0,
		1.0, -1.0, 1.0, 1.0, 1, 0, 0,
		1.0, -1.0, -1.0, 1.0, 1, 0, 0,

		// +y face:
		-1.0, 1.0, -1.0, 1.0, 0, 1, 0,
		-1.0, 1.0, 1.0, 1.0, 0, 1, 0,
		1.0, 1.0, 1.0, 1.0, 0, 1, 0,

		1.0, 1.0, 1.0, 1.0, 0, 1, 0,
		1.0, 1.0, -1.0, 1.0, 0, 1, 0,
		-1.0, 1.0, -1.0, 1.0, 0, 1, 0,

		// +z face:
		-1.0, 1.0, 1.0, 1.0, 0, 0, 1,
		-1.0, -1.0, 1.0, 1.0, 0, 0, 1,
		1.0, -1.0, 1.0, 1.0, 0, 0, 1,

		1.0, -1.0, 1.0, 1.0, 0, 0, 1,
		1.0, 1.0, 1.0, 1.0, 0, 0, 1,
		-1.0, 1.0, 1.0, 1.0, 0, 0, 1,

		// -x face
		-1.0, -1.0, 1.0, 1.0, -1, 0, 0,
		-1.0, 1.0, 1.0, 1.0, -1, 0, 0,
		-1.0, 1.0, -1.0, 1.0, -1, 0, 0,

		-1.0, 1.0, -1.0, 1.0, -1, 0, 0,
		-1.0, -1.0, -1.0, 1.0, -1, 0, 0,
		-1.0, -1.0, 1.0, 1.0, -1, 0, 0,

		// -y face
		1.0, -1.0, -1.0, 1.0, 0, -1, 0,
		1.0, -1.0, 1.0, 1.0, 0, -1, 0,
		-1.0, -1.0, 1.0, 1.0, 0, -1, 0,

		-1.0, -1.0, 1.0, 1.0, 0, -1, 0,
		-1.0, -1.0, -1.0, 1.0, 0, -1, 0,
		1.0, -1.0, -1.0, 1.0, 0, -1, 0,

		// -z face
		1.0, 1.0, -1.0, 1.0, 0, 0, -1,
		1.0, -1.0, -1.0, 1.0, 0, 0, -1,
		-1.0, -1.0, -1.0, 1.0, 0, 0, -1,

		-1.0, -1.0, -1.0, 1.0, 0, 0, -1,
		-1.0, 1.0, -1.0, 1.0, 0, 0, -1,
		1.0, 1.0, -1.0, 1.0, 0, 0, -1,

	]);
}


function switchL() {
	if (lMode == 0) {
		lMode = 1;
		document.getElementById("lMode").innerHTML = "Lighting Mode: " + "Phong lighting";
		//Phong lighting
	}
	else {
		lMode = 0;
		document.getElementById("lMode").innerHTML = "Lighting Mode: " + "Bilnn-Phong lighting";
	}
}

function changePoz() {
	var px, py, px;
	px = document.getElementById("PX").value;
	if (isNaN(px)) {
		px = usrPosX;
	}
	py = document.getElementById("PY").value;
	if (isNaN(py)) {
		py = usrPosY;
	}
	pz = document.getElementById("PZ").value;
	if (isNaN(pz)) {
		pz = usrPosZ;
	}
	usrPosX = px;
	usrPosY = py;
	usrPosZ = pz;

}

function draw() {


	// Clear <canvas> color AND DEPTH buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	canvas.width = innerWidth * 0.98;
	canvas.height = innerHeight * 0.75;

	//Set the lights
	gl.uniform1i(hlOn, headlightOn);
	gl.uniform1i(wLOn, worldLightOn);
	gl.uniform1i(u_sMode, sMode);
	gl.uniform1i(u_lMode, lMode);
	gl.uniform3f(u_eyePosWorld, g_EyeX, g_EyeY, g_EyeZ);

	gl.uniform3f(u_LightPosition, usrPosX, usrPosY, usrPosZ);
	gl.uniform3f(u_HeadlightPosition, g_EyeX, g_EyeY, g_EyeZ);

	if (headlightOn) {
		gl.uniform1i(hlOn, 1);
		gl.uniform3f(u_HeadlightDiffuse, 1.0, 1.0, 1.0);
		gl.uniform3f(u_HeadlightAmbient, 1.0, 1.0, 1.0);
		gl.uniform3f(u_HeadlightSpecular, 1.0, 1.0, 1.0);
	}
	else {
		gl.uniform1i(hlOn, 0);
		gl.uniform3f(u_HeadlightDiffuse, 0, 0, 0);
		gl.uniform3f(u_HeadlightAmbient, 0, 0, 0);
		gl.uniform3f(u_HeadlightSpecular, 0, 0, 0);

	}

	if (worldLightOn) {
		gl.uniform1i(wLOn, 1);
		gl.uniform3f(u_LightAmbient, 0.3, 0.3, 0.9);
		gl.uniform3f(u_LightDiffuse, 0.4, 0.2, 0.8);
		gl.uniform3f(u_LightSpecular, 0.7, 0.1, 0.3);
		gl.uniform3f(u_LightPosition, usrPosX, usrPosY, usrPosZ);
	}
	else {
		gl.uniform1i(wLOn, 0);
		gl.uniform3f(u_LightAmbient, 0, 0, 0);
		gl.uniform3f(u_LightDiffuse, 0, 0, 0);
		gl.uniform3f(u_LightSpecular, 0, 0, 0);
		gl.uniform3f(u_LightPosition, 0, 0, 0);
	}

	changePoz();


	gl.viewport(0,			// Viewport lower-left corner
		0, 					// location(in pixels)
		canvas.width, 		// viewport width,
		canvas.height);		// viewport height in pixels.

	projMatrix.setPerspective(40, 			// fovy: y-axis field-of-view in degrees 	
		canvas.width / (canvas.height), 	// aspect ratio: width/height
		1,									// near, far (always >0) 
		100);

	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

	modelMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ, // eye position
		g_AtX, g_AtY, g_AtZ,      // look-at point 
		0, 0, 1);                 // up vector

	drawAll();
}

function drawAll() {

	modelMatrix.scale(0.6, 0.6, 0.6);
	pushMatrix(modelMatrix);
	//------------------------------------
	//------------------------------------
	//------------------------------------
	//------ground grid
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.19225, 0.19225, 0.19225);
	gl.uniform3f(u_Kd, 0.50754, 0.50754, 0.507543);
	gl.uniform3f(u_Ks, 0.508273, 0.508273, 0.508273);

	gl.drawArrays(gl.LINES,             		// use this drawing primitive, and
		gndStart / floatsPerVertex, 			// start at this vertex number, and
		gndVerts.length / floatsPerVertex);   	// draw this many vertices

	modelMatrix = popMatrix();
	pushMatrix(modelMatrix);//FOR sphere

	//------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------
	//------robot1
	//------------------------------------------------------------------------------------------------------------
	//body
	modelMatrix.translate(-8, -8, 2);
	modelMatrix.rotate(currentAngle, 0, 0, 1);
	pushMatrix(modelMatrix);
	pushMatrix(modelMatrix);
	modelMatrix.scale(1, 1, 2);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.1, 0.3, 0.6);
	gl.uniform3f(u_Kd, 0.50754, 0.4, 0.507543);
	gl.uniform3f(u_Ks, 0.508273, 0.2, 0.3);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.

	modelMatrix = popMatrix();
	modelMatrix.translate(0, 0, 3);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	//Material stuff for sphere 1   
	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.4, 0.19225, 0.19225);
	gl.uniform3f(u_Kd, 0.7, 0.2, 0.8);
	gl.uniform3f(u_Ks, 0.8, 0.2, 0.508273);
	gl.drawArrays(gl.TRIANGLE_STRIP,				// use this drawing primitive, and
		sphStart / floatsPerVertex, // start at this vertex number, and
		sphVerts.length / floatsPerVertex);	// draw this many vertices.

	//------------------------------------------------------------------------------------------------------------
	//arm1
	modelMatrix = popMatrix();
	modelMatrix.translate(0, 2, 1);
	modelMatrix.rotate(currentAngle, 0, 1, 0);
	pushMatrix(modelMatrix);
	modelMatrix.scale(0.4, 1, 0.4);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.3, 0.19225, 0.19225);
	gl.uniform3f(u_Kd, 0.6, 0.4, 0.507543);
	gl.uniform3f(u_Ks, 0.508273, 0.5, 0.6);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.

	//------------------------------------------------------------------------------------------------------------
	//arm2
	modelMatrix = popMatrix();
	modelMatrix.translate(0.6, 1, 0);
	modelMatrix.rotate(90, 0, 0, 1);
	pushMatrix(modelMatrix);
	modelMatrix.scale(0.4, 1, 0.4);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.3, 0.19225, 0.19225);
	gl.uniform3f(u_Kd, 0.6, 0.4, 0.507543);
	gl.uniform3f(u_Ks, 0.508273, 0.5, 0.6);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.

	//------------------------------------------------------------------------------------------------------------
	//curlpart-center
	modelMatrix = popMatrix();
	modelMatrix.translate(0, -1, 0);
	modelMatrix.rotate(90, 0, 0, 1);
	modelMatrix.rotate(90, 1, 0, 0);
	pushMatrix(modelMatrix);
	pushMatrix(modelMatrix);
	modelMatrix.scale(0.2, 1, 0.2);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.19225, 0.19225, 0.19225);
	gl.uniform3f(u_Kd, 0.50754, 0.50754, 0.507543);
	gl.uniform3f(u_Ks, 0.508273, 0.508273, 0.508273);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.

	//curlpart-part-1
	modelMatrix = popMatrix();
	modelMatrix.translate(0, -1, 0);
	modelMatrix.rotate(90, 0, 0, 1);
	modelMatrix.rotate(90, 1, 0, 0);
	modelMatrix.scale(0.2, 0.4, 0.4);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.19225, 0.19225, 0.19225);
	gl.uniform3f(u_Kd, 0.50754, 0.50754, 0.507543);
	gl.uniform3f(u_Ks, 0.508273, 0.508273, 0.508273);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.

	//curlpart-part-2
	modelMatrix = popMatrix();
	modelMatrix.translate(0, 1, 0);
	modelMatrix.rotate(90, 0, 0, 1);
	modelMatrix.rotate(90, 1, 0, 0);
	modelMatrix.scale(0.2, 0.4, 0.4);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.19225, 0.19225, 0.19225);
	gl.uniform3f(u_Kd, 0.50754, 0.50754, 0.507543);
	gl.uniform3f(u_Ks, 0.508273, 0.508273, 0.508273);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.


	//------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------
	//------robot2
	var tempAngle = currentAngle;
	tempAngle = tempAngle % 120;
	if (tempAngle > 30 && tempAngle < 90)
		tempAngle = 60 - tempAngle;
	else if (tempAngle > 90)
		tempAngle = tempAngle - 120;
	//------------------------------------------------------------------------------------------------------------
	//body
	modelMatrix = popMatrix();  // RESTORE 'world' drawing coords.
	pushMatrix(modelMatrix);    // SAVE world drawing coords.
	modelMatrix.translate(8, -8, 2);
	modelMatrix.rotate(currentAngle, 0, 0, 1);
	pushMatrix(modelMatrix);
	pushMatrix(modelMatrix);
	modelMatrix.scale(1, 1, 2);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.1, 0.19225, 0.19225);
	gl.uniform3f(u_Kd, 0.9, 0.4, 0.1);
	gl.uniform3f(u_Ks, 0.2, 0.5, 0.6);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.

	modelMatrix = popMatrix();
	modelMatrix.translate(0, 0, 3);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	//Material stuff for sphere 1   
	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.19225, 0.1, 0.19225);
	gl.uniform3f(u_Kd, 0.1, 0.1, 0.3);
	gl.uniform3f(u_Ks, 0.508273, 0.1, 0.5018273);
	gl.drawArrays(gl.TRIANGLE_STRIP,				// use this drawing primitive, and
		sphStart / floatsPerVertex, // start at this vertex number, and
		sphVerts.length / floatsPerVertex);	// draw this many vertices.

	//------------------------------------------------------------------------------------------------------------
	//arm1
	modelMatrix = popMatrix();  // RESTORE 'world' drawing coords.
	modelMatrix.translate(0, 1, 1);
	modelMatrix.rotate(tempAngle, 1, 0, 0);
	modelMatrix.translate(0, 1, 0);
	pushMatrix(modelMatrix);
	modelMatrix.scale(0.4, 1, 0.4);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.12, 0.19225, 0.787);
	gl.uniform3f(u_Kd, 0.1, 0.234, 0.507543);
	gl.uniform3f(u_Ks, 0.508273, 0.474, 0.78);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.

	//------------------------------------------------------------------------------------------------------------
	//arm2
	modelMatrix = popMatrix();  // RESTORE 'world' drawing coords.
	modelMatrix.translate(0, 1, 0);
	modelMatrix.rotate(tempAngle, 1, 0, 0);
	modelMatrix.translate(0, 1, 0);
	pushMatrix(modelMatrix);
	modelMatrix.scale(0.4, 1, 0.4);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.12, 0.19225, 0.787);
	gl.uniform3f(u_Kd, 0.1, 0.234, 0.507543);
	gl.uniform3f(u_Ks, 0.508273, 0.474, 0.78);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.

	//------------------------------------------------------------------------------------------------------------
	//curlpart-center
	modelMatrix = popMatrix();
	modelMatrix.translate(0, 1, 0);
	modelMatrix.rotate(90, 0, 1, 0);
	modelMatrix.rotate(90, 1, 0, 0);
	pushMatrix(modelMatrix);
	pushMatrix(modelMatrix);
	modelMatrix.scale(0.2, 1, 0.2);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.19225, 0.19225, 0.19225);
	gl.uniform3f(u_Kd, 0.50754, 0.50754, 0.507543);
	gl.uniform3f(u_Ks, 0.508273, 0.508273, 0.508273);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.

	//curlpart-part-1
	modelMatrix = popMatrix();
	modelMatrix.translate(0, -1, 0);
	modelMatrix.rotate(90, 0, 0, 1);
	modelMatrix.rotate(90, 1, 0, 0);
	modelMatrix.scale(0.2, 0.4, 0.4);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.19225, 0.19225, 0.19225);
	gl.uniform3f(u_Kd, 0.50754, 0.50754, 0.507543);
	gl.uniform3f(u_Ks, 0.508273, 0.508273, 0.508273);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.

	//curlpart-part-2
	modelMatrix = popMatrix();
	modelMatrix.translate(0, 1, 0);
	modelMatrix.rotate(90, 0, 0, 1);
	modelMatrix.rotate(90, 1, 0, 0);
	modelMatrix.scale(0.2, 0.4, 0.4);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.19225, 0.19225, 0.19225);
	gl.uniform3f(u_Kd, 0.50754, 0.50754, 0.507543);
	gl.uniform3f(u_Ks, 0.508273, 0.508273, 0.508273);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.


	//------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------
	//------robot3
	var newAngle = currentAngle;
	newAngle = newAngle % 120;
	if (newAngle > 60)
		newAngle = 120 - newAngle;
	//------------------------------------------------------------------------------------------------------------
	//body
	modelMatrix = popMatrix();  // RESTORE 'world' drawing coords.
	pushMatrix(modelMatrix);  // SAVE world drawing coords.
	modelMatrix.translate(-8, 8, 2);
	modelMatrix.rotate(90, 1, 0, 0);
	modelMatrix.rotate(currentAngle, 0, 1, 0);
	pushMatrix(modelMatrix);
	pushMatrix(modelMatrix);
	modelMatrix.scale(1, 1, 2);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.23, 0.444, 0.1311);
	gl.uniform3f(u_Kd, 0.123, 0.123754, 0.507543);
	gl.uniform3f(u_Ks, 0.12313, 0.213, 0.508273);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.

	modelMatrix = popMatrix();
	modelMatrix.translate(0, 0, 3);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	//Material stuff for sphere 1   
	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.19225, 0.19225, 0.19225);
	gl.uniform3f(u_Kd, 0.50754, 0.50754, 0.507543);
	gl.uniform3f(u_Ks, 0.508273, 0.508273, 0.508273);
	gl.drawArrays(gl.TRIANGLE_STRIP,				// use this drawing primitive, and
		sphStart / floatsPerVertex, // start at this vertex number, and
		sphVerts.length / floatsPerVertex);	// draw this many vertices.

	//------------------------------------------------------------------------------------------------------------
	//arm1-right
	modelMatrix = popMatrix();  // RESTORE 'world' drawing coords.
	modelMatrix.translate(1, 1, 1);
	modelMatrix.rotate(-newAngle, 1, 0, 0);
	modelMatrix.translate(0, 1, 0);
	pushMatrix(modelMatrix);
	modelMatrix.scale(0.4, 1, 0.4);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.1, 0.2, 0.4);
	gl.uniform3f(u_Kd, 0.8, 0.4, 0.6);
	gl.uniform3f(u_Ks, 0.508273, 0.2, 0.1);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.

	//------------------------------------------------------------------------------------------------------------
	//arm2-right
	modelMatrix = popMatrix();  // RESTORE 'world' drawing coords.
	modelMatrix.translate(0, 1, 0);
	modelMatrix.rotate(newAngle, 1, 0, 0);
	modelMatrix.translate(0, 1, 0);
	pushMatrix(modelMatrix);
	modelMatrix.scale(0.4, 1, 0.4);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.1, 0.2, 0.4);
	gl.uniform3f(u_Kd, 0.8, 0.4, 0.6);
	gl.uniform3f(u_Ks, 0.508273, 0.2, 0.1);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.

	//------------------------------------------------------------------------------------------------------------
	//curlpart-center
	modelMatrix = popMatrix();
	modelMatrix.translate(0, 1, 0);
	modelMatrix.rotate(90, 0, 1, 0);
	modelMatrix.rotate(90, 1, 0, 0);
	pushMatrix(modelMatrix);
	pushMatrix(modelMatrix);
	modelMatrix.scale(0.2, 1, 0.2);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.19225, 0.19225, 0.19225);
	gl.uniform3f(u_Kd, 0.50754, 0.50754, 0.507543);
	gl.uniform3f(u_Ks, 0.508273, 0.508273, 0.508273);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.

	//curlpart-part-1
	modelMatrix = popMatrix();
	modelMatrix.translate(0, -1, 0);
	modelMatrix.rotate(90, 0, 0, 1);
	modelMatrix.rotate(90, 1, 0, 0);
	modelMatrix.scale(0.2, 0.4, 0.4);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.19225, 0.19225, 0.19225);
	gl.uniform3f(u_Kd, 0.50754, 0.50754, 0.507543);
	gl.uniform3f(u_Ks, 0.508273, 0.508273, 0.508273);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.

	//curlpart-part-2
	modelMatrix = popMatrix();
	modelMatrix.translate(0, 1, 0);
	modelMatrix.rotate(90, 0, 0, 1);
	modelMatrix.rotate(90, 1, 0, 0);
	modelMatrix.scale(0.2, 0.4, 0.4);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.19225, 0.19225, 0.19225);
	gl.uniform3f(u_Kd, 0.50754, 0.50754, 0.507543);
	gl.uniform3f(u_Ks, 0.508273, 0.508273, 0.508273);
	gl.drawArrays(gl.TRIANGLES,				// use this drawing primitive, and
		cubStart / floatsPerVertex, // start at this vertex number, and
		cubVerts.length / floatsPerVertex);	// draw this many vertices.

	//------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------------------------------------
	//------centered sphere
	modelMatrix = popMatrix();
	modelMatrix.scale(2, 2, 2);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	normalMatrix.setInverseOf(modelMatrix);
	normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	//Material stuff for sphere 1   
	gl.uniform3f(u_Ke, 0.0, 0.0, 0.0);
	gl.uniform3f(u_Ka, 0.19225, 0.19225, 0.19225);
	gl.uniform3f(u_Kd, 0.50754, 0.50754, 0.507543);
	gl.uniform3f(u_Ks, 0.508273, 0.508273, 0.508273);
	gl.drawArrays(gl.TRIANGLE_STRIP,				// use this drawing primitive, and
		sphStart / floatsPerVertex, // start at this vertex number, and
		sphVerts.length / floatsPerVertex);	// draw this many vertices.


}

var flag = 0;
var theta = 0;

function myKeyDown(ev) {
	//===============================================================================

	var xd = g_EyeX - g_AtX;
	var yd = g_EyeY - g_AtY;
	var zd = g_EyeZ - g_AtZ;
	var lxy = Math.sqrt(xd * xd + yd * yd);
	var l = Math.sqrt(xd * xd + yd * yd + zd * zd);

	switch (ev.keyCode) {      // keycodes !=ASCII, but are very consistent for 
		//  nearly all non-alphanumeric keys for nearly all keyboards in all countries.
		case 74:    // j
			if (flag == 0) theta = -Math.acos(xd / lxy) + 0.1;
			else theta = theta + 0.1;
			g_AtX = g_EyeX + lxy * Math.cos(theta);
			g_AtY = g_EyeY + lxy * Math.sin(theta);
			flag = 1;
			break;
		case 73:    //i
			g_AtZ = g_AtZ + 1;
			break;
		case 76:    // l
			if (flag == 0) theta = -Math.acos(xd / lxy) - 0.1;
			else theta = theta - 0.1;
			g_AtX = g_EyeX + lxy * Math.cos(theta);
			g_AtY = g_EyeY + lxy * Math.sin(theta);
			flag = 1;
			break;
		case 75:    // k
			g_AtZ = g_AtZ - 1;
			break;

		case 87:    // w
			g_AtX = g_AtX - (xd / l);
			g_AtY = g_AtY - (yd / l);
			g_AtZ = g_AtZ - (zd / l);

			g_EyeX = g_EyeX - (xd / l);
			g_EyeY = g_EyeY - (yd / l);
			g_EyeZ = g_EyeZ - (zd / l);
			break;

		case 83:    // s
			g_AtX = g_AtX + (xd / l);
			g_AtY = g_AtY + (yd / l);
			g_AtZ = g_AtZ + (zd / l);

			g_EyeX = g_EyeX + (xd / l);
			g_EyeY = g_EyeY + (yd / l);
			g_EyeZ = g_EyeZ + (zd / l);

			break;

		case 68:    // a
			g_EyeX = g_EyeX - yd / lxy;
			g_EyeY = g_EyeY + xd / lxy;
			g_AtX -= yd / lxy;
			g_AtY += xd / lxy;

			break;
		case 65:    // d
			g_EyeX = g_EyeX + yd / lxy;
			g_EyeY = g_EyeY - xd / lxy;
			g_AtX += yd / lxy;
			g_AtY -= xd / lxy;

			break;
		case 81:    //headlight
			if (headlightOn)
				headlightOn = false;
			else
				headlightOn = true;
			break;

		case 69:   //worldlight
			if (worldLightOn)
				worldLightOn = false;
			else
				worldLightOn = true;
			break;

		case 85: //u
			switchS();
			break;

		case 79: //o
			switchL();
			break;
	}
}

function myKeyUp(ev) {
	//===============================================================================
	// Called when user releases ANY key on the keyboard; captures scancodes well

	console.log('myKeyUp()--keyCode=' + ev.keyCode + ' released.');
}
function myKeyPress(ev) {
	//===============================================================================
	// Best for capturing alphanumeric keys and key-combinations such as 
	// CTRL-C, alt-F, SHIFT-4, etc.
	console.log('myKeyPress():keyCode=' + ev.keyCode + ', charCode=' + ev.charCode +
		', shift=' + ev.shiftKey + ', ctrl=' + ev.ctrlKey +
		', altKey=' + ev.altKey +
		', metaKey(Command key or Windows key)=' + ev.metaKey);
}

var g_last = Date.now();

function animate(angle) {
	//==============================================================================
	// Calculate the elapsed time
	var now = Date.now();
	var elapsed = now - g_last;
	g_last = now;

	var newAngle = angle + (45 * elapsed) / 1000.0;
	return newAngle %= 360;
}

function switchS() {
	if (sMode == 0) {
		sMode = 1;
		document.getElementById("sMode").innerHTML = "Shading Mode: " + "Gouraud shading";
		//
	}
	else {
		sMode = 0;
		document.getElementById("sMode").innerHTML = "Shading Mode: " + "Phong shading";
	}
}
