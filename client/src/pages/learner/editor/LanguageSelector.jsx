import { useState, useRef, useEffect } from "react";
import {
  FaCode,
  FaChevronDown,
  FaJava,
  FaPython,
  FaPhp,
  FaJs,
} from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { DiVisualstudio } from "react-icons/di";
import { LANGUAGE_VERSIONS } from "./configs/constants";

const languageIcons = {
  javascript: FaJs,
  typescript: SiTypescript,
  python: FaPython,
  java: FaJava,
  csharp: DiVisualstudio,
  php: FaPhp,
};

const languageGroups = {
  Web: ["javascript", "typescript", "php"],
  General: ["python", "java", "csharp"],
};

const getLanguageColor = (lang) => {
  const colors = {
    javascript: "yellow",
    typescript: "blue",
    python: "blue",
    java: "orange",
    csharp: "purple",
    php: "indigo",
  };
  return colors[lang.toLowerCase()] || "green";
};

const tailwindColorMap = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    hover: "hover:bg-blue-100",
    hoverText: "hover:text-blue-700",
    border: "border-blue-300",
    badge: "bg-blue-100 text-blue-800",
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    hover: "hover:bg-yellow-100",
    hoverText: "hover:text-yellow-700",
    border: "border-yellow-300",
    badge: "bg-yellow-100 text-yellow-800",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    hover: "hover:bg-orange-100",
    hoverText: "hover:text-orange-700",
    border: "border-orange-300",
    badge: "bg-orange-100 text-orange-800",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    hover: "hover:bg-purple-100",
    hoverText: "hover:text-purple-700",
    border: "border-purple-300",
    badge: "bg-purple-100 text-purple-800",
  },
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    hover: "hover:bg-indigo-100",
    hoverText: "hover:text-indigo-700",
    border: "border-indigo-300",
    badge: "bg-indigo-100 text-indigo-800",
  },
  gray: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    hover: "hover:bg-gray-100",
    hoverText: "hover:text-gray-700",
    border: "border-gray-300",
    badge: "bg-gray-100 text-gray-800",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-700",
    hover: "hover:bg-green-100",
    hoverText: "hover:text-green-700",
    border: "border-green-300",
    badge: "bg-green-100 text-green-800",
  },
};

const LanguageSelector = ({ language = "javascript", onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const categories = Object.keys(languageGroups);

  const allLanguages = Object.keys(LANGUAGE_VERSIONS);
  const categorizedLangs = Object.values(languageGroups).flat();
  const otherLangs = allLanguages.filter(
    (lang) => !categorizedLangs.includes(lang)
  );

  if (otherLangs.length > 0) {
    languageGroups["Other"] = otherLangs;
    if (!categories.includes("Other")) {
      categories.push("Other");
    }
  }

  const colorClasses = tailwindColorMap[getLanguageColor(language)];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      if (window.innerWidth < 768) {
        document.body.style.overflow = "hidden";
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSelectLanguage = (lang) => {
    onSelect(lang);
    setIsOpen(false);
  };

  const LanguageIcon = languageIcons[language.toLowerCase()] || FaCode;

  return (
    <div className="mb-4 relative max-w-sm mx-auto lg:mx-0">
      <div className="flex items-center mb-2">
        <FaCode className="mr-1 sm:mr-2 text-gray-600 text-sm sm:text-base" />
        <span className="text-sm sm:text-md font-medium text-gray-700">
          Programming Language
        </span>
      </div>

      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border ${colorClasses.border} rounded-md bg-gray-50 ${colorClasses.hover} transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 touch-manipulation`}
          aria-label="Select programming language"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center min-w-0 flex-1">
            {LanguageIcon && (
              <LanguageIcon className={`mr-1 sm:mr-2 ${colorClasses.text} flex-shrink-0 text-sm sm:text-base`} />
            )}
            <span className="text-gray-700 truncate">{language}</span>
            <span
              className={`ml-1 sm:ml-2 px-1 sm:px-2 py-0.5 text-xs font-medium rounded-full ${colorClasses.badge} hidden sm:inline-block`}
            >
              {LANGUAGE_VERSIONS[language.toLowerCase()]}
            </span>
          </div>
          <FaChevronDown
            className={`ml-1 sm:ml-2 transition-transform text-gray-600 flex-shrink-0 text-xs sm:text-sm ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsOpen(false)} />
            
            <div
              ref={menuRef}
              className={`absolute z-50 mt-2 bg-white rounded-md shadow-lg border border-gray-300 overflow-hidden
                ${window.innerWidth >= 768 
                  ? 'w-80 max-h-96 overflow-y-auto' 
                  : 'fixed inset-x-4 top-1/2 transform -translate-y-1/2 max-h-[70vh] overflow-y-auto w-auto'
                }`}
              role="listbox"
            >
              <div className="md:max-h-none md:overflow-visible max-md:max-h-[60vh] max-md:overflow-y-auto">
                <div className="p-2 sm:p-3">
                  <div className="md:hidden mb-3 pb-2 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 text-center">Select Language</h2>
                  </div>
                  
                  {categories.map((category, index) => (
                    <div key={category}>
                      {index > 0 && <hr className="my-2 border-gray-200" />}

                      <h3 className="px-2 sm:px-3 py-1 sm:py-2 text-xs font-bold text-gray-600 uppercase tracking-wider">
                        {category}
                      </h3>

                      <div className="grid grid-cols-1 gap-1">
                        {languageGroups[category].map((lang) => {
                          if (!LANGUAGE_VERSIONS[lang]) return null;

                          const isActive = lang.toLowerCase() === language.toLowerCase();
                          const langColor = getLanguageColor(lang);
                          const langColorClasses = tailwindColorMap[langColor];
                          const LangIcon = languageIcons[lang.toLowerCase()] || FaCode;

                          return (
                            <button
                              key={lang}
                              className={`flex items-center w-full px-2 sm:px-3 py-2 sm:py-3 text-sm rounded-md my-0.5 touch-manipulation 
                                ${window.innerWidth < 768 ? 'min-h-[44px]' : 'min-h-[32px]'} 
                                ${isActive
                                  ? `${langColorClasses.bg} ${langColorClasses.text} ring-2 ring-blue-300`
                                  : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                                } transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                              onClick={() => handleSelectLanguage(lang)}
                              role="option"
                              aria-selected={isActive}
                            >
                              {LangIcon && (
                                <LangIcon
                                  className={`mr-2 sm:mr-3 flex-shrink-0 text-base sm:text-lg ${
                                    isActive ? langColorClasses.text : "text-gray-600"
                                  }`}
                                />
                              )}

                              <div className="flex justify-between w-full items-center min-w-0">
                                <span className="font-medium truncate">{lang}</span>
                                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                  {LANGUAGE_VERSIONS[lang]}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="md:hidden p-3 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 px-4 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 active:bg-gray-800 transition-colors duration-200 min-h-[44px]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
