import { useState } from "react";
import { Link } from "react-router-dom";
import "../../components/css/GetStarted.css";
import { IoGameController } from "react-icons/io5";
import { FaQuestionCircle, FaTimes } from "react-icons/fa";
import { GiSnake } from "react-icons/gi";
import { TbTicTac } from "react-icons/tb";

const gameList = [
  {
    title: "Quiz",
    icon: <FaQuestionCircle className="h-8 w-8 text-cyan-300" />,
    cardDescription:
      "Test your memory with quick trivia! Fun, challenging, and brain-boosting.",
    modalDescription:
      "Sharpen your thinking with exciting trivia from different categories!",
    moreInfo:
      "The quiz is designed to test your memory, logic, and general knowledge. Whether you're studying or just having fun, it's a great way to boost your brainpower. Expect random topics, from science to pop culture!",
    steps: [
      "Press the Start Quiz button to begin.",
      "Choose the answer that fits best from the given options.",
      "Finish the quiz and click Submit to view your results.",
      "You can retake the quiz anytime to challenge yourself again!",
    ],
    link: "/quiz",
  },
  {
    title: "Tic Tac Toe",
    icon: <TbTicTac className="h-8 w-8 text-cyan-300" />,
    cardDescription:
      "Battle your friend in a quick round of strategy! Line it up and win!",
    modalDescription:
      "Enjoy a strategic game of logic and prediction — classic and competitive.",
    moreInfo:
      "This timeless game is all about thinking ahead and reacting fast. Great for friendly duels or sharpening your pattern recognition. Try playing both roles and discover the best winning tactics!",
    steps: [
      "Start by choosing a square for your move.",
      "Alternate turns with your opponent (X or O).",
      "Try to get 3 symbols in a line before your opponent does.",
      "If the board fills up with no winner, it's a draw!",
    ],
    link: "/tictactoe",
  },
  {
    title: "Snake Game",
    icon: <GiSnake className="h-8 w-8 text-cyan-300" />,
    cardDescription:
      "Classic arcade fun — eat, grow, survive, and don't hit yourself!",
    modalDescription:
      "Boost your reflexes with this classic arcade game — grow your snake and survive!",
    moreInfo:
      "The longer your snake grows, the harder it gets! This game tests your coordination and focus. Compete against yourself to improve your reflexes and set a new personal best every time.",
    steps: [
      "Use ↑ ↓ ← → keys to control your snake.",
      "Eat red dots to grow longer and score higher.",
      "Avoid crashing into the walls or your tail.",
      "Keep playing to beat your high score!",
    ],
    link: "/snake",
  },
];

const GetStarted = () => {
  const [modalContent, setModalContent] = useState(null);

  const handleGameClick = (game) => {
    setModalContent(game);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="p-8 max-w-6xl mx-auto text-slate-900">
        {/* Introductory Information */}
        <div className="intro-section mb-12">
          <h2 className="text-3xl font-semibold text-black">
            How to Get Started
          </h2>
          <p className="text-lg mt-4 text-gray-600">
            Welcome to our fun and interactive game section! Whether you want to
            challenge your brain with a quiz, play a classic game of Tic Tac
            Toe, or try to beat your own high score in the Snake game, you're in
            for a treat.
          </p>
          <p className="text-lg mt-4 text-gray-600">
            To get started, simply choose one of the games below, read the
            instructions, and have fun! Each game offers a unique experience to
            test your skills and strategy.
          </p>
        </div>

        {/* Main Header */}
        <h1 className="text-4xl text-center mb-12 font-bold text-black drop-shadow-lg flex items-center justify-center">
          <IoGameController className="h-10 w-10 mr-3" />
          Choose an Activity
        </h1>

        {/* Game Cards */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {gameList.map((game, index) => (
            <div
              key={index}
              className="game-card bg-slate-800 p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-3">
                {game.icon}
                <h2 className="text-2xl font-semibold ml-2 text-cyan-400">
                  {game.title}
                </h2>
              </div>
              <p className="mb-6 text-slate-300">{game.cardDescription}</p>

              <button
                onClick={() => handleGameClick(game)}
                className="game-button bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-md"
              >
                Learn More
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        {modalContent && (
          <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-lg w-full relative">
              <div className="flex items-center mb-4">
                {modalContent.icon}
                <h2 className="text-3xl font-bold ml-2 text-black">
                  {modalContent.title}
                </h2>
              </div>
              <p className="mb-2 text-slate-700 italic">
                {modalContent.modalDescription}
              </p>
              <p className="mb-4 text-slate-700">{modalContent.moreInfo}</p>

              <ul className="list-disc list-inside text-sm text-slate-600 mb-6 space-y-1">
                {modalContent.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>

              <div className="modal-actions flex justify-between mt-6">
                <Link
                  to={modalContent.link}
                  className="game-button bg-cyan-500 text-white px-6 py-3 rounded-md"
                >
                  Start {modalContent.title}
                </Link>
                <button
                  onClick={closeModal}
                  className="close-modal-button text-red-500 flex items-center"
                >
                  <FaTimes className="h-5 w-5 mr-1" />
                  <span className="text-lg font-semibold">Close</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetStarted;