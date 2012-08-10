
/*global window:false, $:false, THREE:false */
/*jslint white:false, browser:true  */
'use strict';		

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
BlobbyMan.rot   = 0;
BlobbyMan.neck  = 0;
BlobbyMan.nod   = 0;
BlobbyMan.lsid  = 0;
BlobbyMan.lshou = 0;
BlobbyMan.latwis = 0;
BlobbyMan.lelbo = 0;
BlobbyMan.rsid  = 0;
BlobbyMan.rshou = 0;
BlobbyMan.ratwis = 0;
BlobbyMan.relbo = 0;
BlobbyMan.lankl = 0;
BlobbyMan.rankl = 0;
BlobbyMan.lknee = 0;
BlobbyMan.rknee = 0;
BlobbyMan.animtime = 0;

BlobbyMan.render = function() {

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

	this.camera.position.x += ( this.mouseX - this.camera.position.x ) * 0.0005;
	this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * 0.0005;

	this.camera.lookAt( this.scene.position );

	this.renderer.render( this.scene, this.camera );

};

BlobbyMan.initui = function() {

	$("#sliderext").slider({ title : "Extension", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
							 slide : function (e, ui) {
								 $(document).ready(function () {
									 BlobbyMan.exten = $("#sliderext").slider( "value" );
									 BlobbyMan.render(); }); } });


	$("#slidertwist").slider({ title : "Twist ", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
							   slide: function(e, ui) {
								   $(document).ready(function() {
									   BlobbyMan.btwis = $("#slidertwist").slider( "value" );
									   BlobbyMan.render(); }); } });

	$("#sliderrot").slider({ title : "Rotation", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
							 slide: function(e, ui) {
								 $(document).ready(function() {
									 BlobbyMan.rot = $("#sliderrot").slider( "value" );
									 BlobbyMan.render(); }); } });

	$("#slidernod").slider({ title : "Nod", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
							 slide: function(e, ui) {
								 $(document).ready(function() {
									 BlobbyMan.nod = $("#slidernod").slider( "value" );
									 BlobbyMan.render(); }); } });

	$("#sliderneck").slider({ title : "Neck rotation", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
							  slide: function(e, ui) {
								  $(document).ready(function() {
									  BlobbyMan.neck = $("#sliderneck").slider( "value" );
									  BlobbyMan.render(); }); } });


	$( "#sliderlsid" ).slider({ title : "Left side", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								slide: function(e, ui) {
									$(document).ready(function() {
										BlobbyMan.lsid = $("#sliderlsid").slider( "value" );
										BlobbyMan.render(); }); } });

	$( "#sliderlshou" ).slider({ title : "Left shoulder", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								 slide: function(e, ui) {
									 $(document).ready(function() {
										 BlobbyMan.lshou = $("#sliderlshou").slider( "value" );
										 BlobbyMan.render(); }); } });

	$( "#sliderlatwis" ).slider({ title : "Left arm twist", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								  slide: function(e, ui) {
									  $(document).ready(function() {
										  BlobbyMan.latwis = $("#sliderlatwis").slider( "value" );
										  BlobbyMan.render(); }); } });

	$( "#sliderlelbo" ).slider({ title : "Left elbow", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								 slide: function(e, ui) {
									 $(document).ready(function() {
										 BlobbyMan.lelbo = $("#sliderlelbo").slider( "value" );
										 BlobbyMan.render(); }); } });

	$( "#sliderlknee" ).slider({ title : "Left kneee", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								 slide: function(e, ui) {
									 $(document).ready(function() {
										 BlobbyMan.lknee = $("#sliderlknee").slider( "value" );
										 BlobbyMan.render(); }); } });

	$( "#sliderlankl" ).slider({ title : "Left ankle", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								 slide: function(e, ui) {
									 $(document).ready(function() {
										 BlobbyMan.lankl = $("#sliderlankl").slider( "value" );
										 BlobbyMan.render(); }); } });


	$( "#sliderrsid" ).slider({ title : "Right side", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								slide: function(e, ui) {
									$(document).ready(function() {
										BlobbyMan.rsid = $("#sliderrsid").slider( "value" );
										BlobbyMan.render(); }); } });

	$( "#sliderrshou" ).slider({ title : "Right shoulder", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								 slide: function(e, ui) {
									 $(document).ready(function() {
										 BlobbyMan.rshou = $("#sliderrshou").slider( "value" );
										 BlobbyMan.render(); }); } });

	$( "#sliderratwis" ).slider({ title : "Right arm twist", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								  slide: function(e, ui) {
									  $(document).ready(function() {
										  BlobbyMan.ratwis = $("#sliderratwis").slider( "value" );
										  BlobbyMan.render(); }); } });

	$( "#sliderrelbo" ).slider({ title : "Right elbow", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								 slide: function(e, ui) {
									 $(document).ready(function() {
										 BlobbyMan.relbo = $("#sliderrelbo").slider( "value" );
										 BlobbyMan.render(); }); } });

	$( "#sliderrknee" ).slider({ title : "Left kneee", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								 slide: function(e, ui) {
									 $(document).ready(function() {
										 BlobbyMan.rknee = $("#sliderrknee").slider( "value" );
										 BlobbyMan.render(); }); } });

	$( "#sliderrankl" ).slider({ title : "Right ankle", max: 3.14, min: -3.14, step : 0.05, value: 0.0,
								 slide: function(e, ui) {
									 $(document).ready(function() {
										 BlobbyMan.rankl = $("#sliderrankl").slider( "value" );
										 BlobbyMan.render(); }); } });

	$( "#slidertime" ).slider({ title : "Time", max: 60.0, min: 0.0, step : 1.0, value: 0.0,
								 slide: function(e, ui) {
									 $(document).ready(function() {
										 BlobbyMan.animtime = $("#slidertime").slider( "value" );
										 BlobbyMan.render(); }); } });

};

BlobbyMan.init = function() {

	var geometry, material, sphere, container;
	
	container = document.createElement( 'div' );
	container.id = "renderarea";
	document.body.appendChild( container );

	this.initui();

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.Fog( 0xffffff, 1, 100 );

	this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100 );
	this.camera.position.y = -5;
	this.camera.up.z = 1.0;
	this.camera.up.y = 0.0;
	this.camera.up.x = 0.0;
	this.camera.lookAt({ x: 0.0, y : 0.0, z: 0.0 });
	this.scene.add( this.camera );

	geometry = new THREE.SphereGeometry( 1.0, 32, 32 );
	material = new THREE.MeshNormalMaterial();

	this.torso = new THREE.Object3D();
	this.leftleg  = new THREE.Object3D();
	this.rightleg  = new THREE.Object3D();
	this.body  = new THREE.Object3D();
	this.shoulder = new THREE.Object3D();
	this.head =  new THREE.Object3D();
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

	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize( window.innerWidth, window.innerHeight );
	this.renderer.sortObjects = false;

	container.appendChild( this.renderer.domElement );

	this.render();
};

$(document).ready(function() { BlobbyMan.init(); } );

//	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

