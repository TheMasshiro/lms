import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import Loading from "./Loading";

const Navbar = () => {
  const { navigate, isEducator } = useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const location = useLocation();
  const [delayLoad, setDelayLoad] = useState(null);

  const isCourseListPage = location.pathname.includes("/course-list");

  const menuItems = user
    ? [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Contact Us", path: "/contacts" },
        { name: "Privacy Policy", path: "/privacy" },
      ];

  const handleClick = () => {
    if (isEducator) {
      navigate("/educator");
    } else {
      navigate("/student");
    }
  };

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setDelayLoad(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const dashboardLabel = isEducator ? "Educator Dashboard" : "Student Dashboard";

  return user && delayLoad ? (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-20 border-b border-gray-500 py-4 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      <div className="flex items-center">
        {/* Logo */}
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="Logo"
          className="w-28 lg:w-32 mx-5 cursor-pointer"
        />

        {/* Menu Items */}
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            className={({ isActive, isPending }) => {
              const isInEducatorSection =
                window.location.pathname.startsWith("/educator");
              const activeState =
                item.path === "/educator" ? isInEducatorSection : isActive;

              return `flex items-center md:flex-row flex-col md:justify-start justify-center py-2 md:px-4 gap-3 hover:text-black ${
                activeState ? "text-black" : "text-gray-500"
              }`;
            }}
          >
            <p className="md:block hidden text-center">{item.name}</p>
          </NavLink>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-3 leading-tight">
          {user && (
            <>
              <button
                className="text-gray-500 hover:text-black"
                onClick={handleClick}
              >
                {dashboardLabel}
              </button>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="relative w-[100px] h-[45px] bg-blue-600 flex justify-center items-center rounded-lg z-10 text-white text-1xl transition-all transform hover:scale-105 hover:shadow-lg hover:rounded-2xl"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Phone Layout */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
              <button onClick={handleClick}>
                {dashboardLabel}
              </button>{" "}
              |
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="" />
          </button>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Navbar;
