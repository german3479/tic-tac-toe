const setupForm = document.querySelector("#setup-form");
const displayController = document.querySelector("#displayController");
const form = document.querySelector("#setup-form");
let p1 = document.querySelector("#player1");
let p2 = document.querySelector("#player2"); 
let player1MarkerSelector = document.querySelector("#player1marker");
let player2MarkerSelector = document.querySelector("#player2marker");
const startButton = document.querySelector("#startButton");
const resetButton = document.querySelector("#resetButton");

let turn = 1;


const Gameboard = (()=>{
    const board = new Array(9).fill(null);

    const cells = [];

    for (let i = 0; i < 9; i++){
        cells.push(document.getElementById(`cell-${i + 1}`))
    }

    return {
        getBoard: function(){
            return board;
        },
        getCells: function(){
            return cells;
        },
        updateCells: function(index, symbol){
            if (board[index] === ""){
                board[index] = symbol;
                cells[index].textContent = symbol;
                return true;
            }
            return false;
        },
        resetBoard: function(){
            for (let i = 0; i < 9; i++){
                board[i] = "";
                cells[i].textContent = "";
            }
        }
    }
})();

const Game = (()=>{
    let players = [];
    let currentPlayer;
    let gameOver;

    const makePlayer = (name,marker,active = 'false') =>{
        return {
            name,
            marker,
            active
        }
    }
    const start = () =>{
        document.querySelector("#player1name").classList.remove("active");
        document.querySelector("#player2name").classList.remove("active");

        players = [
            makePlayer(p1.value, player1MarkerSelector.value, player1MarkerSelector.value === "X"),
            makePlayer(p2.value, player2MarkerSelector.value, player2MarkerSelector.value === "X")
        ];

        currentPlayer = players.findIndex(player => player.active);
        gameOver = false;

        document.getElementById("player1name").textContent = players[0].name;
        document.getElementById("player2name").textContent = players[1].name;
        document.getElementById("player1symbol").textContent = players[0].marker;
        document.getElementById("player2symbol").textContent = players[1].marker;

        document.querySelector(`#player${currentPlayer + 1}name`).classList.toggle("active");

        console.log(currentPlayer + 1);
        Gameboard.resetBoard();

        setupForm.classList.toggle("hidden");
        displayController.classList.toggle("hidden");
    }

    const selectMarker = (firstMarker, otherMarker) =>{
        const firstValue = firstMarker.value;

        if (firstValue === "X"){
            otherMarker.value = "O";
        } else if (firstValue === "O"){
            otherMarker.value = "X";
        }
    }

    const checkWin = (board) => {
        for (let i = 0; i <= board.length - 3; i += 3){
            if (board[i] && board[i] == board[i + 1] && board[i + 1] == board[i + 2]){
                gameOver = true;
                return true;
            }
        }

        for (let i = 0; i < 3; i += 1){
            if (board[i] && board[i] === board[i + 3] && board[i + 3] == board[i + 6]){
                gameOver = true;
                return true;
            }
        }

        if (board[0] && board[0] == board[4] && board[4] == board[8]){
            gameOver = true;
            return true;
        }
        if (board[2] && board[2] == board[4] && board[4] == board[6]){
            gameOver = true;
            return true;
        }

        return false;
    }
    const play = n =>{
        const board = Gameboard.getBoard();
        const cells = Gameboard.getCells();

        if (!gameOver && board[n] === ""){
            const marker = players[currentPlayer].marker;
            cells[n].textContent = marker;

            board[n] = marker;
            if (checkWin(board)){
                gameOver = true;
                const winMsg = `${players[currentPlayer].name.toUpperCase()} WINS`;
                document.querySelector("#resultMessage").textContent = winMsg;
                document.querySelector("#resultMessage").style.display = "block";

                cells.forEach(cell => cell.classList.add("taken"));
            } else {
                cells[n].classList.add("taken");

                switchPlayer();
            }


        }
    }
    const switchPlayer = () =>{
        players[currentPlayer].active = false;
        currentPlayer = 1 - currentPlayer;
        players[currentPlayer].active = true;
        document.querySelector("#player1name").classList.toggle("active");
        document.querySelector("#player2name").classList.toggle("active");
    }

    return {
        start,
        selectMarker,
        checkWin,
        play,
        switchPlayer,
    }
})();



player1MarkerSelector.addEventListener('change', ()=>{
    Game.selectMarker(player1MarkerSelector, player2MarkerSelector);
})
player2MarkerSelector.addEventListener('change', ()=>{
    Game.selectMarker(player2MarkerSelector, player1MarkerSelector);
})
startButton.addEventListener('click', (e)=>{
    e.preventDefault();

    Game.start();
})
resetButton.addEventListener('click', e =>{
    const resultMessage = document.querySelector("#resultMessage");
    resultMessage.textContent = "";
    resultMessage.style.display = "none";

    Gameboard.resetBoard();

    form.reset();

    displayController.classList.toggle("hidden");
    setupForm.classList.toggle("hidden");

    Gameboard.getCells().forEach(cell =>{
        cell.classList.toggle("taken");
    })
})

const cells = Gameboard.getCells();

cells.forEach((cell, n) =>{
    cell.addEventListener('click', ()=>{
        Game.play(n);
    })
})