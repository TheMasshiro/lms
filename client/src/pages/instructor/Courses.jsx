import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/learner/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { HiPlus } from "react-icons/hi";

const EducatorCourses = () => {
  const { backendUrl, getToken, isEducator, navigate } = useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCourses(data.courses);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
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
                My Courses
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage your created courses and track student enrollments
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <button
                onClick={() => navigate("/educator/add-course")}
                className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FaPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sm:inline">Add New Course</span>
              </button>
            </div>
          </div>
        </div>

        {courses && courses.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md text-center py-8 sm:py-12">
            <div className="p-4 sm:p-6">
              <HiPlus className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                No Courses Yet
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
                You haven't created any courses. Start by creating your first
                course!
              </p>
              <button
                onClick={() => navigate("/educator/add-course")}
                className="px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 mx-auto text-sm sm:text-base"
              >
                <FaPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                Create Your First Course
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {courses &&
              courses.map((course) => (
                <div
                  key={course._id}
                  className="group bg-white rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/educator/courses/${course._id}`)}
                >
                  <div className="relative pb-[56.25%] overflow-hidden">
                    <img
                      src={course.courseThumbnail}
                      alt={course.courseTitle}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                      {course.enrolledStudents.length} Students
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {course.courseTitle}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <span className="bg-gray-100 rounded-full px-2 sm:px-3 py-1 text-center sm:text-left">
                        Code: {course.courseCode}
                      </span>
                      <span className="text-center sm:text-right">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                      <button
                        className="w-full sm:w-auto text-gray-600 hover:text-gray-800 text-xs sm:text-sm font-medium text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/educator/courses/${course._id}`);
                        }}
                      >
                        Preview Course
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducatorCourses;
