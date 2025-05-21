import { useEffect, useState } from "react";
import "../../../components/css/tictactoe.css";
import Cell from "../../../pages/learner/games/Cell";
import { FaTimes, FaRegCircle } from "react-icons/fa";

const Tictactoe = () => {
  const [cells, setCells] = useState(Array(9).fill(""));
  const [go, setGo] = useState("X");
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
    setGo(go === "X" ? "O" : "X");
  };

  const winnerSound = new Audio("path-to-sound.mp3");

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
        winnerSound.play();
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
    setGo("X");
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
    newCells[randomMove] = "O";
    setCells(newCells);

    checkWinner(newCells);
    setGo("X");
  };

  useEffect(() => {
    if (isGameOver || !isPlayingWithComputer || go === "X") return;

    setTimeout(() => {
      computerMove();
    }, 500);
  }, [go, cells, isPlayingWithComputer, isGameOver]);

  const toggleComputer = () => {
    setIsPlayingWithComputer((prev) => !prev);
    resetGame();
  };

  const renderIcon = (value) => {
    if (value === "X") return <FaTimes className="x-icon" />;
    if (value === "O") return <FaRegCircle className="o-icon" />;
    return null;
  };

  return (
    <div className="game-container">
      <h2>Tic Tac Toe</h2>
      <p>
        {message || (
          <>
            Turn:{" "}
            {go === "X" ? (
              <FaTimes className="icon-sm" />
            ) : (
              <FaRegCircle className="icon-sm" />
            )}
          </>
        )}
      </p>
      <div className="board">
        {cells.map((cell, index) => (
          <Cell
            key={index}
            value={cell}
            onClick={() => handleClick(index)}
            renderIcon={renderIcon}
          />
        ))}
      </div>
      {isGameOver && (
        <div className="popup">
          <h3 className="flex items-center justify-center gap-2">
            {winner ? (
              <>
                {winner === "X" ? (
                  <FaTimes className="icon-md" />
                ) : (
                  <FaRegCircle className="icon-md" />
                )}
                <span>WON!</span>
              </>
            ) : (
              "It's a draw!"
            )}
          </h3>
          <button onClick={resetGame}>Restart</button>
        </div>
      )}
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
