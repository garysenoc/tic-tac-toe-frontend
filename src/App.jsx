import { useState, useEffect } from 'react';
import './App.css';
import Swal from "sweetalert2";
import { useNavigate  } from "react-router-dom";
import * as ls from "local-storage";
function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const xWins = ls.get('xWins');
    const oWins = ls.get('oWins');
    const draw = ls.get('draw');

    // Initialize local storage values if they are missing
    if (xWins === null || oWins === null || draw === null) {
      ls.set('xWins', 0);
      ls.set('oWins', 0);
      ls.set('draw', 0);
    }
  },[]);

  const createHistory = async () => {
    const body = {
      xWins: ls.get('xWins') || 0,
      oWins: ls.get('oWins') || 0,
      draw: ls.get('draw') || 0,
      dateCreated: new Date().toISOString(),
      xPlayerName: ls.get('playerX'),
      oPlayerName:ls.get('playerO'),
    };
  
    try {
      const response = await fetch('https://tic-tac-toe-backend-goz5.onrender.com/api/history/create-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (response.ok) {
        console.log('History created successfully');

      } else {
        console.error('Failed to create history');
 
      }
    } catch (error) {
      console.error('Error creating history:', error);
    
    }
  };

  const continueStopModal = (gameWinner) => {
    Swal.fire({
      title: `${gameWinner === 'draw'? 'It is a draw' : `${gameWinner} wins`}! Do you want to continue or stop?`,
      showCancelButton: true,
      confirmButtonText: "Continue",
      cancelButtonText: "Stop",
      preConfirm: (name) => {
        if (name) {
          console.log(`Player name entered: ${name}`);
          return name;
        } else {
          Swal.showValidationMessage("Player name is required");
        }
      },
      allowOutsideClick: false,
      showClass: {
        popup: "swal2-show",
        backdrop: "swal2-backdrop-show",
      },
      hideClass: {
        popup: "swal2-hide",
        backdrop: "swal2-backdrop-hide",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const playerName = result.value;
        console.log(`Player name submitted: ${playerName}`);

        console.log("Continue action");
        resetGame();
      } else if (

        result.dismiss === Swal.DismissReason.cancel
      ) {
     
        console.log("Stop action");
        createHistory();
        navigate('/')
      }
    });
  };
  
  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  };

  const handleClick = (i) => {
    if (winner || board[i]) return;
  
    const newBoard = [...board];
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === 'X') {
        const getXwins = ls.get('xWins');
       ls.set('xWins',getXwins + 1);
      } else if (gameWinner === 'O') {
        const getXwins = ls.get('oWins');
        ls.set('oWins',getXwins + 1);
      }
      continueStopModal(gameWinner)
    } else if (newBoard.every((square) => square)) {
      const getXwins = ls.get('draw');
      ls.set('draw',getXwins + 1);
      continueStopModal('Draw');
    }
  };
  
  const renderDrawMessage = () => {
    if (!winner && board.every((square) => square)) {
      return <h2>It's a draw!</h2>;
    }
    return null;
  };
  
  

  const renderSquare = (i) => (
    <button className="square" onClick={() => handleClick(i)}>
      {board[i]}
    </button>
  );


  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  };

  return (
    <div className="app">
      <h1>Tic Tac Toe</h1>
      <div className="board">
        {board.map((square, i) => (
          <div key={i} className="square-container">
            {renderSquare(i)}
          </div>
        ))}
      </div>
      {winner && <h2>{winner} wins!</h2>}
      {renderDrawMessage()}
    </div>
  );
}

export default App;
