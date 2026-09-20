const gameBoard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => [...board];
  
  const setMarker = (index, marker) => {
    if (index >= 0 && index <= 8 && board[index] === '') {
      board[index] = marker;
      return true;
    }
    return false
  };

  const resetBoard = () => {
    board = ['', '', '', '', '', '', '', '', ''];
  }

  return {getBoard, setMarker, resetBoard}
})();


const Player = (name, marker) => {
  return { name, marker };
};


const gameControl = (() => {
  const player1 = Player('Player X', 'X');
  const player2 = Player('Player O', 'O');

  let activePlayer = player1;
  let isGameOver = false;

  let winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  const changeActivePlayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const checkWinner = (board) => {
    for (let combo of winningCombinations) {
      let [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // return the marker that won
      }
    }
    return board.includes('') ? null : "Tie"; 
  };

  const playTurn = (index) => {
    if (isGameOver) return;

    if (gameBoard.setMarker(index, activePlayer.marker)) {
      const currentBoard = gameBoard.getBoard(); // get current board
      const result = checkWinner(currentBoard); // check winner after each turn

      // if result is not null(falsy)
      if (result) {
        isGameOver = true // set game to over
        // print result
        if (result === 'Tie') {
          displayControl.setMessage("It's a tie!");
        } else {
          displayControl.setMessage(`${activePlayer.name} wins!`);
        }
      } else {
          changeActivePlayer();
          displayControl.setMessage(`${activePlayer.name}'s turn`);
        }
        displayControl.updateBoard();
      }
  };

  const resetGame = () => {
    gameBoard.resetBoard();
    activePlayer = player1;
    isGameOver = false;
    displayControl.setMessage(`${activePlayer.name}'s turn`);
    displayControl.updateBoard();
  };

  const getActivePlayer = () => activePlayer;

  return { playTurn, resetGame, getActivePlayer}
})();


const displayControl = (() => {
  // getting elements
  const boardElement = document.getElementById("board");
  const statusElement = document.getElementById("status-text");
  const restartButton = document.getElementById("restart-btn");

  const updateBoard = () => {
    boardElement.innerHTML = ""; //clear board
    const board = gameBoard.getBoard(); // get new board

    board.forEach((marker, index) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = index;
      cell.textContent = marker;

      cell.addEventListener("click", () => {
        gameControl.playTurn(index)
      });

      boardElement.appendChild(cell)
    });
  };
  const setMessage = (message) => {
      statusElement.textContent = message;
    };
  
    restartButton.addEventListener("click", () => {
      gameControl.resetGame();
    });
  
    // Initial render
    updateBoard();
  
    return { updateBoard, setMessage };
  
})();
