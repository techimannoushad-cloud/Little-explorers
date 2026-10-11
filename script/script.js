
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

// ==========================================
// LITTLE EXPLORERS - 3D ADVENTURE GAME
// ==========================================

const game = document.querySelector("#game");

if (!game) {
  throw new Error("Missing #game container in index.html");
}

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color("#91dcff");
scene.fog = new THREE.Fog("#c5e8d0", 45, 115);

const camera = new THREE.PerspectiveCamera(
  55,
  game.clientWidth / game.clientHeight,
  0.1,
  200
);

camera.position.set(0, 10, 19);
camera.lookAt(0, 2, 0);

// RENDERER
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false
});

renderer.setSize(game.clientWidth, game.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

renderer.domElement.style.position = "absolute";
renderer.domElement.style.inset = "0";
renderer.domElement.style.width = "100%";
renderer.domElement.style.height = "100%";
renderer.domElement.style.zIndex = "0";

game.prepend(renderer.domElement);

// LIGHTING
scene.add(new THREE.HemisphereLight("#effaff", "#72965b", 2.2));

const sun = new THREE.DirectionalLight("#fff2cf", 3);
sun.position.set(-12, 22, 12);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -30;
sun.shadow.camera.right = 30;
sun.shadow.camera.top = 30;
sun.shadow.camera.bottom = -30;
scene.add(sun);

// MATERIALS
function mat(color, roughness = 0.85) {
  return new THREE.MeshStandardMaterial({ color, roughness });
}

const grass = mat("#bde79b");
const darkGreen = mat("#27964b");
const leafGreen = mat("#45b95b");
const lightGreen = mat("#91dc70");
const wood = mat("#986035");
const cream = mat("#fff0d6");
const white = mat("#fffaf0");
const blue = mat("#56c9f0");
const yellow = mat("#ffc54d");
const pink = mat("#ff94c6");
const teal = mat("#20b9ad");

// BASIC SHAPES
function block(
  x, y, z, w, h, d, material, parent = scene
) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    material
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function ball(
  x, y, z, radius, material, parent = scene
) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 20, 16),
    material
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(
  x, y, z, top, bottom, height, material, parent = scene
) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(top, bottom, height, 16),
    material
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

// LAND
block(0, -0.5, 0, 80, 1, 80, grass);

// DISTANT HILLS
for (let i = 0; i < 9; i++) {
  const hill = ball(
    -32 + i * 8,
    0.3,
    -30 - Math.random() * 4,
    5 + Math.random() * 3,
    mat(i % 2 ? "#a4d88c" : "#8dd4a0")
  );

  hill.scale.set(1.7, 0.65, 1);
}

// TREES
function tree(x, z, size = 1) {
  cylinder(
    x, 0.8 * size, z,
    0.2 * size, 0.32 * size,
    1.6 * size, wood
  );

  ball(
    x, 2.0 * size, z,
    0.9 * size, darkGreen
  );

  ball(
    x - 0.42 * size, 2.35 * size, z + 0.05,
    0.53 * size, lightGreen
  );

  ball(
    x + 0.42 * size, 2.4 * size, z - 0.12,
    0.55 * size, leafGreen
  );

  ball(
    x, 2.65 * size, z,
    0.52 * size, leafGreen
  );
}

for (let i = 0; i < 24; i++) {
  const side = i % 2 === 0 ? -1 : 1;
  const x = side * (6.5 + Math.random() * 11);
  const z = -18 + Math.random() * 35;

  // Keep the middle of the walking path clear.
  if (Math.abs(x) < 7 && z > -15 && z < 12) continue;

  tree(x, z, 0.75 + Math.random() * 0.6);
}

// COLOURFUL TOY HOUSES
function house(x, z, roofColor) {
  const roofMat = mat(roofColor);

  block(x, 1.15, z, 3.1, 2.3, 2.8, cream);
  block(x, 0.72, z + 1.43, 0.72, 1.45, 0.12, wood);

  // Flat colourful roof
  block(x, 2.43, z, 3.6, 0.28, 3.2, roofMat);

  // Roof studs
  for (let i = -2; i <= 2; i++) {
    for (let j = -1; j <= 1; j++) {
      block(
        x + i * 0.55,
        2.62,
        z + j * 0.65,
        0.35, 0.12, 0.35,
        roofMat
      );
    }
  }

  // Windows on the front
  for (const wx of [-0.95, 0.95]) {
    block(
      x + wx, 1.6, z + 1.43,
      0.58, 0.65, 0.1, blue
    );

    block(
      x + wx, 1.6, z + 1.49,
      0.07, 0.72, 0.04, white
    );
  }

  block(x - 1.65, 0.13, z, 0.16, 0.18, 3.4, leafGreen);
}

house(-10, -4, "#ff8278");
house(10, -5, "#ffc447");
house(-10, 5, "#69c5ff");
house(17, 4, "#c49bff");
house(-17, -13, "#ffad80");
house(17, -16, "#6dc9d6");

// MOSQUE
function mosque() {
  const x = 0;
  const z = -23;

  block(x, 1.35, z, 6, 2.7, 4.5, cream);

  // Green dome
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(
      1.7, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2
    ),
    mat("#26b981")
  );

  dome.position.set(x, 2.7, z);
  dome.castShadow = true;
  scene.add(dome);

  // Door
  block(x, 0.9, z + 2.3, 1.05, 1.8, 0.15, wood);

  // Windows
  for (const wx of [-1.9, 1.9]) {
    block(wx, 1.65, z + 2.3, 0.55, 0.75, 0.12, blue);
  }

  // Minaret
  cylinder(3.8, 2.5, z, 0.28, 0.42, 4.7, cream);
  cylinder(3.8, 4.9, z, 0.52, 0.52, 0.25, mat("#24b980"));
  cylinder(3.8, 5.6, z, 0.18, 0.28, 1.2, cream);
  ball(3.8, 6.3, z, 0.22, yellow);
}

mosque();

// WALKING PATH
const pathMat = mat("#f6dfad");
const tileMat = mat("#ecd09b");

block(0, 0.02, -5, 4.5, 0.12, 42, pathMat);

for (let i = 0; i < 24; i++) {
  block(
    0, 0.1, 14 - i * 1.65,
    1.65, 0.05, 1.05,
    tileMat
  );
}

// RIVER
const waterMat = new THREE.MeshStandardMaterial({
  color: "#3ebdf5",
  roughness: 0.25,
  metalness: 0.05
});

block(13, 0.02, 2, 5, 0.1, 30, waterMat);

// RIVER BANKS
for (const side of [-1, 1]) {
  block(
    13 + side * 2.8,
    0.13, 2,
    0.35, 0.18, 30,
    mat("#76c969")
  );
}

// BRIDGE ACROSS THE RIVER
block(13, 0.38, 1, 7, 0.38, 2.7, wood);

for (const side of [-1, 1]) {
  block(13, 0.9, 1 + side * 1.2, 7, 0.85, 0.18, wood);

  for (let i = 0; i < 6; i++) {
    block(
      10 + i * 1.2,
      0.85,
      1 + side * 1.2,
      0.18, 1.0, 0.24,
      mat("#c17a42")
    );
  }
}

// FLOWERS
const flowerColours = [
  "#ff83bd",
  "#fff2df",
  "#ffd24c",
  "#c5a0ff",
  "#ff9a8b"
];

for (let i = 0; i < 75; i++) {
  const x = (Math.random() - 0.5) * 38;
  const z = (Math.random() - 0.5) * 38;

  if (Math.abs(x) < 4 && z > -25 && z < 17) continue;
  if (Math.abs(x - 13) < 3.5) continue;

  cylinder(x, 0.22, z, 0.035, 0.05, 0.4, leafGreen);

  const flower = new THREE.Group();
  flower.position.set(x, 0.48, z);
  scene.add(flower);

  const petalMat = mat(flowerColours[i % flowerColours.length]);

  for (let p = 0; p < 5; p++) {
    const angle = (p / 5) * Math.PI * 2;

    ball(
      Math.cos(angle) * 0.17,
      0,
      Math.sin(angle) * 0.17,
      0.13,
      petalMat,
      flower
    );
  }

  ball(0, 0.04, 0, 0.09, yellow, flower);
}

// CUTE EXPLORERS
function character(x, z, outfitColor, isGirl = false) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  scene.add(group);

  const skin = mat("#ffd0a5");
  const outfit = mat(outfitColor);
  const dark = mat("#38251f");

  // Backpack behind the character
  block(0, 1.35, -0.45, 0.68, 0.8, 0.3,
    mat(isGirl ? "#ff75b4" : "#a96a39"), group);

  // Legs
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.24, 0.55, 0);
  group.add(leftLeg);

  block(0, -0.13, 0, 0.28, 0.65, 0.35, outfit, leftLeg);
  block(0, -0.42, 0.1, 0.4, 0.22, 0.5, white, leftLeg);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.24, 0.55, 0);
  group.add(rightLeg);

  block(0, -0.13, 0, 0.28, 0.65, 0.35, outfit, rightLeg);
  block(0, -0.42, 0.1, 0.4, 0.22, 0.5, white, rightLeg);

  // Body
  block(0, 1.35, 0, 0.9, 0.95, 0.6, outfit, group);

  // Arms
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.52, 1.68, 0);
  group.add(leftArm);

  block(-0.05, -0.28, 0, 0.25, 0.62, 0.3, outfit, leftArm);
  ball(-0.05, -0.61, 0.02, 0.16, skin, leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.52, 1.68, 0);
  group.add(rightArm);

  block(0.05, -0.28, 0, 0.25, 0.62, 0.3, outfit, rightArm);
  ball(0.05, -0.61, 0.02, 0.16, skin, rightArm);

  // Head
  ball(0, 2.4, 0, 0.69, skin, group);

  // Headwear
  if (isGirl) {
    ball(0, 2.58, -0.03, 0.75, mat("#fff0d5"), group);
    ball(0, 2.2, 0.39, 0.53, mat("#fff0d5"), group);
  } else {
    ball(0, 2.85, 0, 0.67, white, group);
    cylinder(0, 2.72, 0, 0.67, 0.67, 0.12, white, group);
  }

  // Eyes
  for (const ex of [-0.24, 0.24]) {
    ball(ex, 2.43, 0.59, 0.12, white, group);
    ball(ex, 2.43, 0.68, 0.075, dark, group);
    ball(ex + 0.025, 2.47, 0.73, 0.027, white, group);
  }

  // Smile and cheeks
  ball(0, 2.15, 0.65, 0.12, mat("#d95c55"), group);
  ball(-0.42, 2.22, 0.49, 0.11, pink, group);
  ball(0.42, 2.22, 0.49, 0.11, pink, group);

  return {
    group,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg
  };
}

const zayn = character(-1.5, 4, "#20b9ad", false);
const aisha = character(1.6, 2.8, "#ffc43d", true);

// KEYBOARD CONTROLS
const keys = Object.create(null);

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (
    ["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)
  ) {
    event.preventDefault();
  }

  keys[key] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});

window.addEventListener("blur", () => {
  for (const key in keys) {
    keys[key] = false;
  }
});

// MOVEMENT AND WALKING ANIMATION
let walkingTime = 0;

function moveCharacter(delta) {
  const speed = 6 * delta;
  let moving = false;

  if (keys["w"] || keys["arrowup"]) {
    zayn.group.position.z -= speed;
    moving = true;
  }

  if (keys["s"] || keys["arrowdown"]) {
    zayn.group.position.z += speed;
    moving = true;
  }

  if (keys["a"] || keys["arrowleft"]) {
    zayn.group.position.x -= speed;
    moving = true;
  }

  if (keys["d"] || keys["arrowright"]) {
    zayn.group.position.x += speed;
    moving = true;
  }

  // Keep Zayn within the village
  zayn.group.position.x = THREE.MathUtils.clamp(
    zayn.group.position.x, -24, 24
  );

  zayn.group.position.z = THREE.MathUtils.clamp(
    zayn.group.position.z, -30, 23
  );

  if (moving) {
    walkingTime += delta * 10;

    zayn.leftLeg.rotation.x = Math.sin(walkingTime) * 0.55;
    zayn.rightLeg.rotation.x = -Math.sin(walkingTime) * 0.55;

    zayn.leftArm.rotation.x = -Math.sin(walkingTime) * 0.4;
    zayn.rightArm.rotation.x = Math.sin(walkingTime) * 0.4;
  } else {
    zayn.leftLeg.rotation.x = THREE.MathUtils.damp(
      zayn.leftLeg.rotation.x, 0, 8, delta
    );

    zayn.rightLeg.rotation.x = THREE.MathUtils.damp(
      zayn.rightLeg.rotation.x, 0, 8, delta
    );

    zayn.leftArm.rotation.x = THREE.MathUtils.damp(
      zayn.leftArm.rotation.x, 0, 8, delta
    );

    zayn.rightArm.rotation.x = THREE.MathUtils.damp(
      zayn.rightArm.rotation.x, 0, 8, delta
    );
  }
}

// CAMERA FOLLOW
const cameraOffset = new THREE.Vector3(0, 9, 15);
const cameraTarget = new THREE.Vector3();
const lookTarget = new THREE.Vector3();

// RESIZE
function resize() {
  const width = game.clientWidth;
  const height = game.clientHeight;

  if (!width || !height) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener("resize", resize);

// MAIN ANIMATION LOOP
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  // Move Zayn using the keyboard
  moveCharacter(delta);

  // Gentle idle animation for both characters
  aisha.group.position.y = Math.sin(t * 2) * 0.06;
  zayn.group.position.y = Math.abs(Math.sin(walkingTime)) *
    (keys["w"] || keys["a"] || keys["s"] || keys["d"] ||
     keys["arrowup"] || keys["arrowdown"] ||
     keys["arrowleft"] || keys["arrowright"] ? 0.07 : 0.025);

  aisha.group.rotation.y = Math.sin(t * 0.7) * 0.06;

  // Smoothly follow Zayn
  cameraTarget.set(
    zayn.group.position.x + cameraOffset.x,
    zayn.group.position.y + cameraOffset.y,
    zayn.group.position.z + cameraOffset.z
  );

  camera.position.lerp(cameraTarget, 1 - Math.exp(-3 * delta));

  lookTarget.set(
    zayn.group.position.x,
    zayn.group.position.y + 1.3,
    zayn.group.position.z - 1.5
  );

  camera.lookAt(lookTarget);

  renderer.render(scene, camera);
}

// START GAME
resize();
animate();
