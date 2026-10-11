```javascript
import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

// ===================================
// LITTLE EXPLORERS - 3D WORLD
// ===================================

const container = document.querySelector("#game");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#91dcff");
scene.fog = new THREE.Fog("#91dcff", 38, 100);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;

container.prepend(renderer.domElement);

// ===================================
// LIGHTING
// ===================================

scene.add(new THREE.HemisphereLight("#eafaff", "#63884b", 2));

const sunlight = new THREE.DirectionalLight("#fff1d2", 3);
sunlight.position.set(-12, 25, 12);
sunlight.castShadow = true;
sunlight.shadow.mapSize.set(1024, 1024);
sunlight.shadow.camera.left = -35;
sunlight.shadow.camera.right = 35;
sunlight.shadow.camera.top = 35;
sunlight.shadow.camera.bottom = -35;
scene.add(sunlight);

// ===================================
// MATERIALS AND BRICK BUILDING
// ===================================

const mat = (color, roughness = 0.85) =>
  new THREE.MeshStandardMaterial({ color, roughness });

const grassMat = mat("#80ce63");
const darkGrass = mat("#52a950");
const pathMat = mat("#f4ce91");
const brickMat = mat("#e9a56c");
const whiteMat = mat("#fff3d8");
const brownMat = mat("#95603e");
const greenMat = mat("#36a86a");
const blueMat = mat("#55bce8");
const pinkMat = mat("#ff9bb9");
const yellowMat = mat("#ffd65c");

function box(parent, x, y, z, w, h, d, material, studs = false) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);

  if (studs && w > 0.5 && d > 0.5) {
    const studGeo = new THREE.CylinderGeometry(
      0.105, 0.105, 0.09, 10
    );

    for (let sx = -w / 2 + 0.24; sx < w / 2 - 0.12; sx += 0.42) {
      for (let sz = -d / 2 + 0.24; sz < d / 2 - 0.12; sz += 0.42) {
        const stud = new THREE.Mesh(studGeo, material);
        stud.position.set(x + sx, y + h / 2 + 0.045, z + sz);
        stud.castShadow = true;
        parent.add(stud);
      }
    }
  }

  return mesh;
}

function sphere(parent, x, y, z, radius, material, scale = [1, 1, 1]) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 16, 12),
    material
  );

  mesh.position.set(x, y, z);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

// ===================================
// GRASS AND PATH
// ===================================

box(scene, 0, -0.35, -10, 100, 0.6, 100, grassMat);

for (let i = -45; i <= 35; i += 5) {
  box(scene, -9, 0, i, 0.3, 0.08, 3, darkGrass);
  box(scene, 9, 0, i + 2, 0.3, 0.08, 3, darkGrass);
}

// Winding-looking central walkway
box(scene, 0, 0.015, -7, 5, 0.12, 48, pathMat);

const pathTileColors = [
  "#f6d7a1", "#edc18a", "#ffe0a7"
];

for (let z = -29; z < 17; z += 2.1) {
  box(
    scene,
    Math.sin(z * 0.18) * 0.15,
    0.1,
    z,
    1.4,
    0.045,
    1.5,
    mat(pathTileColors[Math.abs(Math.floor(z)) % 3])
  );
}

// ===================================
// TOY TREES
// ===================================

function makeTree(x, z, size = 1) {
  const tree = new THREE.Group();
  tree.position.set(x, 0, z);
  tree.scale.setScalar(size);
  scene.add(tree);

  box(tree, 0, 0.85, 0, 0.48, 1.7, 0.48, brownMat, true);

  sphere(tree, 0, 2.05, 0, 1.05, greenMat, [1, 0.95, 1]);
  sphere(tree, -0.48, 2.2, 0.12, 0.7, mat("#73d85c"));
  sphere(tree, 0.48, 2.25, -0.1, 0.68, mat("#8be46b"));

  return tree;
}

for (let i = 0; i < 15; i++) {
  const z = -32 + i * 3.8;
  makeTree(-7 - Math.sin(i) * 1.5, z, 0.8 + (i % 3) * 0.12);
  makeTree(7 + Math.cos(i) * 1.2, z + 1, 0.85 + (i % 2) * 0.2);
}

// ===================================
// COLORFUL BRICK HOUSES
// ===================================

function makeHouse(x, z, wallColor, roofColor) {
  const house = new THREE.Group();
  house.position.set(x, 0, z);
  scene.add(house);

  const wall = mat(wallColor);
  const roof = mat(roofColor);

  box(house, 0, 1.25, 0, 3.6, 2.5, 3, wall, true);

  // Sloped-looking roof layers
  box(house, 0, 2.65, 0, 4.1, 0.35, 3.5, roof, true);
  box(house, 0, 2.9, 0, 3.6, 0.22, 3, roof, true);

  // Door
  box(house, 0, 0.7, 1.53, 0.8, 1.4, 0.12, brownMat);

  // Windows
  box(house, -1.15, 1.65, 1.56, 0.75, 0.7, 0.1, blueMat);
  box(house, 1.15, 1.65, 1.56, 0.75, 0.7, 0.1, blueMat);

  // Window frames
  box(house, -1.15, 1.65, 1.64, 0.09, 0.75, 0.08, whiteMat);
  box(house, 1.15, 1.65, 1.64, 0.09, 0.75, 0.08, whiteMat);

  return house;
}

makeHouse(-10, -5, "#fff0c5", "#ff8a76");
makeHouse(10, -10, "#ffe6c7", "#65b8ed");
makeHouse(-11, 8, "#ffd8e0", "#ffbc54");
makeHouse(10, 7, "#fff2d5", "#a78bfa");
makeHouse(-13, -20, "#ffedba", "#70cf95");
makeHouse(13, -25, "#ffe4b6", "#ef8b75");

// ===================================
// FLOWERS
// ===================================

function makeFlower(x, z, color) {
  const flower = new THREE.Group();
  flower.position.set(x, 0, z);
  scene.add(flower);

  box(flower, 0, 0.23, 0, 0.09, 0.45, 0.09, greenMat);

  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    sphere(
      flower,
      Math.cos(a) * 0.23,
      0.48,
      Math.sin(a) * 0.23,
      0.19,
      mat(color)
    );
  }

  sphere(flower, 0, 0.48, 0, 0.13, yellowMat);
}

for (let i = 0; i < 45; i++) {
  const side = i % 2 === 0 ? -1 : 1;
  const x = side * (3.5 + Math.random() * 4);
  const z = -30 + Math.random() * 43;

  makeFlower(
    x,
    z,
    ["#ff8fbd", "#ffe16b", "#ffffff", "#a98aff"][i % 4]
  );
}

// ===================================
// SMALL RIVER AND BRIDGE
// ===================================

const water = new THREE.Mesh(
  new THREE.BoxGeometry(5, 0.18, 38),
  new THREE.MeshStandardMaterial({
    color: "#48c9f0",
    roughness: 0.25,
    metalness: 0.05
  })
);

water.position.set(15, 0.03, -13);
water.receiveShadow = true;
scene.add(water);

// River banks
box(scene, 12.2, 0.1, -13, 0.35, 0.4, 38, mat("#a4d981"));
box(scene, 17.8, 0.1, -13, 0.35, 0.4, 38, mat("#a4d981"));

// Bridge across river
box(scene, 15, 0.6, -10, 7, 0.35, 2.5, brownMat, true);
box(scene, 15, 1.15, -11, 7, 0.2, 0.2, brickMat, true);
box(scene, 15, 1.15, -9, 7, 0.2, 0.2, brickMat, true);

// ===================================
// DISTANT MOSQUE LANDMARK
// ===================================

function makeMosque(x, z) {
  const mosque = new THREE.Group();
  mosque.position.set(x, 0, z);
  scene.add(mosque);

  box(mosque, 0, 1.5, 0, 5.5, 3, 4.5, whiteMat, true);

  // Green dome
  sphere(mosque, 0, 3.55, 0, 1.7, greenMat, [1, 0.9, 1]);

  // Entrance
  box(mosque, 0, 1, 2.3, 1.15, 2, 0.16, brownMat);

  // Minaret
  box(mosque, 3.4, 2.1, 0, 0.85, 4.2, 0.85, whiteMat, true);
  sphere(mosque, 3.4, 4.55, 0, 0.52, greenMat, [0.8, 1, 0.8]);

  // Crescent-like decorative moon
  const moon = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.06, 8, 16),
    yellowMat
  );
  moon.position.set(3.4, 5.2, 0);
  mosque.add(moon);
}

makeMosque(0, -33);

// ===================================
// PLAYER: CUTE TOY EXPLORER
// ===================================

const player = new THREE.Group();
scene.add(player);
player.position.set(0, 0, 5);

const skinMat = mat("#f5bd91");
const shirtMat = mat("#18a99a");
const pantsMat = mat("#247ca1");
const capMat = mat("#fff5df");

const body = new THREE.Group();
player.add(body);

// Body and legs
box(body, 0, 1.05, 0, 0.95, 1.1, 0.58, shirtMat, true);
box(body, -0.25, 0.35, 0, 0.35, 0.65, 0.4, pantsMat);
box(body, 0.25, 0.35, 0, 0.35, 0.65, 0.4, pantsMat);

// Shoes
box(body, -0.25, 0.08, 0.1, 0.4, 0.18, 0.55, whiteMat);
box(body, 0.25, 0.08, 0.1, 0.4, 0.18, 0.55, whiteMat);

// Head
sphere(body, 0, 1.95, 0, 0.62, skinMat, [0.95, 1.05, 0.9]);

// White cap
sphere(body, 0, 2.43, 0, 0.58, capMat, [1, 0.35, 1]);

// Eyes facing forward (-Z)
sphere(body, -0.22, 2.02, -0.53, 0.085, mat("#302d2b"));
sphere(body, 0.22, 2.02, -0.53, 0.085, mat("#302d2b"));

// Eye highlights
sphere(body, -0.24, 2.05, -0.60, 0.025, whiteMat);
sphere(body, 0.20, 2.05, -0.60, 0.025, whiteMat);

// Smile
const smile = new THREE.Mesh(
  new THREE.TorusGeometry(0.12, 0.035, 6, 12, Math.PI),
  mat("#a64e45")
);
smile.position.set(0, 1.84, -0.56);
smile.rotation.z = Math.PI;
body.add(smile);

// Arms
const leftArm = box(body, -0.62, 1.0, 0, 0.27, 0.8, 0.3, shirtMat);
const rightArm = box(body, 0.62, 1.0, 0, 0.27, 0.8, 0.3, shirtMat);

sphere(body, -0.62, 0.58, 0, 0.16, skinMat);
sphere(body, 0.62, 0.58, 0, 0.16, skinMat);

// ===================================
// MOVEMENT
// ===================================

const keys = {};
let started = false;
let messageTimer;

window.addEventListener("keydown", (event) => {
  keys[event.key.toLowerCase()] = true;

  if (
    ["arrowup", "arrowdown", "arrowleft", "arrowright", " "]
      .includes(event.key.toLowerCase())
  ) {
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});

window.addEventListener("blur", () => {
  for (const key in keys) keys[key] = false;
});

document.querySelector("#startButton").addEventListener("click", () => {
  started = true;
  document.querySelector("#welcome").classList.add("hidden");
  showMessage("Your adventure begins! 🌷");
});

function showMessage(text) {
  const element = document.querySelector("#message");
  element.textContent = text;
  element.classList.add("visible");

  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => {
    element.classList.remove("visible");
  }, 2500);
}

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;

    const messages = {
      explore: "Use WASD or arrow keys to explore the village! 🧭",
      learn: "Learning corner: practise Arabic letters and Qur'an recitation with your teacher. 📖",
      duas: "Dua corner: learn everyday duas with their meanings. 🤲",
      stories: "Story corner: discover Islamic stories with trusted sources. 🌙"
    };

    showMessage(messages[action]);
  });
});

// ===================================
// CAMERA AND ANIMATION
// ===================================

const clock = new THREE.Clock();
const cameraTarget = new THREE.Vector3();
const desiredCamera = new THREE.Vector3();

camera.position.set(0, 9, 15);
camera.lookAt(player.position);

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.04);
  const time = clock.elapsedTime;

  let dx = 0;
  let dz = 0;

  if (started) {
    if (keys["w"] || keys["arrowup"]) dz -= 1;
    if (keys["s"] || keys["arrowdown"]) dz += 1;
    if (keys["a"] || keys["arrowleft"]) dx -= 1;
    if (keys["d"] || keys["arrowright"]) dx += 1;
  }

  const moving = dx !== 0 || dz !== 0;

  if (moving) {
    const length = Math.hypot(dx, dz);
    dx /= length;
    dz /= length;

    const speed = 5 * delta;

    player.position.x += dx * speed;
    player.position.z += dz * speed;

    player.position.x = THREE.MathUtils.clamp(
      player.position.x, -20, 20
    );

    player.position.z = THREE.MathUtils.clamp(
      player.position.z, -42, 18
    );

    player.rotation.y = Math.atan2(-dx, -dz);

    // Tiny bouncy walking animation
    body.position.y = Math.abs(Math.sin(time * 11)) * 0.09;
    leftArm.rotation.x = Math.sin(time * 11) * 0.35;
    rightArm.rotation.x = -Math.sin(time * 11) * 0.35;
  } else {
    body.position.y = Math.sin(time * 2) * 0.035;
    leftArm.rotation.x = 0;
    rightArm.rotation.x = 0;
  }

  // Smooth follow camera
  desiredCamera.set(
    player.position.x,
    player.position.y + 8,
    player.position.z + 13
  );

  camera.position.lerp(desiredCamera, 1 - Math.exp(-3 * delta));

  cameraTarget.set(
    player.position.x,
    player.position.y + 1,
    player.position.z - 3
  );

  camera.lookAt(cameraTarget);

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
});

animate();
```
