import { useContext, useState, useEffect } from "react";
import { Navigate, NavLink, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

import { AiOutlineClose, AiOutlineHome } from "react-icons/ai";
import { BiCodeAlt, BiMenu } from "react-icons/bi";
import { BsBarChart } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { MdLock, MdOutlineVideogameAsset } from "react-icons/md";

const Sidebar = () => {
    const { isStudent, userData } = useContext(AppContext);
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const hasMembership = userData?.isMember;

    useEffect(() => {
        const checkIsMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setIsExpanded(false);
            }
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    useEffect(() => {
        if (isMobile && isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobile, isExpanded]);

    const toggleSidebar = () => {
        setIsTransitioning(true);
        setIsExpanded(!isExpanded);
        setTimeout(() => {
            setIsTransitioning(false);
        }, 300);
    };

    const handleNavClick = () => {
        if (isMobile) {
            setIsExpanded(false);
        }
    };

    const primaryItems = [
        {
            name: "Home",
            path: "/student/",
            icon: <AiOutlineHome className="h-6 w-6" />,
            isActive:
                location.pathname.startsWith("/student") &&
                !location.pathname.startsWith("/student/progress") &&
                !location.pathname.startsWith("/student/courses"),
        },
    ];

    const secondaryItems = [
        {
            name: "Progress",
            path: "/student/progress",
            icon: <BsBarChart className="h-6 w-6" />,
            isActive: location.pathname.startsWith("/student/progress"),
        },
        {
            name: "Courses",
            path: "/student/courses/",
            icon: <GiBookshelf className="h-6 w-6" />,
            isActive: location.pathname.startsWith("/student/courses"),
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
        path: "/get-started",
        icon: <MdOutlineVideogameAsset className="h-6 w-6" />,
        isActive: location.pathname === "/get-started",
    };

    const renderNavItem = (item) => {
        if (item.requiresMembership && !hasMembership) {
            return (
                <div
                    key={item.name}
                    onClick={() => {
                        toast.info("Unlock full membership to access the code editor");
                        handleNavClick();
                    }}
                    className="group flex items-center py-3 cursor-not-allowed transition relative px-4"
                >
                    <div className="relative">
                        {item.icon}
                        <span className="absolute -top-1 -right-1 text-xs bg-amber-500 text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center">
                            <MdLock className="h-3 w-3" />
                        </span>
                    </div>
                    {(isExpanded || isMobile) && (
                        <span className="ml-3 text-sm font-medium">
                            {item.name} (Premium)
                        </span>
                    )}
                    {!isExpanded && !isTransitioning && !isMobile && (
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
                end={item.path === "/student/"}
                onClick={handleNavClick}
                className={({ isActive }) =>
                    `group flex items-center py-3 hover:bg-gray-100 transition relative px-4 ${item.isActive ? "bg-indigo-100 border-r-4 border-indigo-500" : ""
                    }`
                }
            >
                <div>{item.icon}</div>
                {(isExpanded || isMobile) && (
                    <span className="ml-3 text-sm font-medium">{item.name}</span>
                )}
                {!isExpanded && !isTransitioning && !isMobile && (
                    <span className="absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 delay-300">
                        {item.name}
                    </span>
                )}
            </NavLink>
        );
    };

    if (location.pathname === "/editor" && !hasMembership) {
        toast.error("You need a membership to access the code editor");
        return <Navigate to="/student/" replace />;
    }

    return (
        isStudent && (
            <>
                {isMobile && isExpanded && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsExpanded(false)}
                    />
                )}

                <div
                    className={`
                        ${isMobile
                            ? `fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
                                isExpanded ? 'translate-x-0' : '-translate-x-full'
                              } w-64`
                            : `${isExpanded ? "w-64" : "w-16"} transition-all duration-300 ease-in-out`
                        }
                        border-r min-h-screen border-gray-300 flex flex-col justify-between py-4 bg-white
                    `}
                >
                    <div>
                        <div className="flex justify-end px-4 mb-4">
                            <button
                                onClick={toggleSidebar}
                                className="p-1 rounded-md hover:bg-gray-200 transition"
                            >
                                {isExpanded || isMobile ? (
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
                        {renderNavItem(codeItem)}
                        {renderNavItem(gameItems)}
                    </div>
                </div>

                {isMobile && (
                    <button
                        onClick={toggleSidebar}
                        className="fixed bottom-4 right-4 z-30 bg-indigo-600 text-white p-3 rounded-full shadow-lg"
                    >
                        <BiMenu className="h-6 w-6" />
                    </button>
                )}
            </>
        )
    );
};

export default Sidebar;
