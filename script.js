const form = document.querySelector("#setup-form");
let p1 = document.querySelector("#player1");
let p2 = document.querySelector("#player2"); 
const startButton = document.querySelector("#startButton");

function makePlayer(name, marker){
    return {
        name,
        marker
    }
}

const Game = (()=>{
    let players = [];
    let currentPlayer;
    let gameOver;

    const start = () =>{
        players = [
            makePlayer(p1.value, "X"),
            makePlayer(p2.value, "O")
        ];

        currentPlayer = 0;
        gameOver = false;
    }

    return {
        start,
    }
})();

startButton.addEventListener('click', ()=>{
    Game.start();
})
