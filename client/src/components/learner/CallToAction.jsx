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
        <div className="flex flex-col items-center gap-4 sm:gap-6 pt-10 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-8 lg:px-0 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-800 font-semibold max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl leading-tight">
                Learn anything, anytime, anywhere
            </h1>
            <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl leading-relaxed">
                Empower yourself through flexible, engaging, and practical online
                learning. Discover new skills and unlock your full potential—anytime,
                anywhere.
            </p>
            <div className="flex flex-col sm:flex-row items-center font-medium gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 w-full sm:w-auto">
                <a
                    href="/get-started"
                    className="w-full sm:w-auto px-8 sm:px-10 py-3 rounded-md text-white bg-blue-600 transition-all duration-300 ease-in-out hover:bg-blue-700 hover:scale-105 text-center text-sm sm:text-base"
                >
                    Games
                </a>

                <button
                    onClick={handleClick}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-md text-blue-600 border border-blue-600 transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white hover:scale-105 text-sm sm:text-base"
                >
                    Learn more
                    {!isClicked && (
                        <FaArrowRight
                            className={`transition-all duration-300 ease-in-out w-3 h-3 sm:w-4 sm:h-4 ${isClicked ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
                        />
                    )}
                </button>
            </div>
        </div>
    );
};

export default CallToAction;
