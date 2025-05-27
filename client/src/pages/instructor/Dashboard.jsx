import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/learner/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { 
  FaUsers, 
  FaBook, 
  FaUserFriends, 
  FaChartLine, 
  FaSync, 
  FaArrowRight 
} from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";

const Dashboard = () => {
  const { backendUrl, getToken, isEducator, navigate, userData } =
    useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalCourses: 0,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();

      const studentsResponse = await axios.get(
        backendUrl + "/api/educator/my-students",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const coursesResponse = await axios.get(
        backendUrl + "/api/educator/courses",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDashboardData({
        totalStudents: studentsResponse.data.success
          ? studentsResponse.data.students.length
          : 0,
        totalCourses: coursesResponse.data.success
          ? coursesResponse.data.courses.length
          : 0,
      });

      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator]);

  if (!isEducator || isLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-blue-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                {getGreeting()}, {userData.name}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Here's an overview of your teaching activity
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm text-gray-500">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Total Students
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {dashboardData.totalStudents}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                <FaUsers className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">My Courses</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {dashboardData.totalCourses}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                <FaBook className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div
            onClick={() => navigate("/educator/students")}
            className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Student Management
              </h3>
              <div className="p-2 bg-blue-100 rounded-full">
                <FaUserFriends className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Manage your students and their course enrollments. Add new
              students or remove existing ones.
            </p>
            <div className="flex items-center text-blue-600 font-medium text-sm sm:text-base">
              <span>Manage Students</span>
              <FaArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1" />
            </div>
          </div>

          <div
            onClick={() => navigate("/educator/progress")}
            className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Student Progress
              </h3>
              <div className="p-2 bg-green-100 rounded-full">
                <FaChartLine className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Track student progress across your courses. See completion rates
              and identify students who may need assistance.
            </p>
            <div className="flex items-center text-green-600 font-medium text-sm sm:text-base">
              <span>View Progress</span>
              <FaArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1" />
            </div>
          </div>

          <div
            onClick={() => navigate("/educator/courses")}
            className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                My Courses
              </h3>
              <div className="p-2 bg-purple-100 rounded-full">
                <GiBookshelf className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Manage your created courses, edit content, and add new materials.
              Create new courses or update existing ones.
            </p>
            <div className="flex items-center text-purple-600 font-medium text-sm sm:text-base">
              <span>View Courses</span>
              <FaArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1" />
            </div>
          </div>
        </div>

        <div className="flex justify-center sm:justify-end">
          <button
            onClick={fetchDashboardData}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 w-full sm:w-auto"
          >
            <FaSync className="h-4 w-4 mr-2" />
            Refresh Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
