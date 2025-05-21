import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../components/instructor/footer";
import Sidebar from "../../components/instructor/SettingsSidebar";
import Loading from "../../components/learner/Loading";
import { AppContext } from "../../context/AppContext";

const EducatorSettings = () => {
  const { isEducator } = useContext(AppContext);

  return isEducator ? (
    <div className="text-default min-h-screen bg-white">
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

export default EducatorSettings;
