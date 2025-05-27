import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheck } from "react-icons/fa";
import { useState } from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);

    setTimeout(() => {
      setClicked(false);
    }, 2000);
  };

  return (
    <footer className="bg-gradient-to-t from-cyan-200/70 to-white-100 py-4 px-4 sm:px-6 md:px-8 lg:px-36 text-left w-full mt-10">
      <div className="flex flex-col md:flex-row items-start justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-32 py-6 sm:py-8 md:py-10 border-b border-white/30">
        <div className="flex flex-col items-center md:items-start w-full">
          <img src={assets.logo} alt="logo" className="w-28 sm:w-32 md:w-36" />
          <p className="text-gray-600 text-xs sm:text-sm text-center md:text-left mt-2 sm:mt-3 px-2 md:px-0">
            Your go-to platform for learning anything, anytime, anywhere.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start w-full">
          <h2 className="font-semibold text-black mb-3 sm:mb-4 text-sm sm:text-base">
            Get in touch
          </h2>
          <ul className="text-xs sm:text-sm text-gray-600 space-y-2 sm:space-y-3 text-center md:text-left">
            <li className="flex items-center justify-center md:justify-start space-x-2 sm:space-x-3">
              <FaMapMarkerAlt className="text-black text-xs sm:text-sm leading-[1.5rem] flex-shrink-0" />
              <span className="break-words">
                01 Upper Kalaklan, Olongapo City
              </span>
            </li>
            <li className="flex items-center justify-center md:justify-start space-x-2">
              <FaPhone className="text-black text-xs sm:text-sm leading-[1.5rem] flex-shrink-0" />
              <a
                href="tel:+639955068344"
                className="hover:text-black break-all"
              >
                +639955068344
              </a>
            </li>
            <li className="flex items-center justify-center md:justify-start space-x-2 sm:space-x-3">
              <FaEnvelope className="text-black text-xs sm:text-sm leading-[1.5rem] flex-shrink-0" />
              <a
                href="mailto:learnify2025@gmail.com"
                className="hover:text-black break-all"
              >
                learnify2025@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col w-full max-w-xs mx-auto md:mx-0 md:max-w-sm">
          <h2 className="font-semibold text-black mb-3 sm:mb-4 text-sm sm:text-base text-center md:text-left">
            Keep yourself updated
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 text-center md:text-left px-2 md:px-0">
            Get updates and special offers directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-500/80 bg-white text-black placeholder-gray-500 outline-none px-2 py-1.5 w-full rounded-md text-xs focus:border-blue-500 transition-colors"
            />
            <button
              onClick={handleClick}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-md transform transition-all duration-300 ease-in-out hover:bg-blue-700 hover:scale-105 hover:shadow-lg text-xs whitespace-nowrap"
            >
              {clicked ? <FaCheck className="mx-auto" /> : "Send"}
            </button>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-black/60 mt-4 sm:mt-6 px-4">
        © 2025 Learnify. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
