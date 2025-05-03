import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/learner/dashboard_navbar";
import Sidebar from "../../components/learner/sidebar";
import Footer from "../../components/instructor/footer";

const student = () => {
  return (
    <div className="text-default min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">{<Outlet />}</div>
      </div>
      <Footer />
    </div>
  );
};

export default student;
