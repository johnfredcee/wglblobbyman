/*global window:false, $:false, THREE:false */
/*jslint white:false, browser:true	*/

var BlobbyMan = BlobbyMan || {};

BlobbyMan.camera = undefined;
BlobbyMan.scene = undefined;
BlobbyMan.renderer = undefined;
BlobbyMan.group = undefined;
BlobbyMan.mouseX = 0;
BlobbyMan.mouseY = 0;
BlobbyMan.sphere = undefined;
BlobbyMan.torso = undefined;
BlobbyMan.leftleg = undefined;
BlobbyMan.rightleg = undefined;
BlobbyMan.body = undefined;
BlobbyMan.shoulder = undefined;
BlobbyMan.head = undefined;
BlobbyMan.leftarm = undefined;
BlobbyMan.rightarm = undefined;
BlobbyMan.lthigh = undefined;
BlobbyMan.lcalf = undefined;
BlobbyMan.lfoot = undefined;
BlobbyMan.rthigh = undefined;
BlobbyMan.rcalf = undefined;
BlobbyMan.rfoot = undefined;
BlobbyMan.luparm = undefined;
BlobbyMan.llowarm = undefined;
BlobbyMan.lhand = undefined;
BlobbyMan.ruparm = undefined;
BlobbyMan.rlowarm = undefined;
BlobbyMan.rhand = undefined;
BlobbyMan.windowHalfX = window.innerWidth / 2;
BlobbyMan.windowHalfY = window.innerHeight / 2;
BlobbyMan.exten = 0;
BlobbyMan.btwis = 0;
BlobbyMan.rot	= 0;
BlobbyMan.neck	= 0;
BlobbyMan.nod	= 0;
BlobbyMan.lsid	= 0;
BlobbyMan.lshou = 0;
BlobbyMan.latwis = 0;
BlobbyMan.lelbo = 0;
BlobbyMan.rsid	= 0;
BlobbyMan.rshou = 0;
BlobbyMan.ratwis = 0;
BlobbyMan.relbo = 0;
BlobbyMan.lankl = 0;
BlobbyMan.rankl = 0;
BlobbyMan.lknee = 0;
BlobbyMan.rknee = 0;
BlobbyMan.animtime = 0;
BlobbyMan.usedParams = {};
BlobbyMan.samples = [];
BlobbyMan.maxAnimTime = 60;
BlobbyMan.inPlayback = false;

BlobbyMan.paramNames = [
	'exten',
	'btwis',
	'rot',
	'neck',
	'nod',
	'lsid',
	'lshou',
	'latwis',
	'lelbo',
	'rsid',
	'rshou',
	'ratwis',
	'relbo',
	'lankl',
	'rankl',
	'lknee',
	'rknee',
	'animtime'
];

/**
 * Encode a number into the URL
 */
BlobbyMan.encodeNumber = function (num)
{
	var validchars = '01234567890ABCDEFGHJIKLMNOPQRSVUWXYZabcdefghjiklmnopqrsvuwxyz-_';
	var radix = validchars.length;
	var workingnum = num|0;
	var result = '';

	while (workingnum !== 0)
	{
		result = validchars[workingnum % radix] + result;
		workingnum = (workingnum / radix)|0;
	}
	return result;
};

/**
 * Decode a number from the URL
 */
BlobbyMan.decodeNumber = function (numstr)
{
	var validchars = '01234567890ABCDEFGHJIKLMNOPQRSVUWXYZabcdefghjiklmnopqrsvuwxyz-_';
	var radix = validchars.length;
	var workingnum = 0;
	var result = 0;

	while (numstr.length !== 0)
	{
		workingnum = workingnum * radix;
		workingnum = workingnum + validchars.indexOf(numstr[0]);
		numstr = numstr.substring(1, numstr.length);
	}
	return workingnum;
};

/**
 * Accessors to array of interpolated parameters
 */
BlobbyMan.setParams = function (animparams)
{
	var p;
	for (p in animparams)
	{
		BlobbyMan[p] = animparams[p];
	}
};

BlobbyMan.getParams = function ()
{
	var p;
	var animparams = {};
	for (p in BlobbyMan.paramNames)
	{
		animparams[p] = BlobbyMan[p];
	}
	return animparams;
};

BlobbyMan.makeKeyButton = function(keytime)
{
	var keyid = "keybutton"+keytime.toString();
	$("#playbutton").last().after("<input type=\"button\" value=\"Key@" + keytime + "\" id=\""+keyid+"\"\>");
	keyid = "#"+keyid;
	$(keyid).click(function(e) { BlobbyMan.animtime = keytime; BlobbyMan.render(); });
	return;
};

/**
 * Test to see if there is a given frame in the samples
 * array at a given time.
 */
BlobbyMan.isKeyFrame = function (sampletime)
{
	console.log("Sample "+BlobbyMan.samples[sampletime|0]+" @ "+sampletime);
	return BlobbyMan.samples[sampletime|0] !== undefined;
};

/**
 * For debugging. Show it all.
 */
BlobbyMan.dumpKeys = function()
{
	console.log("Keydump");
	$.each( BlobbyMan.samples ,
			function(k, v) {
				if ((v !== undefined) && (k!==0)) {
					console.log("Time "+k);
					console.log("Object "+v);
					$.each( v ,
							function(i,w) {
								console.log("Parameter "  + i);
								console.log("Value " + w);
							});
				}});


};


/**
 * Ensure samples array gets updated with currently used
 * parameters.
 */
BlobbyMan.setKeyFrame = function ()
{
	var makeButton = false;
	console.log("setKeyFrame");
	var keytime = BlobbyMan.animtime | 0;
	console.log("KeyFrame@ "+keytime.toString());
	// first pass, ensure anything left out of used set goes in
	$.each(BlobbyMan.paramNames,
		   function(i,p) {
			   // console.log("Parameter " + p);
			   // console.log("Value " + BlobbyMan[p]);
			   // console.log("Init Value " + BlobbyMan.samples[0][p]);
			   if ((p !== 'animtime') && (BlobbyMan[p] !== BlobbyMan.samples[0][p]))
			   {
				   if (BlobbyMan.usedParams[p] === undefined)
				   {
					   // console.log("Using param "+p);
					   BlobbyMan.usedParams[p] = true;
				   }
			   }
		   });

	/* ensure samples entry is there */
	if (BlobbyMan.samples[keytime] === undefined) {
		makeButton = true;
		BlobbyMan.samples[keytime] = {	};
	}

	console.log("Set samples @ "+keytime);
	$.each(BlobbyMan.usedParams,
		   function(i,p) {
			   console.log("Setting Param "+i+" at time "+keytime);
			   BlobbyMan.samples[keytime][i] = BlobbyMan[i];
		   });
	//BlobbyMan.samples.sort();
	//$("#urlbutton").last().after("<input type=\"button\" id=\""+keyid+"\" value=\"" + keyvalue + "\" />");
	if (makeButton)
		BlobbyMan.makeKeyButton(keytime);
	BlobbyMan.dumpKeys();
	$("#slidertime .ui-slider-handle").addClass("highlight");
	return;
};



/**
 * Maintain a sorted lookup table index, that lets us access keys in
 * an ordered way
 */
BlobbyMan.createKeyIndex = function ()
{
	var index = [];
	for(var keyt in BlobbyMan.samples)
	{
		index.push(keyt);
	}
	index.sort();
	return index;
};

/**
 * Calculate url that describes parameters
 */
BlobbyMan.calcParamsUrl = function ()
{
	var url = '?';
	var animtime = undefined;

	var index = BlobbyMan.createKeyIndex();
	console.log("Calcluating URL");
	for (var p in BlobbyMan.usedParams) {
		console.log("Parameter "+p);
		url = url + p + '=';
		for (var i = 0; i <  index.length; i++) {
			animtime = index[i];
			url = url + encodeNumber(animtime);
			url = url + "~";
			url = url + encodeNumber(BlobbyMan.samples[animtime][p]);
			url = url + "~";
			console.log("T " + animtime + " " + BlobbyMan.samples[animtime][p]);
		}
 		url = substring(0, url.length - 1);
		url = url + "&";
	}
 	url = substring(0, url.length - 1);
	return url;
};

BlobbyMan.makeParamsUrl = function()
{
	var url;
	url = BlobbyMan.calcParamsUrl();
};

/**
 * Calculate parameter for given t
 */
BlobbyMan.interpolateParam = function (p, animtime)
{

	/* index of next key */
	var index;
	/* times we interpolate between */
	var t0;
	var t1;
	/* keys we interpolate between */
	var key0;
	var key1;
	/* interpolant */
	var alpha;
	/* result */
	var result;

	var findNextKey = function (animtime)
	{
		var keyi = undefined;
		var keyt;
		for(var i = 0; i < index.length(); ++i) {
			keyt = BlobbyMan.samples[index[i]];
			if (keyt >= animtime)
				keyi = i;
			break;
		}
		return keyi;
	};

	// unused case.
	if (BlobbyMan.usedParams[p] === undefined)
	{
		return BlobbyMan[p];
	}
	index = BlobbyMan.createKeyIndex();
	// one key case
	if (BlobbyMan.samples.length == 1)
		return BlobbyMan.samples[index[0]][p];
	var nextKey = findNextKey(animtime);
	// extrapolating past last key case
	if (nextKey === undefined) {
		prevKey = index.length() - 1;
		t1 = index[prevKey];
		key1 = BlobbyMan.samples[t1][p];
		t0 = index[prevKey-1];
		key0 = BlobbyMan.samples[t0][p];
		alpha = (t0 - t1) / (t0 - animtime);
		result = key0 + (key1 - key0) * alpha;
	}
	if (nextKey >= 1) {
		// inbetween case
		t1 = index[nextKey];
		key1 = BlobbyMan.samples[t1][p];
		prevKey = nextKey-1;
		t0 = index[prevKey];
		key0 = BlobbyMan.samples[t0][p];
		alpha = (t0 - t1) / (t0 - animtime);
		result = key0 + (key1 - key0) * alpha;
	}
	else {
		// extrapolating past first key case
		prevKey = undefined;
		t0 = index[nextKey];
		key0 = BlobbyMan.samples[t0][p];
		t1 = index[nextKey+1];
		key1 = BlobbyMan.samples[t0][p];
		alpha = (t0 - t1) / (t0 - animtime);
		result = key0 + (key1 - key0) * alpha;
	}
	return result;
};

/**
 * Actually play back the animation
 */
BlobbyMan.playBack = function()
{
	console.log("Playback");
	if (BlobbyMan.inPlayback === true)
		return;
	console.log("In Playback");
	$("#slidertime").slider("disable");
	$("#keybutton").attr("disabled", "true");
	$("#playbutton").attr("disabled", "true");
	$("#urlbutton").attr("disabled", "true");

	BlobbyMan.inPlayback = true;
	var oldanimmtime = BlobbyMan.animTime;
	var animStartTime = Date.now();
	var animate     = function(animTime) {
		var playTime = (animTime-animStartTime) / 1000.0;
		$("slidertime").slider(playTime | 0);
		console.log("Playback @"+playTime);
	 	if ((playTime|0) >= (BlobbyMan.maxAnimTime|0)) {
	 		BlobbyMan.inPlayback = false;
	 		$("#slidertime").slider("enable");
	 		$("#keybutton").removeAttr("disabled", "true");
	 		$("#playbutton").removeAttr("disabled", "true");
	 		$("#urlbutton").removeAttr("disabled", "true");
			BlobbyMan.animTime = oldanimtime;
		} else {
			console.log("Interpolate");
			for(p in BlobbyMan.usedParams) {
				console.log("Parameter "+ p);
				var v = BlobbyMan.interpolateParam(p, playTime);
				console.log("Value "+v);
				BlobbyMan[p] = v;
			}
			console.log("Render");
	 		BlobbyMan.render();
			console.log("Next frame");
	 		requestAnimationFrame(animate);
		}
	};
	//
	// 		console.log("Playback finished");

	// 	} else {
	// 		};
	// 	};
	// };
	console.log("AnimStart @ "+animStartTime);
	var intervalId    = requestAnimationFrame(animate);
	return;
};

/**
 * Actually draw the chap to the canvas
 */
BlobbyMan.render = function () {

	var time = Date.now() * 0.001;

	this.body.rotation.x = this.exten;
	this.body.rotation.y = this.btwis;
	this.body.rotation.z = this.rot;

	this.head.rotation.x = this.nod;
	this.head.rotation.z = this.neck;

	this.leftarm.eulerOrder = 'YZX';
	this.leftarm.rotation.y = this.lsid;
	this.leftarm.rotation.x = this.lshou;
	this.leftarm.rotation.z = this.latwis;

	this.rightarm.eulerOrder = 'YZX';
	this.rightarm.rotation.y = this.rsid;
	this.rightarm.rotation.x = this.rshou;
	this.rightarm.rotation.z = this.ratwis;


	this.llowarm.rotation.x = this.lelbo;
	this.rlowarm.rotation.x = this.relbo;

	this.lcalf.rotation.x = this.lknee;
	this.rcalf.rotation.x = this.rknee;

	this.lfoot.rotation.x = this.lankl;
	this.rfoot.rotation.x = this.rankl;

	//	this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.0005;
	// 	this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.0005;

	this.camera.lookAt(this.scene.position);

	this.renderer.render(this.scene, this.camera);

};

/**
 * Initalise the timeline slider
 */
BlobbyMan.initTimeSlider = function() {
	$( "#slidertime" ).slider({ title : "Time", max: BlobbyMan.maxAnimTime, value: 0,
								change: function (e, ui) {
									$(document).ready(function () {
														  // hook up our slider
														  BlobbyMan.animtime = $("#slidertime").slider( "value" );
														  console.log("Animtime @ "+BlobbyMan.animtime);
														  if (BlobbyMan.isKeyFrame(BlobbyMan.animtime)) {
															  // set highlight
															  console.log("Is KeyFrame");
															  $("#slidertime .ui-slider-handle").addClass("highlight");
														  } else {
															  // unset highlight
															  console.log("Is NormalFrame");
															  $("#slidertime .ui-slider-handle").removeClass("highlight");
														  }
														  $("#timestitle").replaceWith("<div id=\"timestitle\">Animation Time "+BlobbyMan.animtime.toString() + "</div>");
														  console.log("Animtime " + BlobbyMan.animtime.toString());
														  BlobbyMan.render(); }); } });
};

/**
 * Initalise UI buttons
 */
BlobbyMan.initButtons = function() {

	$( '#keybutton' ).click(function (e) {
								e.preventDefault();
								console.log("Set anim key @" + (BlobbyMan.animtime|0).toString());
								BlobbyMan.setKeyFrame();
							});

	$( '#urlbutton' ).click(function (e) {
								e.preventDefault();
								BlobbyMan.makeParamsUrl();
							});

	$( '#playbutton' ).click(function (e) {
								 console.log("Click playback");
								 e.preventDefault();
								 if (BlobbyMan.inPlayback === false) {
									 BlobbyMan.playBack();
								 }});

};

/**
 * Set up inital dialogs, etc
 */
BlobbyMan.initui = function () {

	$("#sliderext").slider({title : "Extension", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
							slide : function (e, ui) {
								$(document).ready(function () {
													  exten = $("#sliderext").slider( "value" );
													  render(); }); } });


	$("#slidertwist").slider({ title : "Twist ", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
							   slide: function (e, ui) {
								   $(document).ready(function () {
														 BlobbyMan.btwis = $("#slidertwist").slider( "value" );
														 BlobbyMan.render(); }); } });

	$("#sliderrot").slider({ title : "Rotation", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
							 slide: function (e, ui) {
								 $(document).ready(function () {
													   BlobbyMan.rot = $("#sliderrot").slider( "value" );
													   BlobbyMan.render(); }); } });

	$("#slidernod").slider({ title : "Nod", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
							 slide: function (e, ui) {
								 $(document).ready(function () {
													   BlobbyMan.nod = $("#slidernod").slider( "value" );
													   BlobbyMan.render(); }); } });

	$("#sliderneck").slider({ title : "Neck rotation", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
							  slide: function (e, ui) {
								  $(document).ready(function () {
														BlobbyMan.neck = $("#sliderneck").slider( "value" );
														BlobbyMan.render(); }); } });


	$( "#sliderlsid" ).slider({ title : "Left side", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								slide: function (e, ui) {
									$(document).ready(function () {
														  BlobbyMan.lsid = $("#sliderlsid").slider( "value" );
														  BlobbyMan.render(); }); } });

	$( "#sliderlshou" ).slider({ title : "Left shoulder", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								 slide: function (e, ui) {
									 $(document).ready(function () {
														   BlobbyMan.lshou = $("#sliderlshou").slider( "value" );
														   BlobbyMan.render(); }); } });

	$( "#sliderlatwis" ).slider({ title : "Left arm twist", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								  slide: function (e, ui) {
									  $(document).ready(function () {
															BlobbyMan.latwis = $("#sliderlatwis").slider( "value" );
															BlobbyMan.render(); }); } });

	$( "#sliderlelbo" ).slider({ title : "Left elbow", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								 slide: function (e, ui) {
									 $(document).ready(function () {
														   BlobbyMan.lelbo = $("#sliderlelbo").slider( "value" );
														   BlobbyMan.render(); }); } });

	$( "#sliderlknee" ).slider({ title : "Left kneee", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								 slide: function (e, ui) {
									 $(document).ready(function () {
														   BlobbyMan.lknee = $("#sliderlknee").slider( "value" );
														   BlobbyMan.render(); }); } });

	$( "#sliderlankl" ).slider({ title : "Left ankle", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								 slide: function (e, ui) {
									 $(document).ready(function () {
														   BlobbyMan.lankl = $("#sliderlankl").slider( "value" );
														   BlobbyMan.render(); }); } });


	$( "#sliderrsid" ).slider({ title : "Right side", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								slide: function (e, ui) {
									$(document).ready(function () {
														  BlobbyMan.rsid = $("#sliderrsid").slider( "value" );
														  BlobbyMan.render(); }); } });

	$( "#sliderrshou" ).slider({ title : "Right shoulder", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								 slide: function (e, ui) {
									 $(document).ready(function () {
														   BlobbyMan.rshou = $("#sliderrshou").slider( "value" );
														   BlobbyMan.render(); }); } });

	$( "#sliderratwis" ).slider({ title : "Right arm twist", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								  slide: function (e, ui) {
									  $(document).ready(function () {
															BlobbyMan.ratwis = $("#sliderratwis").slider( "value" );
															BlobbyMan.render(); }); } });

	$( "#sliderrelbo" ).slider({ title : "Right elbow", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								 slide: function (e, ui) {
									 $(document).ready(function () {
														   BlobbyMan.relbo = $("#sliderrelbo").slider( "value" );
														   BlobbyMan.render(); }); } });

	$( "#sliderrknee" ).slider({ title : "Left kneee", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								 slide: function (e, ui) {
									 $(document).ready(function () {
														   BlobbyMan.rknee = $("#sliderrknee").slider( "value" );
														   BlobbyMan.render(); }); } });

	$( "#sliderrankl" ).slider({ title : "Right ankle", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								 slide: function (e, ui) {
									 $(document).ready(function () {
														   BlobbyMan.rankl = $("#sliderrankl").slider( "value" );
														   BlobbyMan.render(); }); } });

	BlobbyMan.initTimeSlider();
	BlobbyMan.initButtons();
};

/**
 * Set up initial parameters and callbacks
 */
BlobbyMan.init = function () {

	var geometry, material, sphere, container;

	container = document.createElement( 'div' );
	container.id = "renderarea";
	document.body.appendChild( container );

	this.initui();

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.Fog( 0xffffff, 1, 100 );

	/* set up the camera */
	this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100 );
	this.camera.position.y = -5;
	this.camera.up.z = 1.0;
	this.camera.up.y = 0.0;
	this.camera.up.x = 0.0;
	this.camera.lookAt({ x: 0.0, y : 0.0, z: 0.0 });
	this.scene.add( this.camera );

	/** create a generic sphere and material for us to use **/
	geometry = new THREE.SphereGeometry( 1.0, 32, 32 );
	material = new THREE.MeshNormalMaterial();

	/** create the objects that compose the man */
	this.torso = new THREE.Object3D();
	this.leftleg  = new THREE.Object3D();
	this.rightleg  = new THREE.Object3D();
	this.body  = new THREE.Object3D();
	this.shoulder = new THREE.Object3D();
	this.head =	 new THREE.Object3D();
	this.leftarm = new THREE.Object3D();
	this.rightarm = new THREE.Object3D();

	this.lfoot = new THREE.Object3D();
	this.lcalf = new THREE.Object3D();
	this.lthigh = new THREE.Object3D();

	this.rfoot = new THREE.Object3D();
	this.rcalf = new THREE.Object3D();
	this.rthigh = new THREE.Object3D();

	this.luparm = new THREE.Object3D();
	this.ruparm = new THREE.Object3D();

	this.llowarm = new THREE.Object3D();
	this.lhand = new THREE.Object3D();
	this.rlowarm = new THREE.Object3D();
	this.rhand = new THREE.Object3D();


	/** build up the body, node by node **/
	sphere = new THREE.Mesh( geometry, material );
	sphere.position.z = 0.08;
	sphere.scale.x = 0.275;
	sphere.scale.y = 0.152;
	sphere.scale.z = 0.153;
	this.torso.add( sphere );
	this.leftleg.position.x = -0.178;
	this.torso.add(this.leftleg);
	//body.rotation.x = exten
	//body.rotation.y = btwis
	//body.rotation.z = rot
	this.torso.add(this.body);
	this.rightleg.position.x = 0.178;
	this.torso.add(this.rightleg);


	sphere = new THREE.Mesh( geometry, material );
	sphere.position.z = 0.62;
	sphere.scale.x = 0.306;
	sphere.scale.y = 0.21;
	sphere.scale.z = 0.5;
	this.body.add(sphere);

	this.shoulder.position.z = 1;
	//shoulder.rotation.x = exten
	//shoulder.rotation.y = btwis
	//shoulder.rotation.z = rot
	this.body.add(this.shoulder);

	// head --

	sphere = new THREE.Mesh( geometry, material );
	sphere.scale.x = 0.45;
	sphere.scale.y = 0.153;
	sphere.scale.z = 0.12;
	this.shoulder.add(sphere);

	this.head.position.z = 0.153;
	this.shoulder.add(this.head);


	sphere = new THREE.Mesh( geometry, material );
	sphere.position.x = 0;
	sphere.position.y = 0;
	sphere.position.z = 0.4;
	sphere.scale.x = 0.2;
	sphere.scale.y = 0.23;
	sphere.scale.z = 0.3;
	this.head.add(sphere);

	// nose
	sphere = new THREE.Mesh( geometry, material );
	sphere.position.x = 0;
	sphere.position.y = -0.255;
	sphere.position.z = 0.33;
	sphere.scale.x = 0.035;
	sphere.scale.y = 0.075;
	sphere.scale.z = 0.035;
	this.head.add(sphere);

	// eyes
	sphere = new THREE.Mesh( geometry, material );
	sphere.position.x = -0.07;
	sphere.position.y = -0.233;
	sphere.position.z = 0.43;
	sphere.scale.x = 0.065;
	sphere.scale.y = 0.035;
	sphere.scale.z = 0.035;
	this.head.add(sphere);

	sphere = new THREE.Mesh( geometry, material );
	sphere.position.x = 0.07;
	sphere.position.y = -0.233;
	sphere.position.z = 0.43;
	sphere.scale.x = 0.065;
	sphere.scale.y = 0.035;
	sphere.scale.z = 0.035;
	this.head.add(sphere);

	// neck
	sphere = new THREE.Mesh( geometry, material );
	sphere.position.x = 0;
	sphere.position.y = 0;
	sphere.position.z = 0.07;
	sphere.scale.x = 0.065;
	sphere.scale.y = 0.065;
	sphere.scale.z = 0.14;
	this.head.add(sphere);

	// mouth
	sphere = new THREE.Mesh( geometry, material );
	sphere.position.x = 0;
	sphere.position.y = -0.162;
	sphere.position.z = 0.239;
	sphere.scale.x = 0.0677;
	sphere.scale.y = 0.04;
	sphere.scale.z = 0.0506;
	this.head.add(sphere);

	this.leftarm.position.x = -0.45;
	//leftarm.rot.y = lsid
	//leftarm.rot.x = lshou
	//leftarm.rot.z = latwis
	this.shoulder.add(this.leftarm);

	this.rightarm.position.x = 0.45;
	//leftarm.rot.y = rsid
	//leftarm.rot.x = rshou
	//leftarm.rot.z = ratwis
	this.shoulder.add(this.rightarm);

	this.leftarm.add(this.luparm);
	this.llowarm.position.z = -0.55;
	//llowarm.rotation.x = lelbo
	this.luparm.add(this.llowarm);
	this.lhand.position.z = -0.5;
	this.llowarm.add(this.lhand);

	this.rightarm.add(this.ruparm);
	this.rlowarm.position.z = -0.55;
	//rlowarm.rotation.x = relbo
	this.ruparm.add(this.rlowarm);
	this.rhand.position.z = -0.5;
	this.rlowarm.add(this.rhand);


	sphere = new THREE.Mesh( geometry, material );
	sphere.position.z = -0.275;
	sphere.scale.x = 0.09;
	sphere.scale.y = 0.09;
	sphere.scale.z = 0.275;
	this.luparm.add(sphere);
	sphere = new THREE.Mesh( geometry, material );
	sphere.position.z = -0.275;
	sphere.scale.x = 0.09;
	sphere.scale.y = 0.09;
	sphere.scale.z = 0.275;
	this.ruparm.add(sphere);

	sphere = new THREE.Mesh( geometry, material );
	sphere.scale.x = 0.08;
	sphere.scale.y = 0.08;
	sphere.scale.z = 0.25;
	sphere.position.z = -0.25;
	this.llowarm.add(sphere);
	sphere = new THREE.Mesh( geometry, material );
	sphere.scale.x = 0.08;
	sphere.scale.y = 0.08;
	sphere.scale.z = 0.25;
	sphere.position.z = -0.25;
	this.rlowarm.add(sphere);

	sphere = new THREE.Mesh( geometry, material );
	sphere.scale.x = 0.052;
	sphere.scale.y = 0.091;
	sphere.scale.z = 0.155;
	sphere.position.z = -0.116;
	this.lhand.add(sphere);
	sphere = new THREE.Mesh( geometry, material );
	sphere.scale.x = 0.052;
	sphere.scale.y = 0.091;
	sphere.scale.z = 0.155;
	sphere.position.z = -0.116;
	this.rhand.add(sphere);

	//leftleg.rotation.z = lhip;
	//leftleg.roataton.y = lout;
	//leftleg.rotation.z = -lhip;
	//leftlet.rotation.z = ltwis;

	this.leftleg.add(this.lthigh);
	this.lcalf.position.z = -0.85;
	//lcalf.rot.x = lknee
	this.lthigh.add(this.lcalf);
	this.lfoot.position.z = -0.84;
	//lfoot.rot.x = lankl
	this.lcalf.add(this.lfoot);


	this.rightleg.add(this.rthigh);
	this.rcalf.position.z = -0.85;
	//lcalf.rot.x = lknee
	this.rthigh.add(this.rcalf);
	this.rfoot.position.z = -0.84;
	//lfoot.rot.x = lankl
	this.rcalf.add(this.rfoot);

	sphere = new THREE.Mesh( geometry, material );
	sphere.position.z = -0.425;
	sphere.scale.x =0.141;
	sphere.scale.y=0.141;
	sphere.scale.z=0.425;
	this.lthigh.add(sphere);
	sphere = new THREE.Mesh( geometry, material );
	sphere.position.z = -0.425;
	sphere.scale.x =0.141;
	sphere.scale.y=0.141;
	sphere.scale.z=0.425;
	this.rthigh.add(sphere);

	sphere = new THREE.Mesh( geometry, material );
	sphere.scale.x=0.05;
	sphere.scale.y=0.05;
	sphere.scale.z=0.05;
	this.lcalf.add(sphere);

	sphere = new THREE.Mesh( geometry, material );
	sphere.scale.x=0.05;
	sphere.scale.y=0.05;
	sphere.scale.z=0.05;
	this.rcalf.add(sphere);

	sphere = new THREE.Mesh( geometry, material );
	sphere.position.z = -0.425;
	sphere.scale.x=0.1;
	sphere.scale.y=0.1;
	sphere.scale.z=0.425;
	this.lcalf.add(sphere);
	sphere = new THREE.Mesh( geometry, material );
	sphere.position.z = -0.425;
	sphere.scale.x=0.1;
	sphere.scale.y=0.1;
	sphere.scale.z=0.425;
	this.rcalf.add(sphere);

	sphere = new THREE.Mesh( geometry, material );
	sphere.scale.x=0.05;
	sphere.scale.y=0.04;
	sphere.scale.z=0.04;
	this.lfoot.add(sphere);
	sphere = new THREE.Mesh( geometry, material );
	sphere.scale.x=0.05;
	sphere.scale.y=0.04;
	sphere.scale.z=0.04;
	this.rfoot.add(sphere);

	sphere = new THREE.Mesh( geometry, material );
	sphere.position.y = 0.05;
	sphere.position.z = -0.05;
	sphere.scale.x=0.04;
	sphere.scale.y=0.04;
	sphere.scale.z=0.04;
	this.lfoot.add(sphere);
	sphere = new THREE.Mesh( geometry, material );
	sphere.position.y = 0.05;
	sphere.position.z = -0.05;
	sphere.scale.x=0.04;
	sphere.scale.y=0.04;
	sphere.scale.z=0.04;
	this.rfoot.add(sphere);

	sphere = new THREE.Mesh( geometry, material );
	sphere.position.y = -0.015;
	sphere.position.z = -0.05;
	sphere.rotation.x = -10;
	sphere.scale.x=0.08;
	sphere.scale.y=0.19;
	sphere.scale.z=0.05;
	this.lfoot.add(sphere);
	sphere = new THREE.Mesh( geometry, material );
	sphere.position.y = -0.015;
	sphere.position.z = -0.05;
	sphere.rotation.x = -10;
	sphere.scale.x=0.08;
	sphere.scale.y=0.19;
	sphere.scale.z=0.05;
	this.rfoot.add(sphere);

	this.scene.add( this.torso );

	/** init keys for the first frame **/
	BlobbyMan.samples[0] = {};
	$.each(BlobbyMan.paramNames,
		   function(i,p) {
			   BlobbyMan.samples[0][p] = BlobbyMan[p];
		   });

	BlobbyMan.makeKeyButton(0);

	/** set up the renderer **/
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize( window.innerWidth, window.innerHeight );
	this.renderer.sortObjects = false;

	container.appendChild( this.renderer.domElement );

	this.render();
};

/**
 * Here, the rubber meets the road
 */
$(document).ready(function () { BlobbyMan.init(); } );
