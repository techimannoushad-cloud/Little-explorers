// ==========================================
// LITTLE EXPLORERS
// 3D WORLD TEST
// ==========================================

const loadingScreen = document.getElementById("loadingScreen");

function hideLoading() {
    if (loadingScreen) {
        loadingScreen.style.display = "none";
    }
}

// Show errors instead of freezing forever
window.addEventListener("error", function (event) {

    console.error(event.error || event.message);

    if (loadingScreen) {
        loadingScreen.innerHTML = `
            <div class="loading-box">
                <h1>😅 Oops!</h1>
                <p>The 3D world had a little problem.</p>
                <p style="font-size:14px;margin-top:15px;">
                    Check the browser console for the error.
                </p>
            </div>
        `;
    }

});


// ==========================================
// CHECK THREE.JS
// ==========================================

if (typeof THREE === "undefined") {

    throw new Error(
        "Three.js did not load. Check the internet connection or Three.js script."
    );

}


// ==========================================
// SCENE
// ==========================================

const canvas = document.getElementById("gameCanvas");

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

camera.position.set(0, 7, 12);


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
// LIGHT
// ==========================================

const sunlight = new THREE.DirectionalLight(
    0xffffff,
    2
);

sunlight.position.set(10, 20, 10);

scene.add(sunlight);


const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.7
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

path.position.y = 0.02;

scene.add(path);


// ==========================================
// HOUSE
// ==========================================

function createHouse(x, z) {

    const house = new THREE.Group();

    // Walls
    const walls =
        new THREE.Mesh(
            new THREE.BoxGeometry(5, 3, 5),
            new THREE.MeshStandardMaterial({
                color: 0xf1dfb8
            })
        );

    walls.position.y = 1.5;

    house.add(walls);


    // Roof
    const roof =
        new THREE.Mesh(
            new THREE.ConeGeometry(4, 2.5, 4),
            new THREE.MeshStandardMaterial({
                color: 0x9a6245
            })
        );

    roof.position.y = 4;

    roof.rotation.y = Math.PI / 4;

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
    const building =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                4,
                4,
                5,
                32
            ),
            new THREE.MeshStandardMaterial({
                color: 0xf4f0df
            })
        );

    building.position.y = 2.5;

    mosque.add(building);


    // Dome
    const dome =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                4.2,
                32,
                16,
                0,
                Math.PI * 2,
                0,
                Math.PI / 2
            ),
            new THREE.MeshStandardMaterial({
                color: 0x4d8065
            })
        );

    dome.position.y = 5;

    mosque.add(dome);


    // Minaret
    const minaret =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.6,
                0.8,
                8,
                16
            ),
            new THREE.MeshStandardMaterial({
                color: 0xf4f0df
            })
        );

    minaret.position.set(5, 4, 0);

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


    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.35,
                0.45,
                2,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x795548
            })
        );

    trunk.position.y = 1;

    tree.add(trunk);


    const leaves =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                1.7,
                16,
                16
            ),
            new THREE.MeshStandardMaterial({
                color: 0x4f8a55
            })
        );

    leaves.position.y = 3;

    tree.add(leaves);


    tree.position.set(x, 0, z);

    scene.add(tree);
}


// Create trees
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


// Body
const body =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.55,
            0.55,
            1.5,
            16
        ),
        new THREE.MeshStandardMaterial({
            color: 0x7b9c83
        })
    );

body.position.y = 1.1;

player.add(body);


// Head
const head =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.55,
            16,
            16
        ),
        new THREE.MeshStandardMaterial({
            color: 0xc98d68
        })
    );

head.position.y = 2.3;

player.add(head);


// Starting position
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


function movePlayer() {

    const speed = 0.12;


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
// CAMERA
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
// GAME LOOP
// ==========================================

function animate() {

    requestAnimationFrame(animate);

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
// START GAME
// ==========================================

hideLoading();

console.log(
    "🌙 Little Explorers 3D world loaded!"
);
