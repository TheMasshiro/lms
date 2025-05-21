import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const CallToAction = () => {
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsClicked(true);
    navigate("/learnmore");
  };

  return (
    <div className="flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0">
      <h1 className="md:text-4xl text-xl text-gray-800 font-semibold">
        Learn anything, anytime, anywhere
      </h1>
      <p className="text-gray-500 sm:text-sm">
        Empower yourself through flexible, engaging, and practical online
        learning. Discover new skills and unlock your full potential—anytime,
        anywhere.
      </p>
      <div className="flex items-center font-medium gap-6 mt-4">
        <a
          href="/getstarted"
          className="px-10 py-3 rounded-md text-white bg-blue-600 transition-all duration-300 ease-in-out hover:bg-blue-700 hover:scale-105"
        >
          Games
        </a>

        <button
          onClick={handleClick}
          className="flex items-center gap-2 px-6 py-3 rounded-md text-blue-600 border transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white hover:scale-105"
        >
          Learn more
          {!isClicked && (
            <FaArrowRight
              className={`transition-all duration-300 ease-in-out ${
                isClicked ? "opacity-0 scale-90" : "opacity-100 scale-100"
              }`}
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default CallToAction;
