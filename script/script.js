
import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

const game = document.querySelector("#game");

if (!game) {
  throw new Error('Missing #game container in index.html');
}

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color("#65c5ff");
scene.fog = new THREE.Fog("#a8e0ff", 35, 100);

const camera = new THREE.PerspectiveCamera(
  48, window.innerWidth / window.innerHeight, 0.1, 200
);
camera.position.set(0, 11, 22);
camera.lookAt(0, 2, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.domElement.style.position = "absolute";
renderer.domElement.style.inset = "0";
renderer.domElement.style.width = "100%";
renderer.domElement.style.height = "100%";
renderer.domElement.style.zIndex = "0";
game.prepend(renderer.domElement);

// LIGHTING
scene.add(new THREE.HemisphereLight("#e7f8ff", "#658b48", 2));

const sun = new THREE.DirectionalLight("#fff0c8", 3);
sun.position.set(-8, 18, 12);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

// MATERIAL HELPER
function mat(color, roughness = 0.85) {
  return new THREE.MeshStandardMaterial({ color, roughness });
}

const green = mat("#68c943");
const darkGreen = mat("#359b43");
const wood = mat("#a96032");
const cream = mat("#fff0d0");
const blue = mat("#38b9ef");
const red = mat("#ff6b64");
const yellow = mat("#ffc447");
const white = mat("#fffaf0");
const teal = mat("#14b9a8");
const pink = mat("#ff91bd");

// BASIC TOY SHAPES
function block(x, y, z, w, h, d, material, parent = scene) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d), material
  );
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function ball(x, y, z, radius, material, parent = scene) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 16, 12), material
  );
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(x, y, z, rt, rb, h, material, parent = scene) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(rt, rb, h, 12), material
  );
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

// GREEN LEGO-LIKE LAND
block(0, -0.45, 0, 60, 0.8, 60, green);

function stud(x, z, color = "#48ad36") {
  cylinder(x, 0.02, z, 0.13, 0.13, 0.12, mat(color));
}

for (let x = -25; x <= 25; x += 1.8) {
  for (let z = -18; z <= 18; z += 1.8) {
    if (Math.random() > 0.38 && Math.abs(x) > 5) {
      stud(x, z);
    }
  }
}

// TOY TREES
function tree(x, z, size = 1) {
  cylinder(
    x, 0.8 * size, z, 0.23 * size, 0.3 * size,
    1.6 * size, wood
  );

  const crown = block(
    x, 2.1 * size, z, 1.65 * size,
    1.35 * size, 1.45 * size, darkGreen
  );
  crown.position.y = 2.05 * size;

  ball(
    x, 2.9 * size, z, 0.18 * size, green
  );
  ball(
    x + 0.4 * size, 2.25 * size, z - 0.7 * size,
    0.17 * size, green
  );
  ball(
    x - 0.4 * size, 2.3 * size, z + 0.7 * size,
    0.17 * size, green
  );
}

for (let i = 0; i < 18; i++) {
  const side = i % 2 === 0 ? -1 : 1;
  tree(side * (8 + Math.random() * 8),
    -8 + Math.random() * 20,
    0.8 + Math.random() * 0.65);
}

// SMALL COLOURFUL HOUSES
function house(x, z, roofColor) {
  block(x, 1.15, z, 3.2, 2.3, 2.7, cream);
  block(x, 2.45, z, 3.5, 0.25, 3, yellow);

  // Two roof slopes
  const roof1 = block(
    x - 0.8, 3.05, z, 2, 0.3, 3.3, mat(roofColor)
  );
  roof1.rotation.z = -0.45;

  const roof2 = block(
    x + 0.8, 3.05, z, 2, 0.3, 3.3, mat(roofColor)
  );
  roof2.rotation.z = 0.45;

  block(x, 0.75, z - 1.38, 0.8, 1.5, 0.12, wood);

  for (const wx of [-1, 1]) {
    block(x + wx, 1.65, z - 1.4, 0.55, 0.6, 0.1, blue);
  }
}

house(-8, -2, "#ff655f");
house(8, -3, "#ffc33f");
house(-5, 5, "#42b7ff");
house(11, 5, "#ffbf4c");

// MOSQUE
function mosque() {
  const x = 1, z = -8;

  block(x, 1.4, z, 6, 2.8, 4, cream);

  // Green dome
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(1.8, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    mat("#28b77b")
  );
  dome.position.set(x, 2.8, z);
  scene.add(dome);

  // Minaret
  cylinder(4.5, 2.4, z, 0.38, 0.48, 4.8, cream);
  cylinder(4.5, 4.9, z, 0.58, 0.58, 0.25, mat("#25b77c"));
  cylinder(4.5, 5.8, z, 0.2, 0.32, 1.5, cream);
  ball(4.5, 6.65, z, 0.25, yellow);
  block(x, 0.95, z - 2.06, 1.1, 1.9, 0.15, wood);
}

mosque();

// RIVER
block(12, -0.02, 2, 5, 0.12, 24, blue);

const water = new THREE.MeshStandardMaterial({
  color: "#39bdf5",
  roughness: 0.22,
  metalness: 0.08
});
block(12, 0.08, 2, 4.5, 0.08, 23, water);

// BRIDGE
block(12, 0.45, 1, 5.3, 0.3, 2.4, wood);

for (const side of [-1, 1]) {
  block(12 + side * 2.4, 0.95, 1, 0.2, 1.1, 2.8, wood);

  for (let i = 0; i < 4; i++) {
    block(
      12 + side * 2.4, 0.8, 0.1 + i * 0.6,
      0.32, 1.4, 0.3, mat("#c87b40")
    );
  }
}

// CUTE TOY EXPLORERS
function character(x, z, outfit, isGirl = false) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  scene.add(group);

  // Feet
  block(-0.28, 0.18, 0, 0.42, 0.32, 0.55, white, group);
  block(0.28, 0.18, 0, 0.42, 0.32, 0.55, white, group);

  // Legs and body
  block(0, 0.65, 0, 0.9, 0.7, 0.65, mat(outfit), group);
  block(0, 1.4, 0, 1.15, 1.1, 0.7, mat(outfit), group);

  // Arms
  block(-0.72, 1.3, 0, 0.3, 0.8, 0.38, mat(outfit), group);
  block(0.72, 1.3, 0, 0.3, 0.8, 0.38, mat(outfit), group);

  // Head
  ball(0, 2.35, 0, 0.72, mat("#ffd2a7"), group);

  // Headwear
  if (isGirl) {
    ball(0, 2.62, 0, 0.78, mat("#fff0d5"), group);
    block(0, 2.2, -0.38, 1.1, 1, 0.35, mat("#fff0d5"), group);
  } else {
    ball(0, 2.95, 0, 0.7, white, group);
    block(0, 2.7, 0, 1.05, 0.16, 0.9, white, group);
  }

  // Eyes and smile
  ball(-0.25, 2.42, 0.61, 0.105, mat("#34251f"), group);
  ball(0.25, 2.42, 0.61, 0.105, mat("#34251f"), group);
  ball(0, 2.14, 0.65, 0.12, mat("#e66a65"), group);

  // Backpack
  block(0, 1.45, 0.48, 0.65, 0.75, 0.25, pink, group);

  return group;
}

const zayn = character(-2, 1, "#16b8ac", false);
const aisha = character(1.1, 1.6, "#ffbe36", true);

// PATH
for (let i = 0; i < 15; i++) {
  block(
    -2 + Math.sin(i * 0.25) * 1.8,
    0.02,
    5 + i * 0.85,
    1.7, 0.12, 0.8,
    mat(i % 2 ? "#ffdc9a" : "#f6c878")
  );
}

// FLOWERS
for (let i = 0; i < 35; i++) {
  const x = (Math.random() - 0.5) * 24;
  const z = (Math.random() - 0.5) * 24;
  if (Math.abs(x) < 5 && z > -3 && z < 6) continue;

  const flowerColors = ["#ff75bd", "#fff3d4", "#ffd34e"];
  cylinder(x, 0.22, z, 0.04, 0.05, 0.4, green);
  ball(
    x, 0.45, z, 0.22,
    mat(flowerColors[i % flowerColors.length])
  );
}

// RESIZE
function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize);

// ANIMATION
function animate() {
  requestAnimationFrame(animate);

  const t = performance.now() * 0.001;
  aisha.position.y = Math.sin(t * 2) * 0.06;
  zayn.position.y = Math.sin(t * 2 + 1) * 0.06;

  renderer.render(scene, camera);
}

animate();
