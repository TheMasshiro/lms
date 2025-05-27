import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { FaUserGraduate, FaChalkboardTeacher, FaArrowRight } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const RoleChoice = () => {
  const {
    isStudent,
    isEducator,
    getToken,
    backendUrl,
    navigate,
    setIsStudent,
    setIsEducator,
  } = useContext(AppContext);

  const handleSelectStudent = async () => {
    try {
      if (isStudent) {
        navigate("/student");
        window.location.reload();
        return;
      }

      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/user/update-role", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setIsStudent(true);
        navigate("/student");
        setTimeout(() => {
          window.location.reload();
        }, 100);
        return;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSelectEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        window.location.reload();
        return;
      }

      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/update-role",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setIsEducator(true);
        navigate("/educator");
        setTimeout(() => {
          window.location.reload();
        }, 100);
        return;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/30 shadow-sm">
            <HiSparkles className="text-indigo-600 h-5 w-5 mr-2" />
            <span className="text-indigo-700 font-medium text-sm">
              Welcome to Learning
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Choose Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Path
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Empower yourself through flexible, engaging, and practical online
            learning. Choose a role that best suits your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            onClick={handleSelectStudent}
            className="group bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-[1.02] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/50 to-blue-200/50 rounded-full -translate-y-20 translate-x-20 group-hover:scale-125 transition-transform duration-500"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaUserGraduate className="text-white h-12 w-12" />
              </div>

              <h3 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                Student
              </h3>

              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-sm">
                Access your courses, track progress, and engage with learning
                materials.
              </p>

              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group-hover:shadow-lg">
                {isStudent ? "Continue Learning" : "Start as Student"}
                <FaArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          <div
            onClick={handleSelectEducator}
            className="group bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-[1.02] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-100/50 to-emerald-200/50 rounded-full -translate-y-20 translate-x-20 group-hover:scale-125 transition-transform duration-500"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-3xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaChalkboardTeacher className="text-white h-12 w-12" />
              </div>

              <h3 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors duration-300">
                Educator
              </h3>

              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-sm">
                Create and manage courses, track student progress, and share your
                knowledge.
              </p>

              <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 group-hover:shadow-lg">
                {isEducator ? "Continue Teaching" : "Start as Educator"}
                <FaArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleChoice;
