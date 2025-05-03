import React, { useState, useEffect } from "react";
import Cell from "../../pages/learner/Cell";
import "../../components/css/tictactoe.css";

const Tictactoe = () => {
  const [cells, setCells] = useState(Array(9).fill(""));
  const [go, setGo] = useState("❌");
  const [message, setMessage] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState("");
  const [isPlayingWithComputer, setIsPlayingWithComputer] = useState(false);

  const handleClick = (index) => {
    if (cells[index] !== "" || isGameOver) return;

    const newCells = [...cells];
    newCells[index] = go;
    setCells(newCells);

    checkWinner(newCells);
    setGo(go === "❌" ? "⭕" : "❌");
  };

  const winnerSound = new Audio("path-to-sound.mp3"); // Replace with your sound file

  const checkWinner = (board) => {
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let condition of wins) {
      const [a, b, c] = condition;
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        setMessage(`${board[a]} wins!`);
        setWinner(board[a]);
        setIsGameOver(true);
        winnerSound.play(); // Play the sound effect
        return;
      }
    }

    if (!board.includes("")) {
      setMessage("It's a draw!");
      setIsGameOver(true);
    }
  };

  const resetGame = () => {
    setCells(Array(9).fill(""));
    setGo("❌");
    setMessage("");
    setWinner("");
    setIsGameOver(false);
  };

  const computerMove = () => {
    const emptyCells = cells
      .map((cell, index) => (cell === "" ? index : -1))
      .filter((index) => index !== -1);

    if (emptyCells.length === 0) return;

    const randomMove =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newCells = [...cells];
    newCells[randomMove] = "⭕";
    setCells(newCells);

    checkWinner(newCells);
    setGo("❌");
  };

  useEffect(() => {
    if (isGameOver || !isPlayingWithComputer || go === "❌") return;

    setTimeout(() => {
      computerMove();
    }, 500);
  }, [go, cells, isPlayingWithComputer, isGameOver]);

  const toggleComputer = () => {
    setIsPlayingWithComputer((prev) => !prev);
    resetGame();
  };

  return (
    <div className="game-container">
      <h2>Tic Tac Toe</h2>
      <p>{message || `Turn: ${go}`}</p>
      <div className="board">
        {cells.map((cell, index) => (
          <Cell key={index} value={cell} onClick={() => handleClick(index)} />
        ))}
      </div>
      {isGameOver && (
        <div className="popup">
          <h3>{winner ? `${winner} WON!` : "It's a draw!"}</h3>
          <button onClick={resetGame}>Restart</button>
        </div>
      )}
      {/* ✅ Wrap the buttons in .button-group */}
      <div className="button-group">
        <button onClick={resetGame}>Restart</button>
        <button onClick={toggleComputer}>
          {isPlayingWithComputer ? "Play with Player" : "Play with Computer"}
        </button>
      </div>
    </div>
  );
};

export default Tictactoe;
