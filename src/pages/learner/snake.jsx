import React, { useState, useEffect, useRef } from "react";

// Landscape dimensions with larger size
const BOARD_WIDTH = 30;
const BOARD_HEIGHT = 15;
const CELL_SIZE = 25; // Larger cells for bigger game
const INITIAL_SNAKE = [[7, 12]]; // Starting position adjusted for landscape board
const INITIAL_DIRECTION = [0, 1];
const EDGE_BUFFER = 1; // Buffer to keep food away from edges
const SPEEDS = {
  Easy: 250,
  Medium: 130,
  Hard: 70,
};

const snake = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState(null); // For smoother control
  const [food, setFood] = useState(generateFood(INITIAL_SNAKE));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("snakeHighScore")) || 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [difficulty, setDifficulty] = useState("Medium");
  const requestRef = useRef();
  const lastUpdateTimeRef = useRef(0);

  function generateFood(snake) {
    let newFood;
    do {
      // Generate food away from edges using EDGE_BUFFER
      newFood = [
        EDGE_BUFFER +
          Math.floor(Math.random() * (BOARD_HEIGHT - 2 * EDGE_BUFFER)),
        EDGE_BUFFER +
          Math.floor(Math.random() * (BOARD_WIDTH - 2 * EDGE_BUFFER)),
      ];
    } while (snake.some(([x, y]) => x === newFood[0] && y === newFood[1]));
    return newFood;
  }

  const handleKey = (e) => {
    const { key } = e;
    if (key === " ") {
      setPaused(!paused);
      return;
    }

    const newDir = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
      w: [-1, 0], // WASD support
      s: [1, 0],
      a: [0, -1],
      d: [0, 1],
    }[key.toLowerCase()];

    if (newDir) {
      // Check if the new direction is valid (not opposite to current direction)
      if (
        snake.length <= 1 ||
        !(
          snake[0][0] + newDir[0] === snake[1][0] &&
          snake[0][1] + newDir[1] === snake[1][1]
        )
      ) {
        setNextDirection(newDir); // Queue the next direction
      }
    }
  };

  const touchStart = useRef(null);
  const handleTouchStart = (e) => {
    e.preventDefault(); // Prevent scrolling while playing
    touchStart.current = [e.touches[0].clientX, e.touches[0].clientY];
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;

    e.preventDefault();
    const xEnd = e.changedTouches[0].clientX;
    const yEnd = e.changedTouches[0].clientY;
    const [xStart, yStart] = touchStart.current;

    const dx = xEnd - xStart;
    const dy = yEnd - yStart;

    // Minimum swipe distance to register as a directional change
    const minSwipeDistance = 30;

    if (Math.abs(dx) > minSwipeDistance || Math.abs(dy) > minSwipeDistance) {
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        const newDir = dx > 0 ? [0, 1] : [0, -1]; // Right or Left
        if (
          snake.length <= 1 ||
          !(
            snake[0][0] + newDir[0] === snake[1][0] &&
            snake[0][1] + newDir[1] === snake[1][1]
          )
        ) {
          setNextDirection(newDir);
        }
      } else {
        // Vertical swipe
        const newDir = dy > 0 ? [1, 0] : [-1, 0]; // Down or Up
        if (
          snake.length <= 1 ||
          !(
            snake[0][0] + newDir[0] === snake[1][0] &&
            snake[0][1] + newDir[1] === snake[1][1]
          )
        ) {
          setNextDirection(newDir);
        }
      }
    }

    touchStart.current = null;
  };

  const handleTouchMove = (e) => {
    // Prevent scrolling while touching the game area
    e.preventDefault();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [snake, paused]);

  const updateGame = (timestamp) => {
    if (gameOver || paused) {
      requestRef.current = requestAnimationFrame(updateGame);
      return;
    }

    const currentSpeed = SPEEDS[difficulty];

    if (timestamp - lastUpdateTimeRef.current >= currentSpeed) {
      lastUpdateTimeRef.current = timestamp;

      setSnake((prevSnake) => {
        // Apply the queued direction change if available
        let currentDirection = direction;
        if (nextDirection) {
          currentDirection = nextDirection;
          setDirection(nextDirection);
          setNextDirection(null);
        }

        const newHead = [
          prevSnake[0][0] + currentDirection[0],
          prevSnake[0][1] + currentDirection[1],
        ];

        const hitWall =
          newHead[0] < 0 ||
          newHead[0] >= BOARD_HEIGHT ||
          newHead[1] < 0 ||
          newHead[1] >= BOARD_WIDTH;

        const hitSelf = prevSnake.some(
          ([x, y]) => x === newHead[0] && y === newHead[1]
        );

        if (hitWall || hitSelf) {
          setGameOver(true);
          if (score > highScore) {
            localStorage.setItem("snakeHighScore", score);
            setHighScore(score);
          }
          return prevSnake;
        }

        let newSnake = [newHead, ...prevSnake];
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore(score + 1);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }

    requestRef.current = requestAnimationFrame(updateGame);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(requestRef.current);
  }, [
    direction,
    food,
    gameOver,
    score,
    highScore,
    paused,
    difficulty,
    nextDirection,
  ]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(null);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setPaused(false);
    lastUpdateTimeRef.current = 0;
  };

  // Create virtual control buttons for mobile play
  const handleControlClick = (newDir) => {
    if (
      snake.length <= 1 ||
      !(
        snake[0][0] + newDir[0] === snake[1][0] &&
        snake[0][1] + newDir[1] === snake[1][1]
      )
    ) {
      setNextDirection(newDir);
    }
  };

  return (
    <div className="text-center mt-6 select-none">
      <h1 className="text-3xl font-bold mb-2">🐍 Snake Game</h1>

      <div className="mb-4">
        <span className="mr-6">
          Score: <strong>{score}</strong>
        </span>
        <span>
          High Score: <strong>{highScore}</strong>
        </span>
      </div>

      <div className="mb-4">
        <select
          className="border px-2 py-1 rounded bg-white"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          disabled={!gameOver && score > 0}
        >
          {Object.keys(SPEEDS).map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <div
        className="mx-auto relative bg-blue-100 border-2 border-gray-300 shadow-lg rounded-lg overflow-hidden"
        style={{
          width: BOARD_WIDTH * CELL_SIZE,
          height: BOARD_HEIGHT * CELL_SIZE,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Food - Keep this circular */}
        <div
          className="absolute bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{
            width: CELL_SIZE * 0.8,
            height: CELL_SIZE * 0.8,
            left: (food[1] + 0.5) * CELL_SIZE,
            top: (food[0] + 0.5) * CELL_SIZE,
          }}
        />

        {/* Snake - Now using square segments without gaps */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={index}
              className={`absolute ${isHead ? "bg-green-700" : "bg-green-500"}`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                left: segment[1] * CELL_SIZE,
                top: segment[0] * CELL_SIZE,
                zIndex: snake.length - index,
              }}
            />
          );
        })}

        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-2">Game Over!</h2>
              <p className="mb-4">Your score: {score}</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                onClick={resetGame}
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Virtual Controls for Mobile */}
      <div className="mt-6 flex flex-col items-center">
        <button
          className="bg-gray-200 w-12 h-12 rounded-full mb-2 flex items-center justify-center"
          onClick={() => handleControlClick([-1, 0])}
        >
          <span className="transform -translate-y-1">▲</span>
        </button>
        <div className="flex justify-center items-center">
          <button
            className="bg-gray-200 w-12 h-12 rounded-full mr-4 flex items-center justify-center"
            onClick={() => handleControlClick([0, -1])}
          >
            <span className="transform -translate-x-1">◀</span>
          </button>

          <button
            className={`px-4 py-2 rounded text-white shadow mx-2 ${
              paused
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
            onClick={() => setPaused(!paused)}
          >
            {paused ? "Resume" : "Pause"}
          </button>

          <button
            className="bg-gray-200 w-12 h-12 rounded-full ml-4 flex items-center justify-center"
            onClick={() => handleControlClick([0, 1])}
          >
            <span className="transform translate-x-1">▶</span>
          </button>
        </div>
        <button
          className="bg-gray-200 w-12 h-12 rounded-full mt-2 flex items-center justify-center"
          onClick={() => handleControlClick([1, 0])}
        >
          <span className="transform translate-y-1">▼</span>
        </button>
      </div>
    </div>
  );
};

export default snake;
