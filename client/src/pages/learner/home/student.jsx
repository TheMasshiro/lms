import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../../components/instructor/footer";
import Sidebar from "../../../components/learner/HomeSidebar";
import Loading from "../../../components/learner/Loading";
import { AppContext } from "../../../context/AppContext";

const StudentHome = () => {
  const { isStudent, navigate } = useContext(AppContext);

  useEffect(() => {
    const { pathname } = location;

    if (pathname === "/" && isStudent) {
      navigate("/student/");
    } else if (!isStudent) {
      navigate("/");
    }
  }, [isStudent, navigate, location]);

  return isStudent ? (
    <div className="text-default min-h-screen bg-white">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <Loading />
  );
};

export default StudentHome;
