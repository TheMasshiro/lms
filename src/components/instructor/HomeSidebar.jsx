import { useContext, useState } from "react";
import { NavLink, useLocation, Navigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

import { AiOutlineHome, AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { BiBook, BiCodeAlt, BiMenu } from "react-icons/bi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsBarChart } from "react-icons/bs";
import { MdPeople, MdLock, MdOutlineVideogameAsset } from "react-icons/md";

const Sidebar = () => {
  const { isEducator, userData } = useContext(AppContext);
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const hasMembership = userData?.isMember;

  const toggleSidebar = () => {
    setIsTransitioning(true);
    setIsExpanded(!isExpanded);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const primaryItems = [
    {
      name: "Home",
      path: "/educator/",
      icon: <AiOutlineHome className="h-6 w-6" />,
      isActive:
        location.pathname.startsWith("/educator") &&
        !location.pathname.startsWith("/educator/progress") &&
        !location.pathname.startsWith("/educator/courses") &&
        !location.pathname.startsWith("/educator/students") &&
        !location.pathname.startsWith("/educator/add-course") &&
        !location.pathname.startsWith("/educator/edit-course"),
    },
  ];

  const secondaryItems = [
    {
      name: "Course Management",
      path: "/educator/courses/",
      icon: <BiBook className="h-6 w-6" />,
      isActive: location.pathname.startsWith("/educator/courses"),
    },
    {
      name: "Student Management",
      path: "/educator/students",
      icon: <MdPeople className="h-6 w-6" />,
      isActive: location.pathname.startsWith("/educator/students"),
    },
    {
      name: "Student Progress",
      path: "/educator/progress",
      icon: <BsBarChart className="h-6 w-6" />,
      isActive: location.pathname.startsWith("/educator/progress"),
    },
  ];

  const tertiaryItems = [
    {
      name: "Add Course",
      path: "/educator/add-course",
      icon: <AiOutlinePlus className="h-6 w-6" />,
      isActive: location.pathname.startsWith("/educator/add-course"),
    },
  ];

  const codeItem = {
    name: "Code Editor",
    path: "/editor",
    icon: <BiCodeAlt className="h-6 w-6" />,
    isActive: location.pathname === "/editor",
    requiresMembership: true,
  };

  const gameItems = {
    name: "Games",
    path: "/getstarted",
    icon: <MdOutlineVideogameAsset className="h-6 w-6" />,
    isActive: location.pathname === "/getstarted",
  };

  const renderNavItem = (item) => {
    if (item.requiresMembership && !hasMembership) {
      return (
        <div
          key={item.name}
          onClick={() =>
            toast.info("Unlock full membership to access the code editor")
          }
          className="group flex items-center py-3 cursor-not-allowed transition relative px-4"
        >
          <div className="relative">
            {item.icon}
            <span className="absolute -top-1 -right-1 text-xs bg-amber-500 text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center">
              <MdLock className="h-3 w-3" />
            </span>
          </div>
          {isExpanded && (
            <span className="ml-3 text-sm font-medium">
              {item.name} (Premium)
            </span>
          )}
          {!isExpanded && !isTransitioning && (
            <span className="absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 delay-300">
              {item.name} (Premium Feature)
            </span>
          )}
        </div>
      );
    }

    return (
      <NavLink
        to={item.path}
        key={item.name}
        end={item.path === "/educator/"}
        className={({ isActive }) =>
          `group flex items-center py-3 hover:bg-gray-100 transition relative px-4 ${
            item.isActive ? "bg-indigo-100 border-r-4 border-indigo-500" : ""
          }`
        }
      >
        <div>{item.icon}</div>
        {isExpanded && (
          <span className="ml-3 text-sm font-medium">{item.name}</span>
        )}
        {!isExpanded && !isTransitioning && (
          <span className="absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 delay-300">
            {item.name}
          </span>
        )}
      </NavLink>
    );
  };

  if (location.pathname === "/editor" && !hasMembership) {
    toast.error("You need a membership to access the code editor");
    return <Navigate to="/educator/" replace />;
  }

  return (
    isEducator && (
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
          {primaryItems.map(renderNavItem)}
          <div className="my-2 border-t border-gray-200 mx-2" />
          {secondaryItems.map(renderNavItem)}
          <div className="my-2 border-t border-gray-200 mx-2" />
          {tertiaryItems.map(renderNavItem)}
          <div className="my-2 border-t border-gray-200 mx-2" />
          {renderNavItem(codeItem)}
          {renderNavItem(gameItems)}
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