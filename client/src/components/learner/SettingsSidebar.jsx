import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

import { AiOutlineClose } from "react-icons/ai";
import { BiMenu } from "react-icons/bi";
import { FaChevronLeft, FaChevronRight, FaShieldAlt, FaUser } from "react-icons/fa";
import { MdOutlineContactSupport, MdOutlineInfo } from "react-icons/md";

const Sidebar = () => {
  const { isStudent } = useContext(AppContext);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleSidebar = () => {
    setIsTransitioning(true);
    setIsExpanded(!isExpanded);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const primaryItems = [
    {
      name: "Personal Info",
      path: "/settings/student",
      icon: <FaUser className="h-5 w-5" />,
    },
  ];

  const privacyItem = {
    name: "Privacy Policy",
    path: "/privacy",
    icon: <FaShieldAlt className="h-5 w-5" />,
  };

  const contactItem = {
    name: "Contact Us",
    path: "/contacts",
    icon: <MdOutlineContactSupport className="h-5 w-5" />,
  };

  const aboutItem = {
    name: "About Us",
    path: "/about",
    icon: <MdOutlineInfo className="h-5 w-5" />,
  };

  const renderNavItem = (item) => (
    <NavLink
      to={item.path}
      key={item.name}
      end={item.path === "/settings/student"}
      className={({ isActive }) =>
        `group flex items-center py-3 hover:bg-gray-100 transition relative px-4 ${
          isActive ? "bg-indigo-100 border-r-4 border-indigo-500" : ""
        }`
      }
    >
      <div>{item.icon}</div>
      {isExpanded ? (
        <span className="ml-3 text-sm font-medium">{item.name}</span>
      ) : (
        !isTransitioning && (
          <span className="absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 delay-300">
            {item.name}
          </span>
        )
      )}
    </NavLink>
  );

  return (
    isStudent && (
      <div
        className={`${
          isExpanded ? "w-64" : "w-16"
        } border-r min-h-screen border-gray-300 flex flex-col justify-between py-4 bg-white transition-all duration-300 ease-in-out`}
      >
        <div>
          <div className="flex justify-end px-4 mb-4">
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-gray-200 transition"
            >
              {isExpanded ? (
                <FaChevronLeft className="h-5 w-5" />
              ) : (
                <FaChevronRight className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex flex-col">
            {primaryItems.map(renderNavItem)}
            <div className="my-2 border-t border-gray-200 mx-2"></div>
            {renderNavItem(privacyItem)}
            {renderNavItem(contactItem)}
            {renderNavItem(aboutItem)}
          </div>
        </div>

        <div className="block md:hidden fixed bottom-4 right-4 z-50">
          <button
            onClick={toggleSidebar}
            className="bg-indigo-600 text-white p-3 rounded-full shadow-lg"
          >
            {isExpanded ? (
              <AiOutlineClose className="h-6 w-6" />
            ) : (
              <BiMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    )
  );
};

export default Sidebar;
