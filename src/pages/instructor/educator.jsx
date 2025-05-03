import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/instructor/navbar";
import Sidebar from "../../components/instructor/sidebar";
import Footer from "../../components/instructor/footer";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/learner/Loading";

const educator = () => {
  const { isEducator } = useContext(AppContext);

  return isEducator ? (
    <div className="text-default min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">{<Outlet />}</div>
      </div>
      <Footer />
    </div>
  ) : (
    <Loading />
  );
};

export default educator;
