//* DARK MODE //

const modeToggle = document.getElementById('mode-toggle');
const body = document.body;
const isDarkMode = localStorage.getItem('dark-mode') === 'true';

//* Update the dark mode state based on the value from local storage
if (isDarkMode) {
    body.classList.add('dark-mode');
    modeToggle.textContent = 'Light Mode';
} else {
    body.classList.remove('dark-mode');
    modeToggle.textContent = 'Dark Mode';
}

//* Add an event listener for clicking on the mode toggle element
modeToggle.addEventListener('click', function () {
    const isDarkMode = body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', isDarkMode);
    modeToggle.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
});


//* TIC TAC TOE GAME //

const BOARD_SIZE = 9;
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
];

const board = Array(BOARD_SIZE).fill("");
const cells = document.querySelectorAll("td");
let currentPlayer = "X";
let computerPlayer = "O";
let gameOver = false;

// Add event listeners to all the cells
cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
});

function handleCellClick() {
    const index = Array.from(cells).indexOf(this);
    if (gameOver || board[index] !== "") {
        return;
    }

    makeMove(index, currentPlayer);

    if (!gameOver) {
        currentPlayer = computerPlayer;
        setTimeout(makeComputerMove, 500);
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;

    if (checkWin(player)) {
        document.getElementById("result").textContent = player + " won!";
        gameOver = true;
        disableCells();
    } else if (checkTie()) {
        document.getElementById("result").textContent = "Tie!";
        gameOver = true;
        disableCells();
    }
}

function checkWin(player) {
    return WINNING_COMBINATIONS.some((combination) =>
        combination.every((index) => board[index] === player)
    );
}

function checkTie() {
    return board.every((cell) => cell !== "");
}

function disableCells() {
    cells.forEach((cell) => {
        cell.removeEventListener("click", handleCellClick);
    });
}

function reset() {
    board.fill("");
    currentPlayer = "X";
    gameOver = false;
    document.getElementById("result").textContent = "";
    cells.forEach((cell) => {
        cell.textContent = "";
        cell.addEventListener("click", handleCellClick);
    });
}

function makeComputerMove() {
    let bestMove;
    let bestScore = -Infinity;
    let emptyCells = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        if (board[i] === "") {
            emptyCells.push(i);
        }
    }
    if (emptyCells.length === BOARD_SIZE - 1) {
        // First move of the game, choose a random empty cell
        let randomIndex = Math.floor(Math.random() * emptyCells.length);
        bestMove = emptyCells[randomIndex];
        currentPlayer = "X";
    } else {
        // Use minimax to find the best move
        for (let i = 0; i < BOARD_SIZE; i++) {
            if (board[i] === "") {
                board[i] = computerPlayer;
                let score = minimax(board, 0, false);
                board[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
    }
    makeMove(bestMove, computerPlayer);
    if (!gameOver) {
        currentPlayer = "X";
    }
}


// Function for minimax algorithm
function minimax(board, depth, isMaximizing) {
    if (checkWin(computerPlayer)) {
        return 10 - depth;
    } else if (checkWin(currentPlayer)) {
        return depth - 10;
    } else if (checkTie()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < BOARD_SIZE; i++) {
            if (board[i] === "") {
                board[i] = computerPlayer;
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < BOARD_SIZE; i++) {
            if (board[i] === "") {
                board[i] = currentPlayer;
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    }
}
