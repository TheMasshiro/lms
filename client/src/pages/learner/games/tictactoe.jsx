import { useEffect, useState } from "react";
import "../../../components/css/tictactoe.css";
import Cell from "../../../pages/learner/games/Cell";
import { FaTimes, FaRegCircle, FaTrophy } from "react-icons/fa";

const Tictactoe = () => {
  const [cells, setCells] = useState(Array(9).fill(""));
  const [go, setGo] = useState("X");
  const [message, setMessage] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState("");
  const [isPlayingWithComputer, setIsPlayingWithComputer] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [winningCells, setWinningCells] = useState([]);

  const handleClick = (index) => {
    if (cells[index] !== "" || isGameOver) return;

    const newCells = [...cells];
    newCells[index] = go;
    setCells(newCells);

    checkWinner(newCells);

    if (!isGameOver) {
      setGo(go === "X" ? "O" : "X");
    }
  };

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
        setWinningCells([a, b, c]);
        setIsGameOver(true);
        setScores((prev) => ({
          ...prev,
          [board[a]]: prev[board[a]] + 1,
        }));

        try {
          const winSound = new Audio("/sounds/win.mp3");
          winSound.volume = 0.5;
          winSound.play();
        } catch (error) {
          console.log("Sound playback failed:", error);
        }

        return;
      }
    }

    if (!board.includes("")) {
      setMessage("It's a draw!");
      setIsGameOver(true);
      setScores((prev) => ({
        ...prev,
        draws: prev.draws + 1,
      }));

      try {
        const drawSound = new Audio("/sounds/draw.mp3");
        drawSound.volume = 0.3;
        drawSound.play();
      } catch (error) {
        console.log("Sound playback failed:", error);
      }
    }
  };

  const resetGame = () => {
    setCells(Array(9).fill(""));
    setGo("X");
    setMessage("");
    setWinner("");
    setIsGameOver(false);
    setWinningCells([]);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const computerMove = () => {
    const emptyCells = cells
      .map((cell, index) => (cell === "" ? index : -1))
      .filter((index) => index !== -1);

    if (emptyCells.length === 0) return;

    let move;

    for (let i of emptyCells) {
      const testBoard = [...cells];
      testBoard[i] = "O";
      if (hasWinner(testBoard, "O")) {
        move = i;
        break;
      }
    }

    if (move === undefined) {
      for (let i of emptyCells) {
        const testBoard = [...cells];
        testBoard[i] = "X";
        if (hasWinner(testBoard, "X")) {
          move = i;
          break;
        }
      }
    }

    if (move === undefined && emptyCells.includes(4)) {
      move = 4;
    }

    if (move === undefined) {
      move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    const newCells = [...cells];
    newCells[move] = "O";
    setCells(newCells);

    checkWinner(newCells);
    setGo("X");
  };

  const hasWinner = (board, player) => {
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

    for (let [a, b, c] of wins) {
      if (board[a] === player && board[b] === player && board[c] === player) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (isGameOver || !isPlayingWithComputer || go === "X") return;

    const timer = setTimeout(() => {
      computerMove();
    }, 500);

    return () => clearTimeout(timer);
  }, [go, isPlayingWithComputer, isGameOver]);

  const toggleComputer = () => {
    setIsPlayingWithComputer((prev) => !prev);
    resetGame();
  };

  const renderIcon = (value, index) => {
    if (value === "X")
      return (
        <FaTimes
          className={`x-icon ${
            winningCells.includes(index) ? "winning-cell" : ""
          }`}
        />
      );
    if (value === "O")
      return (
        <FaRegCircle
          className={`o-icon ${
            winningCells.includes(index) ? "winning-cell" : ""
          }`}
        />
      );
    return null;
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Tic Tac Toe</h2>

      <div className="score-board">
        <div className="score x-score">
          <FaTimes />
          <span>{scores.X}</span>
        </div>
        <div className="score draws">
          <span>Draws</span>
          <span>{scores.draws}</span>
        </div>
        <div className="score o-score">
          <FaRegCircle />
          <span>{scores.O}</span>
        </div>
      </div>

      <div className="status-message">
        {message ? (
          <p className="winner-message">{message}</p>
        ) : (
          <p className="turn-indicator">
            Turn:{" "}
            {go === "X" ? (
              <FaTimes className="icon-sm" />
            ) : (
              <FaRegCircle className="icon-sm" />
            )}
          </p>
        )}
      </div>

      <div className="board">
        {cells.map((cell, index) => (
          <Cell
            key={index}
            value={cell}
            onClick={() => handleClick(index)}
            renderIcon={() => renderIcon(cell, index)}
            isWinningCell={winningCells.includes(index)}
          />
        ))}
      </div>

      {isGameOver && (
        <div className="popup">
          <div className="popup-content">
            {winner ? (
              <h3 className="winner-announcement">
                {winner === "X" ? (
                  <FaTimes className="icon-lg" />
                ) : (
                  <FaRegCircle className="icon-lg" />
                )}
                <FaTrophy className="trophy-icon" />
                <span>WINNER!</span>
              </h3>
            ) : (
              <h3 className="draw-announcement">It's a draw!</h3>
            )}
            <button className="restart-btn" onClick={resetGame}>
              Play Again
            </button>
          </div>
        </div>
      )}

      <div className="button-group">
        <button className="game-btn reset-btn" onClick={resetGame}>
          Reset Board
        </button>
        <button className="game-btn mode-btn" onClick={toggleComputer}>
          {isPlayingWithComputer ? "Two Players" : "vs Computer"}
        </button>
        <button className="game-btn score-reset-btn" onClick={resetScores}>
          Reset Scores
        </button>
      </div>
    </div>
  );
};

export default Tictactoe;
