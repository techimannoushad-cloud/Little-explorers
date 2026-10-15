import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

// Little Explorers — Pastel Cartoon Edition
const game = document.querySelector("#game");
if (!game) throw new Error('Missing #game container in index.html');

game.style.position ||= "relative";
game.style.overflow = "hidden";

document.querySelectorAll(".topbar,#welcome,.hint,.bottom-menu,#message").forEach(el => {
  el.style.position = "relative";
  el.style.zIndex = "2";
});

const welcome = document.querySelector("#welcome");
const startButton = document.querySelector("#startButton");
const message = document.querySelector("#message");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#b8d8e4");
scene.fog = new THREE.Fog("#e8e5d8", 48, 125);

const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 220);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.7));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

Object.assign(renderer.domElement.style, {
  position: "absolute",
  inset: "0",
  width: "100%",
  height: "100%",
  display: "block",
  zIndex: "0"
});

renderer.domElement.setAttribute("aria-label", "Little Explorers 3D village");
game.prepend(renderer.domElement);

// SOFT LIGHTING
scene.add(new THREE.HemisphereLight("#fff7ef", "#8d9f7c", 1.75));

const sun = new THREE.DirectionalLight("#ffe8cf", 2.25);
sun.position.set(-12, 24, 14);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -35;
sun.shadow.camera.right = 35;
sun.shadow.camera.top = 35;
sun.shadow.camera.bottom = -35;
scene.add(sun);

// PASTEL MATERIALS
const mat = (c, roughness = 0.82, extra = {}) =>
  new THREE.MeshStandardMaterial({ color: c, roughness, ...extra });

const M = {
  grass: mat("#b8cba5"),
  grass2: mat("#cbd8b8"),
  green: mat("#8fb89a"),
  green2: mat("#b4cda0"),
  green3: mat("#688d73"),
  wood: mat("#9c7867"),
  wood2: mat("#b9957b"),
  cream: mat("#f5e9d8"),
  wall: mat("#f8eee5"),
  blue: mat("#a6cbd4"),
  teal: mat("#79b8ad"),
  yellow: mat("#e8c58d"),
  pink: mat("#dca6b0"),
  white: mat("#fffaf2"),
  dark: mat("#4b3433"),
  blush: mat("#e7a2a2"),
  water: mat("#9bcbd4", 0.32, { metalness: 0.02 }),
  path: mat("#e7d6b7"),
  path2: mat("#f1e3ca"),
  gold: mat("#dfbd79")
};

// SHAPE HELPERS
function mesh(geometry, material, x, y, z, parent = scene) {
  const o = new THREE.Mesh(geometry, material);
  o.position.set(x, y, z);
  o.castShadow = true;
  o.receiveShadow = true;
  parent.add(o);
  return o;
}

function box(x, y, z, w, h, d, m, parent = scene) {
  return mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, parent);
}

function ball(x, y, z, r, m, parent = scene, segments = 18) {
  return mesh(
    new THREE.SphereGeometry(r, segments, 14),
    m, x, y, z, parent
  );
}

function cyl(x, y, z, rt, rb, h, m, parent = scene, n = 14) {
  return mesh(
    new THREE.CylinderGeometry(rt, rb, h, n),
    m, x, y, z, parent
  );
}

function stud(x, y, z, r, m, parent = scene) {
  return cyl(x, y, z, r, r, 0.12, m, parent, 12);
}

// VILLAGE GROUND
box(0, -0.55, 0, 100, 1, 100, M.grass);
box(0, -0.025, 0, 98, 0.08, 98, M.grass2);

// Soft rolling hills in the distance
for (let i = 0; i < 11; i++) {
  const h = ball(
    -45 + i * 9,
    4 + (i % 3) * 0.5,
    -35,
    7.2,
    mat(i % 2 ? "#c9d8b8" : "#bdcfb0")
  );

  h.scale.set(1.45, 0.75, 0.55);
  h.castShadow = false;
}

// Subtle grass details
for (let x = -27; x <= 27; x += 1.8) {
  for (let z = -25; z <= 24; z += 1.8) {
    if (Math.abs(x) < 3.5 || Math.random() > 0.38) continue;

    stud(
      x + (Math.random() - 0.5) * 0.15,
      0.055,
      z,
      0.15,
      Math.random() > 0.5 ? M.green : M.green3
    );
  }
}

// MAIN PATH
box(0, 0.015, 1.5, 5.4, 0.12, 49, M.path);

for (let i = 0; i < 26; i++) {
  box(
    Math.sin(i * 0.24) * 0.12,
    0.095,
    -21 + i * 1.8,
    1.75,
    0.07,
    1.12,
    i % 2 ? M.path2 : M.cream
  );
}

// SOFT CARTOON TREES
function tree(x, z, s = 1) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.scale.setScalar(s);
  scene.add(g);

  cyl(0, 0.88, 0, 0.27, 0.38, 1.75, M.wood, g, 12);

  ball(0, 2.35, 0, 0.83, M.green, g, 22);
  ball(-0.43, 2.48, 0.08, 0.58, M.green2, g, 20);
  ball(0.43, 2.53, -0.08, 0.61, M.green, g, 20);
  ball(0, 2.9, -0.08, 0.42, M.green2, g, 18);
}

[
  [-10, -12, 1.25], [-7.5, -7, 0.9], [-11, 0, 1.05],
  [-8, 8, 1.2], [-13, 16, 1.25], [-17, 5, 1.1],
  [-19, -8, 1.45], [-22, 13, 1.2], [8, -13, 1],
  [10, -6, 1.15], [12, 3, 1.15], [10, 13, 1.2],
  [16, -11, 1.35], [18, 1, 1.05], [21, 12, 1.35],
  [25, -3, 1.2], [-3, -19, 0.9], [5, -22, 0.9]
].forEach(a => tree(...a));

// PASTEL HOUSES
function house(x, z, color, s = 1) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.scale.setScalar(s);
  scene.add(g);

  box(0, 1.15, 0, 3.15, 2.3, 2.75, M.wall, g);
  box(0, 0.12, 0, 3.35, 0.24, 2.95, M.cream, g);

  const roof = mat(color);
  box(0, 2.38, 0, 3.55, 0.24, 3.05, roof, g);

  // Door and windows
  box(0, 0.78, -1.405, 0.72, 1.38, 0.12, M.wood, g);
  box(0.19, 0.8, -1.48, 0.055, 0.08, 0.025, M.gold, g);

  for (const wx of [-1.02, 1.02]) {
    box(wx, 1.52, -1.42, 0.58, 0.66, 0.1, M.blue, g);
    box(wx, 1.52, -1.49, 0.075, 0.75, 0.06, M.white, g);
    box(wx, 1.52, -1.49, 0.65, 0.075, 0.06, M.white, g);
  }
}

house(-8, -4, "#d99e99", 1.05);
house(8.5, -4.5, "#dfc28c");
house(-11, 7, "#a6cbd4", 1.15);
house(13, 7, "#c5b4cf", 1.05);
house(-5.5, -15, "#b6c9a8", 0.8);
house(7, -17, "#d7ad9b", 0.8);

// MOSQUE
function mosque() {
  const g = new THREE.Group();
  g.position.set(0, 0, -24);
  scene.add(g);

  box(0, 1.55, 0, 5.8, 3, 4.1, M.wall, g);
  box(0, 0.13, 0, 6, 0.25, 4.3, M.cream, g);

  mesh(
    new THREE.SphereGeometry(1.55, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2),
    mat("#8fbba3"),
    0, 3.05, 0, g
  );

  cyl(0, 3, 0, 1.56, 1.56, 0.12, M.green3, g, 24);
  box(0, 1, -2.08, 1, 1.8, 0.12, M.wood, g);
  ball(0, 1.85, -2.08, 0.5, M.wood, g).scale.set(1, 0.65, 0.16);

  box(-1.95, 1.75, -2.1, 0.5, 0.7, 0.12, M.blue, g);
  box(1.95, 1.75, -2.1, 0.5, 0.7, 0.12, M.blue, g);

  for (let i = 0; i < 4; i++) {
    box(0, 0.12 + i * 0.13, -2.45 - i * 0.45,
      2.4 - i * 0.25, 0.16, 0.48, M.path2, g);
  }

  cyl(3.7, 2, 0, 0.34, 0.46, 4, M.cream, g);
  cyl(3.7, 4.08, 0, 0.53, 0.53, 0.22, M.green3, g);
  cyl(3.7, 4.82, 0, 0.18, 0.28, 1.35, M.cream, g);
  ball(3.7, 5.55, 0, 0.18, M.gold, g);
}

mosque();

// RIVER AND BRIDGE
box(16, -0.06, 1, 4.2, 0.12, 33, M.green3);
box(16, 0.015, 1, 3.8, 0.09, 32, M.water);

const water = new THREE.Mesh(
  new THREE.PlaneGeometry(3.7, 31, 24, 36),
  new THREE.MeshStandardMaterial({
    color: "#9bcbd4",
    roughness: 0.2,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.92
  })
);

water.rotation.x = -Math.PI / 2;
water.position.set(16, 0.08, 1);
scene.add(water);

box(16, 0.42, 0, 5, 0.3, 2.2, M.wood2);

for (const side of [-1, 1]) {
  box(16 + side * 2.25, 0.88, 0, 0.18, 0.95, 2.35, M.wood);

  for (let i = 0; i < 5; i++) {
    box(
      16 + side * 2.25,
      0.92,
      -0.88 + i * 0.44,
      0.28, 1.05, 0.24,
      M.wood2
    );
  }

  box(16 + side * 2.25, 1.34, 0, 0.24, 0.18, 2.4, M.wood2);
}

// FLOWERS THAT SWAY GENTLY
const flowerColors = ["#dcaab5", "#f4e8d5", "#e5cb91", "#c5b7d4", "#d9b1a0"];
const flowers = [];

function flower(x, z, color) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  scene.add(g);

  cyl(0, 0.23, 0, 0.045, 0.06, 0.43, M.green3, g, 8);

  for (let i = 0; i < 5; i++) {
    const a = i / 5 * Math.PI * 2;
    ball(Math.cos(a) * 0.15, 0.48, Math.sin(a) * 0.15,
      0.13, mat(color), g, 12);
  }

  ball(0, 0.49, 0, 0.105, M.gold, g, 12);
  g.userData.phase = Math.random() * 6;
  flowers.push(g);
}

for (let i = 0; i < 72; i++) {
  let x = (Math.random() - 0.5) * 45;
  const z = (Math.random() - 0.5) * 48;

  if (Math.abs(x) < 3.5) x += x < 0 ? -3.7 : 3.7;
  if (Math.abs(x - 16) < 3) x += x < 16 ? -3.2 : 3.2;

  flower(x, z, flowerColors[i % flowerColors.length]);
}

// END OF PART 1 — CONTINUE WITH PART 2 BELOW

// CUTE CARTOON CHARACTERS: AISHA AND ZAYN
function character({ name, x, z, outfitColor, isGirl = false, bagColor }) {
  const root = new THREE.Group();
  root.position.set(x, 0, z);
  scene.add(root);

  const rig = new THREE.Group();
  root.add(rig);

  const skin = mat("#f2c7a9");
  const outfit = mat(outfitColor);
  const bag = mat(bagColor);
  const shoe = mat("#f8eee4");
  const dark = mat("#493536");
  const shine = mat("#ffffff");
  const cheek = mat("#e8a3a2");

  // Backpack
  box(0, 1.32, -0.43, 0.72, 0.82, 0.3, bag, rig);
  box(-0.42, 1.55, -0.24, 0.13, 0.62, 0.15, M.wood2, rig);
  box(0.42, 1.55, -0.24, 0.13, 0.62, 0.15, M.wood2, rig);

  // Animated legs
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.23, 0.77, 0);
  rig.add(leftLeg);

  box(0, -0.28, 0, 0.34, 0.58, 0.36, outfit, leftLeg);
  box(0, -0.56, 0.06, 0.42, 0.22, 0.52, shoe, leftLeg);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.23, 0.77, 0);
  rig.add(rightLeg);

  box(0, -0.28, 0, 0.34, 0.58, 0.36, outfit, rightLeg);
  box(0, -0.56, 0.06, 0.42, 0.22, 0.52, shoe, rightLeg);

  // Body
  box(0, 1.28, 0, 0.94, 0.9, 0.64, outfit, rig);
  box(0, 0.99, -0.015, 1.02, 0.22, 0.68, outfit, rig);

  // Animated arms
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.56, 1.58, 0);
  rig.add(leftArm);

  box(0, -0.31, 0, 0.27, 0.63, 0.34, outfit, leftArm);
  ball(0, -0.64, 0.015, 0.16, skin, leftArm, 14);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.56, 1.58, 0);
  rig.add(rightArm);

  box(0, -0.31, 0, 0.27, 0.63, 0.34, outfit, rightArm);
  ball(0, -0.64, 0.015, 0.16, skin, rightArm, 14);

  // Head
  const head = new THREE.Group();
  head.position.set(0, 2.12, 0);
  rig.add(head);

  ball(0, 0, 0, 0.69, skin, head, 28);

  let faceZ = 0.62;

  if (isGirl) {
    // Cream hijab with soft rounded folds
    ball(0, 0.13, -0.06, 0.75, mat("#f1dfd0"), head, 26);

    ball(0, -0.04, 0.48, 0.49, skin, head, 24)
      .scale.set(1, 1.05, 0.42);

    ball(-0.48, -0.18, 0.18, 0.25, mat("#f1dfd0"), head)
      .scale.set(0.8, 1.4, 0.75);

    ball(0.48, -0.18, 0.18, 0.25, mat("#f1dfd0"), head)
      .scale.set(0.8, 1.4, 0.75);

    faceZ = 0.89;
  } else {
    // White kufi
    ball(0, 0.48, -0.02, 0.58, M.white, head)
      .scale.set(1, 0.38, 1);

    cyl(0, 0.46, -0.02, 0.53, 0.53, 0.12, M.white, head, 24);

    ball(-0.53, 0.08, -0.03, 0.18, mat("#68412f"), head);
    ball(0.53, 0.08, -0.03, 0.18, mat("#68412f"), head);
  }

  // Big cartoon eyes and highlights
  for (const ex of [-0.22, 0.22]) {
    ball(ex, 0.02, faceZ, 0.125, dark, head, 18);
    ball(ex - 0.03, 0.065, faceZ + 0.085, 0.042, shine, head, 12);
  }

  // Rosy cheeks
  ball(-0.38, -0.17, faceZ - 0.015, 0.105, cheek, head, 14);
  ball(0.38, -0.17, faceZ - 0.015, 0.105, cheek, head, 14);

  // Little smile
  const smile = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.13, -0.22, faceZ + 0.03),
    new THREE.Vector3(0, -0.36, faceZ + 0.06),
    new THREE.Vector3(0.13, -0.22, faceZ + 0.03)
  );

  mesh(
    new THREE.TubeGeometry(smile, 12, 0.035, 8, false),
    mat("#a94742"),
    0, 0, 0, head
  );

  // Small outfit details
  box(0.18, 1.35, 0.333, 0.22, 0.24, 0.035,
    mat(isGirl ? "#cda96f" : "#6d9f98"), rig);

  ball(0, 1.55, 0.34, 0.045, M.gold, rig, 10);

  root.userData = {
    name,
    rig,
    head,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    phase: Math.random() * 6
  };

  return root;
}

const zayn = character({
  name: "Zayn",
  x: -1.15,
  z: 5.5,
  outfitColor: "#79b8ad",
  bagColor: "#b99a82"
});

const aisha = character({
  name: "Aisha",
  x: 1.15,
  z: 6.4,
  outfitColor: "#e7c18b",
  bagColor: "#d6a3ae",
});

let active = zayn;
let started = false;

const keys = new Set();
const clock = new THREE.Clock();
const speed = 6.2;

// KEYBOARD CONTROLS
window.addEventListener("keydown", e => {
  const k = e.key.toLowerCase();

  if ([
    "arrowup", "arrowdown", "arrowleft", "arrowright"
  ].includes(k)) {
    e.preventDefault();
  }

  if ([
    "w", "a", "s", "d",
    "arrowup", "arrowdown", "arrowleft", "arrowright"
  ].includes(k)) {
    keys.add(k);
  }
});

window.addEventListener("keyup", e => {
  keys.delete(e.key.toLowerCase());
});

window.addEventListener("blur", () => keys.clear());

// MESSAGE BOX
function say(text, duration = 3500) {
  if (!message) return;

  message.textContent = text;
  message.style.display = "block";

  Object.assign(message.style, {
    position: "relative",
    zIndex: "3",
    pointerEvents: "none",
    padding: "10px 16px",
    margin: "8px auto",
    width: "fit-content",
    maxWidth: "90%",
    borderRadius: "18px",
    background: "#fff8e8",
    color: "#356b4d",
    fontWeight: "700",
    boxShadow: "0 4px 0 rgba(112,75,40,.16)"
  });

  clearTimeout(say.timer);

  if (duration > 0) {
    say.timer = setTimeout(() => {
      if (message.textContent === text) {
        message.style.display = "none";
      }
    }, duration);
  }
}

// START BUTTON
function start() {
  if (started) return;
  started = true;

  if (welcome) {
    welcome.style.transition = "opacity .35s ease, transform .35s ease";
    welcome.style.opacity = "0";
    welcome.style.pointerEvents = "none";
    welcome.style.transform = "scale(.97)";

    setTimeout(() => {
      if (welcome) welcome.style.display = "none";
    }, 380);
  }

  say("Welcome to our cosy little village 🌷 Use WASD or the arrow keys to wander.");
}

if (startButton) {
  startButton.addEventListener("click", start);
}

// EXPLORE, LEARN, DUAS AND STORIES BUTTONS
const prompts = {
  explore: "Explore the village! Find the mosque, river and colorful homes 🧭",
  learn: "Learning corner 📖 — seeking beneficial knowledge is a good deed.",
  duas: "Dua corner 🤲 — try saying Bismillah before beginning something good.",
  stories: "Story corner 📚 — ask a grown-up to share a prophet's story."
};

document.querySelectorAll(".bottom-menu [data-action]").forEach(button => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;

    if (!started) start();

    say(prompts[action] || "Let's explore together!");

    active = (
      action === "learn" || action === "stories"
    ) ? aisha : zayn;

    document.querySelectorAll(".bottom-menu [data-action]").forEach(b => {
      b.style.transform = b === button ? "translateY(-3px)" : "translateY(0)";
      b.style.filter = b === button ? "brightness(1.08)" : "none";
    });
  });
});

// TOUCH CONTROLS FOR PHONES AND TABLETS
let touchPad = document.querySelector("#touchControls");

if (!touchPad) {
  touchPad = document.createElement("div");
  touchPad.id = "touchControls";

  Object.assign(touchPad.style, {
    position: "absolute",
    left: "12px",
    bottom: "105px",
    zIndex: "4",
    display: "none",
    gridTemplateColumns: "42px 42px 42px",
    gridTemplateRows: "42px 42px",
    gap: "5px",
    touchAction: "none"
  });

  [
    ["", 0, 0],
    ["▲", 1, 0],
    ["", 2, 0],
    ["◀", 0, 1],
    ["▼", 1, 1],
    ["▶", 2, 1]
  ].forEach(([label, col, row]) => {
    const b = document.createElement("button");
    b.textContent = label;

    Object.assign(b.style, {
      gridColumn: col + 1,
      gridRow: row + 1,
      border: "2px solid white",
      borderRadius: "12px",
      background: "rgba(255,248,226,.9)",
      color: "#356b4d",
      fontSize: "19px",
      fontWeight: "800",
      touchAction: "none"
    });

    const key = {
      "▲": "arrowup",
      "▼": "arrowdown",
      "◀": "arrowleft",
      "▶": "arrowright"
    }[label];

    if (key) {
      b.addEventListener("pointerdown", e => {
        e.preventDefault();
        keys.add(key);
      });

      ["pointerup", "pointercancel", "pointerleave"].forEach(type => {
        b.addEventListener(type, () => keys.delete(key));
      });
    } else {
      b.disabled = true;
      b.style.visibility = "hidden";
    }

    touchPad.appendChild(b);
  });

  game.appendChild(touchPad);
}

function updateTouch() {
  if (touchPad) {
    touchPad.style.display =
      matchMedia("(pointer: coarse)").matches ? "grid" : "none";
  }
}

// RESPONSIVE RESIZE
const desired = new THREE.Vector3();
const look = new THREE.Vector3();
const lookNow = new THREE.Vector3();

function resize() {
  const w = Math.max(1, game.clientWidth || innerWidth);
  const h = Math.max(1, game.clientHeight || innerHeight);

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);

  updateTouch();
}

window.addEventListener("resize", resize);

if (window.ResizeObserver) {
  new ResizeObserver(resize).observe(game);
}

// WALKING ANIMATION AND SMOOTH CAMERA
function animate() {
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), 0.04);
  const t = clock.elapsedTime;

  let dx = 0;
  let dz = 0;

  if (keys.has("a") || keys.has("arrowleft")) dx--;
  if (keys.has("d") || keys.has("arrowright")) dx++;
  if (keys.has("w") || keys.has("arrowup")) dz--;
  if (keys.has("s") || keys.has("arrowdown")) dz++;

  const len = Math.hypot(dx, dz);
  const moving = started && len > 0;

  if (len) {
    dx /= len;
    dz /= len;

    active.position.x = THREE.MathUtils.clamp(
      active.position.x + dx * speed * dt, -25, 25
    );

    active.position.z = THREE.MathUtils.clamp(
      active.position.z + dz * speed * dt, -27, 23
    );

    active.rotation.y = Math.atan2(dx, dz);
  }

  [zayn, aisha].forEach(c => {
    const d = c.userData;
    const walk = c === active && moving;
    const phase = t * (walk ? 10 : 2.2) + d.phase;

    d.rig.position.y = walk
      ? Math.abs(Math.sin(phase)) * 0.09
      : Math.sin(phase) * 0.025;

    d.leftArm.rotation.x = walk
      ? Math.sin(phase) * 0.65
      : Math.sin(phase) * 0.04;

    d.rightArm.rotation.x = walk
      ? -Math.sin(phase) * 0.65
      : -Math.sin(phase) * 0.04;

    d.leftLeg.rotation.x = walk ? -Math.sin(phase) * 0.62 : 0;
    d.rightLeg.rotation.x = walk ? Math.sin(phase) * 0.62 : 0;

    d.head.rotation.z = Math.sin(t * 1.4 + d.phase) * 0.025;
  });

  // Camera gently follows the selected character
  desired.set(
    active.position.x,
    active.position.y + 9.5,
    active.position.z + 14.5
  );

  camera.position.lerp(desired, 1 - Math.exp(-3.1 * dt));

  look.set(
    active.position.x,
    active.position.y + 1.15,
    active.position.z - 1
  );

  lookNow.lerp(look, 1 - Math.exp(-4.2 * dt));
  camera.lookAt(lookNow);

  // Gentle flower movement and water animation
  flowers.forEach(f => {
    f.rotation.z = Math.sin(t * 1.5 + f.userData.phase) * 0.08;
    f.position.y = Math.sin(t * 2 + f.userData.phase) * 0.025;
  });

  water.position.y = 0.08 + Math.sin(t * 1.5) * 0.025;

  renderer.render(scene, camera);
}

// START THE GAME
resize();

camera.position.set(0, 10, 20);
camera.lookAt(0, 1.5, 0);

animate();

say(
  'A little storybook world awaits 🌙 Click "Let\\'s Explore!" and use WASD or arrow keys.',
  6500
);
