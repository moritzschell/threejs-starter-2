import * as THREE from './lib/three.module.js';
import { GLTFLoader } from './lib/examples/jsm/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 10;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x555555); // light red background
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const color = 0xffffff; //Licht Farbe
const intensity = 1; //Licht Itensität
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(0, 0, 10); //Position
light.target.position.set(-5, 0, 0); //Ziel
scene.add(light);
scene.add(light.target);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);


//Load GLB Model
let model;
const loader = new GLTFLoader();
loader.load(
  './models/Fader.glb', // path to your model
  function (gltf) {
    model = gltf.scene;
    model.scale.set(60, 60, 60);
    //model.position.y = -3;
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error('An error occurred loading the model:', error);
  }
);


// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if(model != null){
    model.rotation.y += 0.01;
    model.rotation.x += 0.01;
  }

  renderer.render(scene, camera);
}
animate();

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});