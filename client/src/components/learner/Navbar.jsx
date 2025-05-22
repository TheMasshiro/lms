import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import "../css/Navbar.css";
import { FaCog, FaLock, FaSignInAlt, FaTimes, FaBars } from "react-icons/fa";
import { IoSchool, IoPersonAdd } from "react-icons/io5";
import { BiAward } from "react-icons/bi";
import { FiX } from "react-icons/fi";

const Navbar = () => {
  const { navigate, isEducator, userData, getToken, backendUrl } =
    useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const hasRole = user && user.publicMetadata && user.publicMetadata.role;

  const purchaseAccess = async () => {
    try {
      if (!userData) {
        return toast.warn("Please login to purchase access");
      }

      if (userData.isMember) {
        return toast.warn("You already have access");
      }

      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/purchase",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const menuItems = !user
    ? [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Contact Us", path: "/contacts" },
        { name: "Privacy Policy", path: "/privacy" },
      ]
    : [];

  const handleClick = () => {
    if (isEducator) {
      navigate("/settings/educator");
    } else {
      navigate("/settings/student");
    }
  };

  const dashboardLabel = isEducator ? "Educator" : "Student";

  return (
    <div className="bg-cyan-100 border-b border-gray-300 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center">
          <img
            onClick={() => navigate("/")}
            src={assets.logo}
            alt="Logo"
            className="h-10 cursor-pointer hover:scale-105 transition-transform duration-200"
          />
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              className={({ isActive }) => `
                text-sm font-medium transition-all duration-200 hover:text-blue-700 
                relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] 
                after:bg-blue-600 after:transition-all after:duration-300
                ${isActive ? 
                  "text-blue-700 after:w-full" : 
                  "text-gray-700 after:w-0 hover:after:w-full"}
              `}
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {!userData?.isMember && user && hasRole && (
            <button
              onClick={openModal}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium transform hover:-translate-y-0.5"
            >
              Unlock Full Access
            </button>
          )}

          {user && hasRole && (
            <button
              onClick={handleClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium flex items-center transform hover:-translate-y-0.5"
            >
              <FaCog className="h-4 w-4 mr-1.5 transition-transform duration-300 group-hover:rotate-45" />
              {dashboardLabel}
            </button>
          )}

          {user ? (
            <div className="transform hover:scale-105 transition-transform duration-200">
              <UserButton />
            </div>
          ) : (
            <button
              onClick={() => openSignIn()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium flex items-center transform hover:-translate-y-0.5 group"
            >
              <FaSignInAlt className="h-4 w-4 mr-1.5 transition-transform duration-300 group-hover:translate-x-1" />
              Sign In
            </button>
          )}
        </div>

        <div className="md:hidden flex items-center space-x-3">
          {!userData?.isMember && user && hasRole && (
            <button
              onClick={openModal}
              className="p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-110"
            >
              <FaLock className="h-5 w-5" />
            </button>
          )}

          {user && hasRole && (
            <button
              onClick={handleClick}
              className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
            >
              <FaCog className="h-5 w-5" />
            </button>
          )}

          {user ? (
            <div className="transform hover:scale-110 transition-transform duration-200">
              <UserButton />
            </div>
          ) : (
            <button
              onClick={() => openSignIn()}
              className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
            >
              <FaSignInAlt className="h-5 w-5" />
            </button>
          )}

          {menuItems.length > 0 && (
            <button
              onClick={toggleMobileMenu}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:text-gray-900"
            >
              {isMobileMenuOpen ? (
                <FaTimes 
                  className="h-6 w-6 transition-transform duration-300"
                  style={{ 
                    transform: isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)'
                  }}
                />
              ) : (
                <FaBars
                  className="h-6 w-6 transition-transform duration-300"
                  style={{ 
                    transform: isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)'
                  }}
                />
              )}
            </button>
          )}
        </div>
      </div>

      <div 
        className={`md:hidden border-t border-gray-200 bg-white shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              className={({ isActive }) => `
                block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:translate-x-1 transform"
                }
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[100] p-4"
          onClick={closeModal}
        >
          <div 
            className="absolute inset-0 bg-black backdrop-fade-in" 
          />
          
          <div
            className="bg-white rounded-xl overflow-hidden shadow-2xl relative z-10 max-w-md w-full mx-4 modal-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  {isEducator ? "Educator Membership" : "Student Membership"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-white bg-white/30 rounded-full p-1.5 hover:bg-white/40 transition-all duration-200 hover:rotate-90 transform"
                  aria-label="Close modal"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <div 
                className="mt-4 inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white slide-in-right"
              >
                <span className="text-sm font-medium mr-2">Price</span>
                <span className="text-2xl font-bold">
                  {isEducator ? "₱199" : "₱99"}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6 fade-in-up-delay-1">
                {isEducator ? (
                  <>
                    <div className="flex items-start mb-4">
                      <div className="bg-blue-100 p-1.5 rounded-full mr-3 mt-0.5">
                        <BiAward className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">Unlimited Courses</h3>
                        <p className="text-gray-600">Create as many courses as you want with no restrictions</p>
                      </div>
                    </div>
                    <div className="flex items-start mb-4">
                      <div className="bg-blue-100 p-1.5 rounded-full mr-3 mt-0.5">
                        <IoPersonAdd className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">Unlimited Students</h3>
                        <p className="text-gray-600">Add as many students as you need to your courses</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start mb-4">
                      <div className="bg-green-100 p-1.5 rounded-full mr-3 mt-0.5">
                        <IoSchool className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">Full Course Access</h3>
                        <p className="text-gray-600">Join any course of your choice without limitations</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-100 p-1.5 rounded-full mr-3 mt-0.5">
                        <BiAward className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">Premium Features</h3>
                        <p className="text-gray-600">Get access to all premium learning tools and features</p>
                      </div>
                    </div>
                  </>
                )}

                <div 
                  className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6 fade-in-up-delay-2"
                >
                  <p className="text-blue-800 font-medium">
                    Would you like to unlock full access and enhance your {isEducator ? "teaching" : "learning"} experience?
                  </p>
                </div>
                
                <div 
                  className="flex justify-end gap-3 mt-6 fade-in-up-delay-3"
                >
                  <button
                    onClick={closeModal}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium focus:outline-none hover:shadow"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      closeModal();
                      purchaseAccess();
                      toast.info("Redirecting to payment...");
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:from-blue-600 hover:to-cyan-500 transition-all duration-200 font-medium focus:outline-none hover:shadow-lg transform active:scale-95 hover:scale-105"
                  >
                    Confirm Purchase
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;