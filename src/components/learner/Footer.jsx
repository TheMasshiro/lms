import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);

    setTimeout(() => {
      setClicked(false);
    }, 2000);
  };

  return (
    <footer className="bg-gradient-to-t from-cyan-200/70 to-white-100 py-4 md:px-36 text-left w-full mt-10">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30">
        <div className="flex flex-col md:items-start items-center w-full">
          <img src={assets.logo} alt="logo" className="w-36 " />
          <p className="text-gray-600 text-sm text-center md:text-left mt-3">
            Your go-to platform for learning anything, anytime, anywhere.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start w-full">
          <h2 className="font-semibold text-black mb-4">Get in touch</h2>
          <ul className="text-sm text-gray-600 space-y-3">
            <li className="flex items-center space-x-3">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-black text-sm leading-[1.5rem]"
              />
              <span>01 Upper Kalaklan, Olongapo City</span>
            </li>
            <li className="flex items-center space-x-2">
              <FontAwesomeIcon
                icon={faPhoneAlt}
                className="text-black text-sm leading-[1.5rem]"
              />
              <a href="tel:+639955068344" className="hover:text-black">
                +639955068344
              </a>
            </li>
            <li className="flex items-center space-x-3">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-black text-sm leading-[1.5rem]"
              />
              <a
                href="mailto:learnify2025@gmail.com"
                className="hover:text-black"
              >
                learnify2025@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div className="hidden md:flex flex-col w-full">
          <h2 className="font-semibold text-black mb-4">
            Keep yourself updated
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Get updates and special offers directly in your inbox.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-500/80 bg-white-800 text-black-200 placeholder-gray-500 outline-none px-3 py-2 w-full rounded-md text-sm"
            />
            <button
              onClick={handleClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-md transform transition-all duration-300 ease-in-out hover:bg-blue-700 hover:scale-105 hover:shadow-lg"
            >
              {clicked ? "✓" : "Send"}
            </button>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-black/60 mt-6">
        © 2025 Learnify. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
