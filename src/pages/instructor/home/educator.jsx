import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../../components/instructor/footer";
import Sidebar from "../../../components/instructor/HomeSidebar";
import Loading from "../../../components/learner/Loading";
import { AppContext } from "../../../context/AppContext";

const EducatorHome = () => {
  const { isEducator, navigate } = useContext(AppContext);

  useEffect(() => {
    const { pathname } = location;

    if (pathname === "/" && isEducator) {
      navigate("/educator/");
    } else if (!isEducator) {
      navigate("/");
    }
  }, [isEducator, navigate, location]);

  return isEducator ? (
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

export default EducatorHome;
