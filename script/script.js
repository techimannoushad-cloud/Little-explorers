
import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

// ==================================================
// LITTLE EXPLORERS - ANIMATED 3D VILLAGE
// ==================================================

const game = document.querySelector("#game");

if (!game) {
  throw new Error("Missing #game container in index.html");
}

const scene = new THREE.Scene();
scene.background = new THREE.Color("#8bdcff");
scene.fog = new THREE.Fog("#bfe8cf", 38, 100);

const camera = new THREE.PerspectiveCamera(
  48, window.innerWidth / window.innerHeight, 0.1, 200
);
camera.position.set(0, 10, 21);
camera.lookAt(0, 2, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
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

// LIGHTS
scene.add(new THREE.HemisphereLight("#ffffff", "#75965c", 2));

const sunlight = new THREE.DirectionalLight("#fff3d5", 3);
sunlight.position.set(-10, 18, 12);
sunlight.castShadow = true;
sunlight.shadow.mapSize.set(1024, 1024);
scene.add(sunlight);

// MATERIALS
function material(color, roughness = 0.85) {
  return new THREE.MeshStandardMaterial({ color, roughness });
}

const colors = {
  grass: material("#a9df80"),
  grassDark: material("#64bd52"),
  wood: material("#986039"),
  cream: material("#fff0d2"),
  white: material("#fff9eb"),
  green: material("#36b97b"),
  leaf: material("#4cc66a"),
  teal: material("#19b9ad"),
  yellow: material("#ffc343"),
  pink: material("#ff91bd"),
  blue: material("#40c5ef"),
  brown: material("#8a542e")
};

// SHAPE HELPERS
function box(parent, x, y, z, w, h, d, mat) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d), mat
  );
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function sphere(parent, x, y, z, r, mat) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(r, 20, 16), mat
  );
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(parent, x, y, z, rt, rb, h, mat) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(rt, rb, h, 14), mat
  );
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

// GROUND
box(scene, 0, -0.5, 0, 70, 1, 70, colors.grass);

// DISTANT SOFT HILLS
for (let i = 0; i < 9; i++) {
  const hill = sphere(
    scene, -35 + i * 8, 3, -24,
    6 + (i % 3), material(i % 2 ? "#b6df9d" : "#c8e7a9")
  );
  hill.scale.set(1.8, 0.7, 0.65);
}

// PATH
const pathMat = material("#f8e1ac");

box(scene, 0, 0.03, -1, 5, 0.12, 34, pathMat);

for (let i = 0; i < 23; i++) {
  box(
    scene, 0, 0.105, -17 + i * 1.4,
    1.8, 0.035, 0.75,
    material(i % 2 ? "#e9cc91" : "#fff0c9")
  );
}

// TREES WITH MOVING CROWNS
const movingTrees = [];

function tree(x, z, size = 1) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  scene.add(group);

  cylinder(
    group, 0, 0.8 * size, 0,
    0.22 * size, 0.32 * size,
    1.6 * size, colors.wood
  );

  const crown = new THREE.Group();
  crown.position.y = 2 * size;
  group.add(crown);

  box(
    crown, 0, 0.15 * size, 0,
    1.6 * size, 1.15 * size, 1.5 * size,
    colors.leaf
  );

  sphere(
    crown, 0, 0.65 * size, 0,
    0.48 * size, colors.grassDark
  );
  sphere(
    crown, 0.55 * size, 0.1 * size, 0,
    0.42 * size, colors.leaf
  );
  sphere(
    crown, -0.55 * size, 0.1 * size, 0,
    0.42 * size, colors.grassDark
  );

  movingTrees.push({ crown, offset: Math.random() * 5 });
}

for (let i = 0; i < 24; i++) {
  const side = i % 2 ? 1 : -1;
  tree(
    side * (5.5 + Math.random() * 10),
    -15 + Math.random() * 28,
    0.75 + Math.random() * 0.55
  );
}

// HOUSES
function house(x, z, roofColor) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  scene.add(group);

  box(group, 0, 1.2, 0, 3, 2.4, 2.7, colors.cream);

  const roof = material(roofColor);
  box(group, 0, 2.5, 0, 3.5, 0.25, 3.1, roof);

  // Decorative roof studs
  for (let sx = -1.2; sx <= 1.2; sx += 0.6) {
    for (let sz = -0.9; sz <= 0.9; sz += 0.6) {
      cylinder(
        group, sx, 2.68, sz,
        0.1, 0.1, 0.12, roof
      );
    }
  }

  box(group, 0, 0.75, -1.38, 0.75, 1.5, 0.12, colors.wood);

  for (const wx of [-1, 1]) {
    box(
      group, wx, 1.65, -1.4,
      0.5, 0.55, 0.08, colors.blue
    );
  }

  box(group, -0.25, 1.65, -1.45, 0.045, 0.6, 0.05, colors.white);
  box(group, 1, 1.65, -1.45, 0.5, 0.045, 0.05, colors.white);
}

house(-8, -1, "#ff8173");
house(8, -4, "#ffcb4e");
house(-7, 5, "#55c5ef");
house(10, 5, "#c6a0fa");

// MOSQUE
function mosque() {
  const group = new THREE.Group();
  group.position.set(0, 0, -14);
  scene.add(group);

  box(group, 0, 1.5, 0, 5, 3, 3.6, colors.cream);

  // Dome
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(
      1.55, 28, 20, 0, Math.PI * 2, 0, Math.PI / 2
    ),
    colors.green
  );
  dome.position.set(0, 3, 0);
  group.add(dome);

  // Minaret
  cylinder(group, 3.1, 2.4, 0, 0.32, 0.4, 4.8, colors.cream);
  cylinder(group, 3.1, 4.85, 0, 0.5, 0.5, 0.2, colors.green);
  sphere(group, 3.1, 4.98, 0, 0.17, colors.yellow);
  box(group, 0, 0.85, -1.85, 0.9, 1.7, 0.12, colors.wood);
}

mosque();

// RIVER
const waterMat = new THREE.MeshStandardMaterial({
  color: "#42c9f4",
  roughness: 0.25,
  metalness: 0.08
});

box(scene, 12, 0.02, 1, 4.2, 0.12, 24, colors.green);
const water = box(scene, 12, 0.12, 1, 3.7, 0.08, 23, waterMat);

// BRIDGE
box(scene, 12, 0.48, 1, 5, 0.3, 2.4, colors.wood);

for (const side of [-1, 1]) {
  box(scene, 12 + side * 2.35, 0.9, 1, 0.18, 0.8, 2.7, colors.wood);

  for (let i = 0; i < 5; i++) {
    box(
      scene, 12 + side * 2.35,
      0.75, -0.1 + i * 0.55,
      0.28, 1, 0.25, colors.wood
    );
  }
}

// FLOWERS
const flowers = [];

function flower(x, z, color) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  scene.add(group);

  cylinder(group, 0, 0.22, 0, 0.045, 0.06, 0.42, colors.grassDark);

  sphere(group, 0, 0.45, 0, 0.15, material(color));
  sphere(group, 0.13, 0.4, 0, 0.12, material(color));
  sphere(group, -0.13, 0.4, 0, 0.12, material(color));
  sphere(group, 0, 0.4, 0.13, 0.12, material(color));
  sphere(group, 0, 0.4, -0.13, 0.12, material(color));

  flowers.push({ group, offset: Math.random() * 6 });
}

const flowerColors = ["#ff83bd", "#fff4da", "#ffd34e", "#c5a0ff"];

for (let i = 0; i < 65; i++) {
  const x = (Math.random() - 0.5) * 30;
  const z = (Math.random() - 0.5) * 30;

  if (Math.abs(x) < 3 && z > -10 && z < 8) continue;
  if (x > 8 && x < 16 && Math.abs(z) < 12) continue;

  flower(x, z, flowerColors[i % flowerColors.length]);
}

// CHARACTERS
function character(x, z, outfit, isGirl = false) {
  const root = new THREE.Group();
  root.position.set(x, 0, z);
  scene.add(root);

  const skin = material("#ffd1a6");
  const clothes = material(outfit);

  // Backpack
  box(root, 0, 1.35, -0.48, 0.65, 0.72, 0.25, colors.pink);

  // Legs with movable pivots
  function makeLeg(xPos) {
    const pivot = new THREE.Group();
    pivot.position.set(xPos, 0.65, 0);
    root.add(pivot);

    box(pivot, 0, -0.22, 0, 0.3, 0.65, 0.34, clothes);
    box(pivot, 0, -0.53, 0.1, 0.38, 0.2, 0.48, colors.white);
    return pivot;
  }

  const leftLeg = makeLeg(-0.25);
  const rightLeg = makeLeg(0.25);

  // Body
  box(root, 0, 1.25, 0, 0.9, 1, 0.55, clothes);

  // Arms with pivots
  function makeArm(xPos) {
    const pivot = new THREE.Group();
    pivot.position.set(xPos, 1.65, 0);
    root.add(pivot);

    box(pivot, 0, -0.3, 0, 0.27, 0.75, 0.3, clothes);
    sphere(pivot, 0, -0.7, 0, 0.14, skin);
    return pivot;
  }

  const leftArm = makeArm(-0.57);
  const rightArm = makeArm(0.57);

  // Head
  sphere(root, 0, 2.2, 0, 0.61, skin);

  if (isGirl) {
    // Hijab hood and side drape
    sphere(
      root, 0, 2.38, -0.08,
      0.68, material("#fff0d8")
    );
    sphere(root, 0, 2.13, 0.34, 0.49, skin);
    sphere(
      root, 0, 2.0, 0.05,
      0.57, material("#fff0d8")
    );
    // Keep the face visible
    sphere(root, 0, 2.18, 0.45, 0.42, skin);
  } else {
    // White kufi
    sphere(root, 0, 2.62, 0, 0.57, colors.white);
    cylinder(
      root, 0, 2.67, 0,
      0.47, 0.47, 0.12, colors.white
    );
  }

  // Eyes, highlights, cheeks and smile
  for (const eyeX of [-0.2, 0.2]) {
    sphere(root, eyeX, 2.23, 0.52, 0.09, material("#35251f"));
    sphere(root, eyeX + 0.025, 2.265, 0.59, 0.025, colors.white);
  }

  sphere(root, -0.34, 2.08, 0.42, 0.08, material("#ff9a9d"));
  sphere(root, 0.34, 2.08, 0.42, 0.08, material("#ff9a9d"));

  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.12, 0.035, 8, 16, Math.PI),
    material("#b94c4c")
  );
  smile.position.set(0, 2.03, 0.55);
  smile.rotation.z = Math.PI;
  root.add(smile);

  return {
    root,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    baseY: 0,
    isGirl
  };
}

const zayn = character(-1.1, 2, "#19b9ad", false);
const aisha = character(1.1, 1, "#ffbd39", true);

// MOVEMENT
const keys = {};
let walking = false;
let activeCharacter = zayn;

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if ([
    "arrowup", "arrowdown", "arrowleft", "arrowright", " "
  ].includes(key)) {
    event.preventDefault();
  }

  keys[key] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});

window.addEventListener("blur", () => {
  for (const key in keys) keys[key] = false;
});

function moveCharacter() {
  const speed = 0.09;
  let dx = 0;
  let dz = 0;

  if (keys["w"] || keys["arrowup"]) dz -= speed;
  if (keys["s"] || keys["arrowdown"]) dz += speed;
  if (keys["a"] || keys["arrowleft"]) dx -= speed;
  if (keys["d"] || keys["arrowright"]) dx += speed;

  walking = dx !== 0 || dz !== 0;

  if (walking) {
    activeCharacter.root.position.x += dx;
    activeCharacter.root.position.z += dz;

    activeCharacter.root.position.x = THREE.MathUtils.clamp(
      activeCharacter.root.position.x, -25, 25
    );
    activeCharacter.root.position.z = THREE.MathUtils.clamp(
      activeCharacter.root.position.z, -25, 25
    );

    // Turn towards the direction of travel
    activeCharacter.root.rotation.y = Math.atan2(dx, dz);
  }

  // Aisha follows Zayn when Zayn is selected
  if (activeCharacter === zayn) {
    const targetX = zayn.root.position.x + 1.5;
    const targetZ = zayn.root.position.z + 1.2;

    aisha.root.position.x +=
      (targetX - aisha.root.position.x) * 0.025;
    aisha.root.position.z +=
      (targetZ - aisha.root.position.z) * 0.025;
  }
}

// WELCOME BUTTON
const welcome = document.querySelector("#welcome");
const startButton = document.querySelector("#startButton");

if (startButton && welcome) {
  startButton.addEventListener("click", () => {
    welcome.style.display = "none";
  });
}

// MENU BUTTONS
const message = document.querySelector("#message");

const menuMessages = {
  explore: "🧭 Explore the village with Zayn and Aisha!",
  learn: "📖 Learning corner: discover good manners and Islamic knowledge!",
  duas: "🤲 Dua corner: remember Allah in your daily life!",
  stories: "📚 Story corner: choose a story to learn from!"
};

document.querySelectorAll(".bottom-menu button").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;

    if (message) {
      message.textContent = menuMessages[action] || "Happy exploring!";
    }

    if (action === "explore") {
      activeCharacter = zayn;
    }
  });
});

// ANIMATION LOOP
const clock = new THREE.Clock();
const cameraTarget = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  moveCharacter();

  // Walking animations
  for (const characterData of [zayn, aisha]) {
    const phase = t * 9;

    if (walking && characterData === activeCharacter) {
      characterData.leftLeg.rotation.x = Math.sin(phase) * 0.55;
      characterData.rightLeg.rotation.x = -Math.sin(phase) * 0.55;

      characterData.leftArm.rotation.x = -Math.sin(phase) * 0.4;
      characterData.rightArm.rotation.x = Math.sin(phase) * 0.4;

      characterData.root.position.y =
        Math.abs(Math.sin(phase)) * 0.07;
    } else {
      characterData.leftLeg.rotation.x = THREE.MathUtils.damp(
        characterData.leftLeg.rotation.x, 0, 8, clock.getDelta()
      );
      characterData.rightLeg.rotation.x = THREE.MathUtils.damp(
        characterData.rightLeg.rotation.x, 0, 8, clock.getDelta()
      );

      characterData.leftArm.rotation.x =
        Math.sin(t * 1.5) * 0.04;
      characterData.rightArm.rotation.x =
        Math.sin(t * 1.5 + 1) * 0.04;

      characterData.root.position.y =
        Math.sin(t * 2 + (characterData.isGirl ? 1 : 0)) * 0.035;
    }
  }

  // Swaying trees
  for (const item of movingTrees) {
    item.crown.rotation.z =
      Math.sin(t * 0.8 + item.offset) * 0.025;
  }

  // Swaying flowers
  for (const item of flowers) {
    item.group.rotation.z =
      Math.sin(t * 1.7 + item.offset) * 0.08;
  }

  // Shimmering water
  water.material.color.setHSL(
    0.53, 0.75, 0.57 + Math.sin(t * 1.8) * 0.035
  );
  water.position.y = 0.12 + Math.sin(t * 2) * 0.025;

  // Camera smoothly follows the selected explorer
  const player = activeCharacter.root.position;

  cameraTarget.set(player.x, 2, player.z);
  camera.position.x +=
    (player.x - camera.position.x) * 0.035;
  camera.position.y +=
    (10 - camera.position.y) * 0.025;
  camera.position.z +=
    (player.z + 20 - camera.position.z) * 0.035;

  camera.lookAt(cameraTarget);

  renderer.render(scene, camera);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize);
animate();
