import { useEffect, useRef, useState } from "react";
import { GiSnake } from "react-icons/gi";
import {
  FaPlay,
  FaPause,
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaKeyboard,
} from "react-icons/fa";

const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 15;
const INITIAL_SNAKE = [[7, 10], [7, 9], [7, 8]];
const INITIAL_DIRECTION = [0, 1];
const EDGE_BUFFER = 1;
const SPEEDS = {
  Easy: 250,
  Medium: 130,
  Hard: 70,
};

const Snake = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState(null);
  const [food, setFood] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("snakeHighScore")) || 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [difficulty, setDifficulty] = useState("Medium");
  const requestRef = useRef();
  const lastUpdateTimeRef = useRef(0);
  const [cellSize, setCellSize] = useState(25);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  function generateFood(snakeBody) {
    let newFood;
    do {
      newFood = [
        EDGE_BUFFER +
          Math.floor(Math.random() * (BOARD_HEIGHT - 2 * EDGE_BUFFER)),
        EDGE_BUFFER +
          Math.floor(Math.random() * (BOARD_WIDTH - 2 * EDGE_BUFFER)),
      ];
    } while (snakeBody.some(([x, y]) => x === newFood[0] && y === newFood[1]));
    return newFood;
  }

  useEffect(() => {
    if (!food) {
      setFood(generateFood(snake));
    }
  }, [food, snake]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 500) {
      setCellSize(Math.min(16, Math.floor((windowWidth - 40) / BOARD_WIDTH)));
    } else if (windowWidth < 768) {
      setCellSize(Math.min(20, Math.floor((windowWidth - 60) / BOARD_WIDTH)));
    } else {
      setCellSize(25);
    }
  }, [windowWidth]);

  const handleKey = (e) => {
    const { key } = e;
    if (key === " ") {
      setPaused((prev) => !prev);
      return;
    }

    const newDir = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
      w: [-1, 0],
      s: [1, 0],
      a: [0, -1],
      d: [0, 1],
    }[key.toLowerCase()];

    if (newDir) {
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
  };

  const touchStart = useRef(null);
  const handleTouchStart = (e) => {
    if (!gameOver) {
      e.preventDefault();
      touchStart.current = [e.touches[0].clientX, e.touches[0].clientY];
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current || gameOver) return;

    e.preventDefault();
    const xEnd = e.changedTouches[0].clientX;
    const yEnd = e.changedTouches[0].clientY;
    const [xStart, yStart] = touchStart.current;

    const dx = xEnd - xStart;
    const dy = yEnd - yStart;

    const minSwipeDistance = 15;

    if (Math.abs(dx) > minSwipeDistance || Math.abs(dy) > minSwipeDistance) {
      if (Math.abs(dx) > Math.abs(dy)) {
        const newDir = dx > 0 ? [0, 1] : [0, -1];
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
        const newDir = dy > 0 ? [1, 0] : [-1, 0];
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
    if (!gameOver) {
      e.preventDefault();
    }
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
        if (food && newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore((prev) => prev + 1);
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
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
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

  const isMobile = windowWidth < 768;
  const buttonSize = isMobile ? "w-14 h-14" : "w-16 h-16";
  const arrowSize = isMobile ? "h-6 w-6" : "h-7 w-7";

  return (
    <div className="text-center pt-4 pb-8 select-none max-w-full px-2">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center justify-center">
        <GiSnake className="mr-2 h-6 w-6 sm:h-8 sm:w-8" /> Snake Game
      </h1>

      <div className="mb-3 text-sm sm:text-base">
        <span className="mr-4">
          Score: <strong>{score}</strong>
        </span>
        <span>
          High Score: <strong>{highScore}</strong>
        </span>
      </div>

      <div className="mb-3">
        <select
          className="border px-2 py-1 rounded bg-white text-sm"
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

      {!isMobile && (
        <div className="flex items-center justify-center mb-3 bg-gray-100 py-2 px-4 rounded-lg shadow-sm">
          <FaKeyboard className="text-gray-700 mr-2" />
          <span className="text-gray-700 font-medium">
            Use{" "}
            <kbd className="bg-white px-2 py-1 rounded border shadow-sm mx-1">
              W
            </kbd>
            <kbd className="bg-white px-2 py-1 rounded border shadow-sm mx-1">
              A
            </kbd>
            <kbd className="bg-white px-2 py-1 rounded border shadow-sm mx-1">
              S
            </kbd>
            <kbd className="bg-white px-2 py-1 rounded border shadow-sm mx-1">
              D
            </kbd>{" "}
            or arrow keys to control the snake
          </span>
        </div>
      )}

      <div
        className="mx-auto relative bg-blue-100 border-2 border-gray-300 shadow-lg rounded-lg overflow-hidden"
        style={{
          width: BOARD_WIDTH * cellSize,
          height: BOARD_HEIGHT * cellSize,
          maxWidth: "100%",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {food && (
          <div
            className="absolute bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: cellSize * 0.8,
              height: cellSize * 0.8,
              left: (food[1] + 0.5) * cellSize,
              top: (food[0] + 0.5) * cellSize,
            }}
          />
        )}

        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={index}
              className={`absolute ${isHead ? "bg-green-700" : "bg-green-500"}`}
              style={{
                width: cellSize,
                height: cellSize,
                left: segment[1] * cellSize,
                top: segment[0] * cellSize,
                zIndex: snake.length - index,
                borderRadius: isHead ? "30%" : "4px",
              }}
            />
          );
        })}

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

      {isMobile && (
        <div className="mt-6 flex flex-col items-center">
          <button
            className={`bg-gray-200 ${buttonSize} rounded-full mb-2 sm:mb-3 flex items-center justify-center shadow-md active:bg-gray-300`}
            onClick={() => handleControlClick([-1, 0])}
          >
            <FaArrowUp className={arrowSize} />
          </button>
          <div className="flex justify-center items-center">
            <button
              className={`bg-gray-200 ${buttonSize} rounded-full mr-3 sm:mr-6 flex items-center justify-center shadow-md active:bg-gray-300`}
              onClick={() => handleControlClick([0, -1])}
            >
              <FaArrowLeft className={arrowSize} />
            </button>

            <button
              className={`p-4 rounded-full text-white shadow mx-2 sm:mx-3 ${
                paused
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
              onClick={() => setPaused(!paused)}
            >
              {paused ? (
                <FaPlay className={arrowSize} />
              ) : (
                <FaPause className={arrowSize} />
              )}
            </button>

            <button
              className={`bg-gray-200 ${buttonSize} rounded-full ml-3 sm:ml-6 flex items-center justify-center shadow-md active:bg-gray-300`}
              onClick={() => handleControlClick([0, 1])}
            >
              <FaArrowRight className={arrowSize} />
            </button>
          </div>
          <button
            className={`bg-gray-200 ${buttonSize} rounded-full mt-2 sm:mt-3 flex items-center justify-center shadow-md active:bg-gray-300`}
            onClick={() => handleControlClick([1, 0])}
          >
            <FaArrowDown className={arrowSize} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Snake;
