class SpaceShip {
    constructor(hull, firepower, accuracy) {
        this.hull = hull;
        this.firepower = firepower;
        this.accuracy = accuracy;
    }

    getHull() {
        return this.hull;
    }

    setHull(num) {
        return this.hull = num;
    }

    getFirePower() {
        return this.firepower;
    }

    setFirePower(num) {
        return this.firepower = num;
    }

    getAccuracy() {
        return this.accuracy;
    }

    setAccuracy(num) {
        return this.accuracy = num;
    }
}

const playerShip = new SpaceShip(20, 5, .7);
const alienShips = [];
let roundCounter = 0;
let mainScreen = document.getElementById("mainScreen").style;
let runningMode = document.getElementById("runningMode").style;
let ships = document.getElementById("ships").style;
let optionsButtons = document.getElementById("optionsButtons").style;
let playerHudBar = document.getElementById("playerHullBar");
let alienHullBar = document.getElementById("alienHullBar");
let attackButton = document.getElementById("attackButton").style;
let roundsText = document.getElementById("rounds");
let alienHullBoarder = document.getElementsByClassName("hull")[1].style;
let playerHullBoarder = document.getElementsByClassName("hull")[0].style;
let missile = document.getElementById("missile");
let missileEnemy = document.getElementById("missileEnemy");
let alienShip = document.getElementById("alienShip");

createAlienShips(alienShips);

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function createAlienShips(array) {
    for (let i = 0; i < 6; i++) {
        array.push(new SpaceShip(0, 0, 0))
    }
    return array;
}

function updateAlienShips() {
    // set new alien properties
    for (let i = 0; i < 6; i++) {
        alienShips[i].setHull(getRandomNumber(3, 7));
        alienShips[i].setFirePower(getRandomNumber(2, 5));
        alienShips[i].setAccuracy(Math.random());
        // alienShips[i].setHull(15);
        // alienShips[i].setFirePower(6);
        // alienShips[i].setAccuracy(1)
    }
}

function startGame() {
    updateAlienShips();
    updateRoundCounter()
    alienBarResizeAnimation();
    playerBarResizeAnimation()
    alienShip.src = "images/sp2.png";
    roundCounter = 0;
    playerHudBar.style.visibility = "visible";
    alienHullBar.style.visibility = "visible";
    mainScreen.visibility = "hidden";
    ships.visibility = "visible";
    runningMode.visibility = "visible";
    playerHudBar.innerHTML = playerShip.getHull();
    alienHullBar.innerHTML = alienShips[roundCounter].getHull();
    attackButton.visibility = "visible";
    alienHullBoarder.visibility = "visible";
    playerHullBoarder.visibility = "visible";
    document.getElementById("playerShip").src = "images/playerShip.png";

}

function playerAttack() {
    let alienHull = alienShips[roundCounter].getHull();
    attackButton.visibility = "hidden";
    alienHull -= playerShip.getFirePower();
    alienShips[roundCounter].setHull(alienHull);
    playerHitAnimation();
    playerMissileAudio();
    setTimeout(alienDamageAudio, 1500);
    setTimeout(shipExplosionAnimation, 1500);
    setTimeout(updateHullBar, 1500);
    setTimeout(alienBarAnimation, 1500);

}

function alienAttack() {
    let playerHull = playerShip.getHull();

    // alien ship not destroyed
    if (alienShips[roundCounter].getHull() > 0) {
        if (Math.random() < alienShips[roundCounter].getAccuracy()) {
            // alien attacks
            playerHull -= alienShips[roundCounter].getFirePower();
            alienHitAnimation();
            alienMissileAudio();
            setTimeout(playerDamageAudio, 1500);
            setTimeout(shipExplosionAnimation, 1500);
            playerShip.setHull(playerHull);
            setTimeout(playerBarAnimation, 1500);
            setTimeout(updateHullBar, 1500);

            if (playerHull < 1) {
                setTimeout(gameOver, 3000);
            } else {
                setTimeout(attackButtonTimeOut, 1900);
            }
        } else {
            // alien miss
            alienMissAnimation();
            setTimeout(attackButtonTimeOut, 1900);
        }

    } else {
        // You destroyed last ship
        if (roundCounter === alienShips.length - 1) {
            roundCounter++;
            youWin()
        } else {
            setTimeout(optionsButtonTimeOut, 1500);
        }
    }
}

function attackButtonTimeOut() {
    attackButton.visibility = "visible";
}

function optionsButtonTimeOut() {
    optionsButtons.visibility = "visible";
}

function nextRound() {
    roundCounter++;
    if (roundCounter < alienShips.length) {
        updateHullBar();
        updateRoundCounter();
        attackButton.visibility = "visible";
        optionsButtons.visibility = "hidden";
        alienBarResizeAnimation();
    }
}

function gameOver() {
    updateAlienShips()
    mainScreen.visibility = "visible";
    roundsText.innerHTML = "YOU LOSE";
    playerHudBar.style.visibility = "hidden";
    alienHullBar.style.visibility = "hidden";
    ships.visibility = "hidden";
    optionsButtons.visibility = "hidden";
    playerShip.setHull(20);
    alienHullBoarder.visibility = "hidden";
    playerHullBoarder.visibility = "hidden";
}

function youWin() {
    updateRoundCounter()
    updateAlienShips()
    playerShip.setHull(20);
    mainScreen.visibility = "visible"
    playerHudBar.style.visibility = "hidden"
    alienHullBar.style.visibility = "hidden"
    ships.visibility = "hidden";

}

function updateHullBar() {
    if (roundCounter < alienShips.length)
        alienHullBar.innerHTML = alienShips[roundCounter].getHull();
    playerHudBar.innerHTML = playerShip.getHull();
}

function updateRoundCounter() {
    if (roundCounter < alienShips.length) {
        roundsText.innerHTML = ("ROUND " + (roundCounter + 1));
    }
    if (roundCounter === alienShips.length) {
        roundsText.innerHTML = ("YOU WON ");
    }
}

function playerHitAnimation() {
    missile.animate([
        { // from
            visibility: "visible",
            marginTop: "60px",
            marginLeft: "50px",
            // width:"10px"
        },
        { // to
            marginTop: "50px",
            marginLeft: "90%",
            // width:"1px"
        }
    ], 1500);
}

function playerBarResizeAnimation() {
    playerHudBar.animate([
        {
            borderRadius: "3px",
            width: "0px",
        },
        {
            borderRadius: "3px",
            width: "100%",
            backgroundColor: "green"
        }
    ], {duration: 1000, fill: "forwards"});
}

function playerBarAnimation() {
    let hullPercentage = (playerShip.getHull()  > 10 ? (playerShip.getHull() -10) * 10 : playerShip.getHull());

    console.log(hullPercentage);
    playerHudBar.animate([
        {
            borderRadius: "3px",
            width: hullPercentage + "%",
        },

        {

            borderRadius: "3px",
            width: hullPercentage + "%",
            backgroundColor: "yellow"
        }
    ], {duration: 1000, fill: "forwards"});

}

function alienHitAnimation() {
    missileEnemy.animate([
        { // from
            visibility: "visible",
            marginTop: "50px",
            marginLeft: "580px",
            width: "40px",
        },

        { // to
            visibility: "visible",
            marginTop: "50px",
            marginLeft: "50px",
            width: "30px",
        }
    ], 1500);
}

function alienMissAnimation() {
    missileEnemy.animate([
        { // from

            visibility: "visible",
            marginTop: "50px",
            marginLeft: "580px",
            width: "40px",
        },

        { // to
            visibility: "visible",
            marginTop: "100px",
            marginLeft: "50px",
            width: "30px",
        }
    ], 1500);
}

function alienBarAnimation() {
    let hullPercentage = (alienShips[roundCounter].getHull() > 0 ?
        alienShips[roundCounter].getHull() * 10 : 0);

    alienHullBar.animate([
        {
            borderRadius: "3px",
            width: hullPercentage + "%",
        },

        {
            borderRadius: "3px",
            width: hullPercentage + "%",
            backgroundColor: "red"
        }
    ], {duration: 1000, fill: "forwards"});

}

function alienBarResizeAnimation() {

    alienHullBar.animate([
        {
            borderRadius: "3px",
            width: "0px",
        },

        {
            borderRadius: "3px",
            width: "100%",
            backgroundColor: "green"
        }
    ], {duration: 1000, fill: "forwards"});
}

function alienShipChange() {
    switch (roundCounter) {
        case 1:
            alienShip.src = "images/sp8.png";
            break;
        case 2:
            alienShip.src = "images/sp7.png";
            break;
        case 3:
            alienShip.src = "images/sp4.png";
            break;
        case 4:
            alienShip.src = "images/sp3.png";
            break;
        case 5:
            alienShip.src = "images/sp1.png";
            break;
    }
}

function shipExplosionAnimation() {
    if (alienShips[roundCounter].getHull() < 1) {
        document.getElementById("alienShip").classList.toggle("animationBox");
        document.getElementById("alienShip").src = "images/shapeBlank.svg"
        setTimeout(explosionRemove, 1500);
        playExplosionAudio();
    }
    if (playerShip.getHull() < 1) {
        document.getElementById("playerShip").classList.toggle("animationBox");
        document.getElementById("playerShip").src = "images/shapeBlank.svg"
        setTimeout(explosionRemove, 1500);
        playExplosionAudio();
    }

}

function explosionRemove() {
    document.getElementById("alienShip").classList.remove("animationBox");
    document.getElementById("playerShip").classList.remove("animationBox");
}

function playExplosionAudio() {
    document.getElementById("explosionAudio").play();
}

function playerMissileAudio() {
    document.getElementById("playerMissileAudio").play();
}

function alienMissileAudio() {
    document.getElementById("alienMissileAudio").play();
}

function playerDamageAudio() {
    if (playerShip.getHull() > 0)
        document.getElementById("playerDamageAudio").play();
}

function alienDamageAudio() {
    if (alienShips[roundCounter].getHull() > 0)
        document.getElementById("alienDamageAudio").play();
}

