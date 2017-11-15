///
/// Week 6 Post
/// This week was a real Fail
/// patched together by nico
///
import * as pkgLib from '../../lib/module.js'
//import * as colorName from '../nazel-snips/randomCssColors.js'
import colorName from '../nazel-snips/randomColors.js'

var modelsInfo = {
    "modelNames": [
        "Low_Poly_Grass_002",
        "Low_Poly_Tree_001",
        "Low_Poly_Tree_002",
        "Low_Poly_Tree_003",
        "Low_Poly_Tree_004",
        "Low_Poly_Tree_005",
        "Low_Poly_Tree_006",
        "Low_Poly_Tree_Stump_001",
        "Low_Poly_Tree_Stump_002",
        "Low_Poly_Bush_001",
        "Low_Poly_Bush_002"
      ],
      "endings":{
        "model":".obj",
        "material":".mtl"
      }
  }

var mixers = [];
// you should rename this to match your own renderer
//import setupClass from 'nazel-6-renderer.js'
class setupClass {
    constructor(
      { // Constructor inputs
            path = '../../data/',
            width = 500,
            height = 500,
            background = 0x9fd3ea, //background = 0xf6e4f3,
            ambient = 0x9fd3ea, //ambient = 0x14031B,
            light = 0xFFFFFF,  // light = 0xFEEBC1,
            ground = 0xF2E9CF,
            webgl = { antialias: true, shadowMapEnabled: true },
            position = { x:0, y:0, z:0 },
            fog = { color: 0x63686a, near: 0, far: 1000 },
            cam = { fov: 60, aspect: width/height, near: 0.1, far: 2e4 },
            update = (time) => { },
      }={})
      { //Start of Constructor function


        // stats
        var stats = new Stats();


        let clock = new pkgLib.Clock()

        let listener = new pkgLib.AudioListener()

        let renderer = new pkgLib.WebGLRenderer(webgl)
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(width, height)
            renderer.setClearColor(ambient, 0)
            renderer.shadowMap.type = pkgLib.PCFSoftShadowMap
            renderer.shadowMap.enabled = true


        let scene = new pkgLib.Scene()
            scene.fog = new pkgLib.Fog(...Object.values(fog))
            scene.background = new pkgLib.Color(background)
            scene.add(new pkgLib.AmbientLight(ambient))


        let camera = new pkgLib.PerspectiveCamera(...Object.values(cam))
            //camera.position.set(...Object.values(position))
            camera.position.x = 0;
            camera.position.y = 35;
            camera.position.z = -25;
            console.log("Camera Position", camera.position)

            scene.add(camera)


				let hemiLight = new pkgLib.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
				hemiLight.color.setHSL( 0.6, 1, 0.6 );
				hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
				hemiLight.position.set( 0, 300, 0 );
        hemiLight.intensity = .8;

				//scene.add( hemiLight );

//color intensity
        var dirLight = new pkgLib.DirectionalLight( 0xffffff, .9 );
        dirLight.color.setHSL( 0.1, 1, 0.95 );
        dirLight.position.set( -1, 300, -300 );
        //dirLight.position.multiplyScalar( 10 );
        scene.add( dirLight );
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        var d = 500;
        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;
        dirLight.shadow.camera.far = 3500;
        dirLight.shadow.bias = -0.0001;
        var dirLightHeper = new pkgLib.DirectionalLightHelper( dirLight, 10 )
        //scene.add( dirLightHeper );
        //let sun = new pkgLib.HemisphereLight(light, ground, 0.5)
        //    sun.position.set(1,2,0)
        //    scene.add(sun)

        let controls = new pkgLib.OrbitControls(camera,renderer.domElement)

        //
////////////////////////////////////////Plane Material
        var planegeometry = new THREE.PlaneGeometry( 1000, 1000, 32 );
        var material = new THREE.MeshLambertMaterial( {color: 0xffffff} );
        var plane = new THREE.Mesh( planegeometry, material );
        plane.receiveShadow = true;
        plane.castShadow = false;
        //console.log(camera.position);
        plane.lookAt(  new THREE.Vector3( 0, 1, 0 ));//{x:0,y:-1,z:0});//camera.position );
        scene.add( plane );

        this.ObjectsToScene = (...things) => things.forEach(o => scene.add(o))
        //this.ThingyToScene = function(thingy){scene.add(...thingy);};

        const render = () => {
            requestAnimationFrame(render.bind(this))
            controls.update()
            update(clock.getDelta())
            renderer.render(scene, camera)
            //let theBird = scene.getObjectByName( "mybirdy" );
            //if (camera.position.z <250){
            //camera.position.z+=.5
            //controls.target.z+=.5
            //theBird.position.z+=.5
            //}
            //else{
            //  camera.position.z=0
            //  controls.target.z=0
          //    theBird.position.z =0
          //  }
          //  let x = camera.position.x
          //  let y = camera.position.y
          //  let z = camera.position.z

            animate();


        }

        function animate() {
      				requestAnimationFrame( animate );
      				if ( mixers.length > 0 ) {
      					for ( var i = 0; i < mixers.length; i ++ ) {
                  ////something about timeing I just dont understand
      						mixers[ i ].update( clock.getDelta()+.0001 );
      					}
      				}
      	}

        window.addEventListener('load', () => render(), false);
        let div = document.getElementById('3dDiv')
        div.appendChild(renderer.domElement)
    }//end constructor
}//end of class

//let gui = new dat.GUI({ autoPlace: false, height : 40});
//let guiDiv = document.getElementById('my-gui-div');
//guiDiv.appendChild(gui.domElement);
//var RateOb = {rate:4};
//gui.add(RateOb, "rate");
let clock = new pkgLib.Clock()


// a "terrain" and a "thing", our object containers
var objectArray = [];
var objectUpdates = [];
// a rate of rotation and delta time
let rate = 3;
let dt = 5;

function update(time) {
    dt += time
    var time = Date.now() * 0.0005;

}

var renderer = new setupClass(
  {
    position: { x: 0, y: 10, z: 15 },
    update: (thisTime) => update(thisTime),
  });



var modelPath = '../../../code/nazel/model/forestAssets/';
var modelRefData = modelPath+'models.json';

var Tree_texture = new THREE.TextureLoader().load( '../../../code/nazel/nazel-10/img/color-tp.png' );
var Tree_bump = new THREE.TextureLoader().load( '../../../code/nazel/nazel-10/img/black.png' );
var Tree_material = new THREE.MeshPhongMaterial( { map: Tree_texture, bumpMap:Tree_bump, bumpScale: 50 } );
Tree_material.transparent = true;

var Tree_planegeometry = new THREE.PlaneGeometry( 100, 100, 32 );

var Tree_plane = new THREE.Mesh( Tree_planegeometry, Tree_material );
Tree_plane.receiveShadow = true;
Tree_plane.castShadow = true;
Tree_planegeometry.receiveShadow = true;
Tree_planegeometry.castShadow = true;
Tree_plane.lookAt(  new THREE.Vector3( -1, 0, -1 ));
Tree_plane.position.y =50;//({x:10,y:40,z:10});
renderer.ObjectsToScene(Tree_plane);
