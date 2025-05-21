import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../components/instructor/footer";
import Loading from "../../components/learner/Loading";
import Sidebar from "../../components/learner/SettingsSidebar";
import { AppContext } from "../../context/AppContext";

const StudentSettings = () => {
  const { isStudent } = useContext(AppContext);

  return isStudent ? (
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

export default StudentSettings;
