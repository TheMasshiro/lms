import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { UserButton, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

const navbar = () => {
  const { isEducator, setIsEducator, backendUrl, getToken, navigate } =
    useContext(AppContext);
  const { user } = useUser();

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }

      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/update-role",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
        navigate("/educator");
        return;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    !isEducator &&
    user && (
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <img src={assets.logo} alt="Logo" className="w-28 lg:w-32" />
          </Link>
          <button
            onClick={becomeEducator}
            className="text-gray-500 hover:text-black"
          >
            Become Educator
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-5 text-gray-500 relative">
          <p>Hi! {user.fullName}</p>
          <UserButton />
        </div>
      </div>
    )
  );
};

export default navbar;
