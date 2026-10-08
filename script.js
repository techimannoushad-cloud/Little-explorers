```javascript
// ==========================================
// LITTLE EXPLORERS
// 3D GAME ENGINE
// ==========================================

const canvas = document.getElementById("gameCanvas");

// ==========================================
// SCENE
// ==========================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

// ==========================================
// CAMERA
// ==========================================

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 8, 12);

// ==========================================
// RENDERER
// ==========================================

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

// ==========================================
// LIGHTING
// ==========================================

const sunlight = new THREE.DirectionalLight(
    0xffffff,
    2
);

sunlight.position.set(
    10,
    20,
    10
);

scene.add(sunlight);

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.6
);

scene.add(ambientLight);

// ==========================================
// GROUND
// ==========================================

const groundGeometry =
    new THREE.PlaneGeometry(100, 100);

const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x78a96b
    });

const ground =
    new THREE.Mesh(
        groundGeometry,
        groundMaterial
    );

ground.rotation.x = -Math.PI / 2;

scene.add(ground);

// ==========================================
// PATH
// ==========================================

const pathGeometry =
    new THREE.PlaneGeometry(8, 100);

const pathMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xd9bd87
    });

const path =
    new THREE.Mesh(
        pathGeometry,
        pathMaterial
    );

path.rotation.x = -Math.PI / 2;
path.position.y = 0.01;

scene.add(path);

// ==========================================
// HOUSE
// ==========================================

function createHouse(x, z) {

    const house = new THREE.Group();

    // Walls
    const wallGeometry =
        new THREE.BoxGeometry(5, 3, 5);

    const wallMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xf1dfb8
        });

    const walls =
        new THREE.Mesh(
            wallGeometry,
            wallMaterial
        );

    walls.position.y = 1.5;

    house.add(walls);

    // Roof
    const roofGeometry =
        new THREE.ConeGeometry(
            4,
            2.5,
            4
        );

    const roofMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x9a6245
        });

    const roof =
        new THREE.Mesh(
            roofGeometry,
            roofMaterial
        );

    roof.position.y = 4;

    roof.rotation.y =
        Math.PI / 4;

    house.add(roof);

    house.position.set(x, 0, z);

    scene.add(house);
}

createHouse(-10, -8);

// ==========================================
// MOSQUE
// ==========================================

function createMosque(x, z) {

    const mosque = new THREE.Group();

    // Main building
    const buildingGeometry =
        new THREE.CylinderGeometry(
            4,
            4,
            5,
            32
        );

    const buildingMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xf4f0df
        });

    const building =
        new THREE.Mesh(
            buildingGeometry,
            buildingMaterial
        );

    building.position.y = 2.5;

    mosque.add(building);

    // Dome
    const domeGeometry =
        new THREE.SphereGeometry(
            4.2,
            32,
            16,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2
        );

    const domeMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x4d8065
        });

    const dome =
        new THREE.Mesh(
            domeGeometry,
            domeMaterial
        );

    dome.position.y = 5;

    mosque.add(dome);

    // Minaret
    const minaretGeometry =
        new THREE.CylinderGeometry(
            0.6,
            0.8,
            8,
            16
        );

    const minaret =
        new THREE.Mesh(
            minaretGeometry,
            buildingMaterial
        );

    minaret.position.set(
        5,
        4,
        0
    );

    mosque.add(minaret);

    mosque.position.set(x, 0, z);

    scene.add(mosque);
}

createMosque(12, -12);

// ==========================================
// TREES
// ==========================================

function createTree(x, z) {

    const tree = new THREE.Group();

    const trunkGeometry =
        new THREE.CylinderGeometry(
            0.35,
            0.45,
            2,
            8
        );

    const trunkMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x795548
        });

    const trunk =
        new THREE.Mesh(
            trunkGeometry,
            trunkMaterial
        );

    trunk.position.y = 1;

    tree.add(trunk);

    const leavesGeometry =
        new THREE.SphereGeometry(
            1.7,
            16,
            16
        );

    const leavesMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x4f8a55
        });

    const leaves =
        new THREE.Mesh(
            leavesGeometry,
            leavesMaterial
        );

    leaves.position.y = 3;

    tree.add(leaves);

    tree.position.set(x, 0, z);

    scene.add(tree);
}

for (let i = 0; i < 25; i++) {

    const x =
        (Math.random() - 0.5) * 70;

    const z =
        (Math.random() - 0.5) * 70;

    if (Math.abs(x) > 8) {
        createTree(x, z);
    }
}

// ==========================================
// PLAYER
// ==========================================

const player = new THREE.Group();

const bodyGeometry =
    new THREE.CapsuleGeometry(
        0.55,
        1.55,
        1.5,
        16
    );

const bodyMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x7b9c83
    });

const body =
    new THREE.Mesh(
        bodyGeometry,
        bodyMaterial
    );

body.position.y = 1.1;

player.add(body);

// Head

const headGeometry =
    new THREE.SphereGeometry(
        0.55,
        16,
        16
    );

const headMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xc98d68
    });

const head =
    new THREE.Mesh(
        headGeometry,
        headMaterial
    );

head.position.y = 2.3;

player.add(head);

player.position.set(
    0,
    0,
    10
);

scene.add(player);

// ==========================================
// MOVEMENT
// ==========================================

const keys = {};

document.addEventListener(
    "keydown",
    function(event) {
        keys[event.key.toLowerCase()] = true;
    }
);

document.addEventListener(
    "keyup",
    function(event) {
        keys[event.key.toLowerCase()] = false;
    }
);

const speed = 0.12;

function movePlayer() {

    if (
        keys["w"] ||
        keys["arrowup"]
    ) {
        player.position.z -= speed;
    }

    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {
        player.position.z += speed;
    }

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {
        player.position.x -= speed;
    }

    if (
        keys["d"] ||
        keys["arrowright"]
    ) {
        player.position.x += speed;
    }

}

// ==========================================
// CAMERA FOLLOW
// ==========================================

function updateCamera() {

    const targetX =
        player.position.x;

    const targetZ =
        player.position.z + 10;

    camera.position.x +=
        (targetX - camera.position.x) * 0.08;

    camera.position.z +=
        (targetZ - camera.position.z) * 0.08;

    camera.lookAt(
        player.position.x,
        1,
        player.position.z
    );
}

// ==========================================
// STARS
// ==========================================

let stars = 0;

function collectStar() {

    stars++;

    document.getElementById(
        "stars"
    ).textContent = stars;
}

// ==========================================
// GAME LOOP
// ==========================================

function animate() {

    requestAnimationFrame(
        animate
    );

    movePlayer();

    updateCamera();

    renderer.render(
        scene,
        camera
    );
}

animate();

// ==========================================
// RESIZE
// ==========================================

window.addEventListener(
    "resize",
    function() {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);

// ==========================================
// LOADING SCREEN
// ==========================================

setTimeout(function() {

    document.getElementById(
        "loadingScreen"
    ).style.display = "none";

}, 1200);
```
