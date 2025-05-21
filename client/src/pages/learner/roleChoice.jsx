import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

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
        return;
      }

      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/user/update-role", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setIsStudent(true);
        toast.success(data.message);
        navigate("/student");
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
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-md p-8 m-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Choose Your Role
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Empower yourself through flexible, engaging, and practical online
            learning. Choose a role that best suits your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div
            onClick={handleSelectStudent}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:border-blue-500 group"
          >
            <div className="flex flex-col items-center text-center">
              <FaUserGraduate className="text-blue-600 h-16 w-16 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600">
                Student
              </h3>
              <p className="text-gray-600 text-sm">
                Access your courses, track progress, and engage with learning
                materials.
              </p>
              <div className="mt-6 mb-2 bg-blue-50 text-blue-600 py-2 px-6 rounded-full font-medium text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                Continue as Student
              </div>
            </div>
          </div>
          <div
            onClick={handleSelectEducator}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:border-green-500 group"
          >
            <div className="flex flex-col items-center text-center">
              <FaChalkboardTeacher className="text-green-600 h-16 w-16 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600">
                Educator
              </h3>
              <p className="text-gray-600 text-sm">
                Create and manage courses, track student progress, and share
                your knowledge.
              </p>
              <div className="mt-6 mb-2 bg-green-50 text-green-600 py-2 px-6 rounded-full font-medium text-sm group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                Continue as Educator
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleChoice;
