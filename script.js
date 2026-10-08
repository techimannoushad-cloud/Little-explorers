/* =================================
   AISHA & ZAYN ADVENTURES
   CHARACTER CREATOR
================================= */


/* ================================
   GAME DATA
================================ */

let stars = 0;
let hearts = 3;


/* ================================
   AISHA
================================ */

function changeAishaHijab(color) {

    const hijab = document.querySelector(
        ".aisha .hijab"
    );

    hijab.style.background = color;
}


function changeAishaOutfit(color) {

    const outfit = document.querySelector(
        ".aisha .body"
    );

    outfit.style.background = color;
}


/* ================================
   ZAYN
================================ */

function changeZaynHair(color) {

    const hair = document.querySelector(
        ".zayn .hair"
    );

    hair.style.background = color;
}


function changeZaynOutfit(color) {

    const outfit = document.querySelector(
        ".zayn .body"
    );

    outfit.style.background = color;
}


/* ================================
   START GAME
================================ */

function startAdventure() {

    document.getElementById(
        "characterScreen"
    ).style.display = "none";


    document.getElementById(
        "gameScreen"
    ).style.display = "block";


    stars = 0;
    hearts = 3;

    updateHUD();


    alert(
        "🌟 Welcome to Aisha & Zayn Adventures!"
    );
}


/* ================================
   HUD
================================ */

function updateHUD() {

    document.getElementById(
        "stars"
    ).textContent = stars;


    document.getElementById(
        "hearts"
    ).textContent = hearts;
}


/* ================================
   PLAYER MOVEMENT
================================ */

let aishaX = 45;
let aishaY = 65;

let zaynX = 50;
let zaynY = 65;


document.addEventListener(
    "keydown",
    function(event) {

        const key = event.key.toLowerCase();


        /* MOVE LEFT */

        if (key === "arrowleft" || key === "a") {

            aishaX -= 2;
            zaynX -= 2;
        }


        /* MOVE RIGHT */

        if (key === "arrowright" || key === "d") {

            aishaX += 2;
            zaynX += 2;
        }


        /* MOVE UP */

        if (key === "arrowup" || key === "w") {

            aishaY -= 2;
            zaynY -= 2;
        }


        /* MOVE DOWN */

        if (key === "arrowdown" || key === "s") {

            aishaY += 2;
            zaynY += 2;
        }


        /* KEEP PLAYERS INSIDE WORLD */

        aishaX = Math.max(
            0,
            Math.min(95, aishaX)
        );

        aishaY = Math.max(
            10,
            Math.min(90, aishaY)
        );


        zaynX = Math.max(
            0,
            Math.min(95, zaynX)
        );

        zaynY = Math.max(
            10,
            Math.min(90, zaynY)
        );


        moveCharacters();

    }
);


/* ================================
   MOVE CHARACTERS
================================ */

function moveCharacters() {

    const aisha =
        document.getElementById(
            "playerAisha"
        );

    const zayn =
        document.getElementById(
            "playerZayn"
        );


    aisha.style.left =
        aishaX + "%";


    aisha.style.top =
        aishaY + "%";


    zayn.style.left =
        zaynX + "%";


    zayn.style.top =
        zaynY + "%";
}
