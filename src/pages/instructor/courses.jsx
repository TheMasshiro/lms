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
    <div className="bg-blue-50 min-h-screen p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                My Courses
              </h1>
              <p className="text-gray-600">
                Manage your created courses and track student enrollments
              </p>
            </div>
            <div>
              <button
                onClick={() => navigate("/educator/add-course")}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <FaPlus className="h-5 w-5" />
                Add New Course
              </button>
            </div>
          </div>
        </div>

        {courses && courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md text-center py-12">
            <div className="p-6">
              <HiPlus className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Courses Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't created any courses. Start by creating your first
                course!
              </p>
              <button
                onClick={() => navigate("/educator/add-course")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 mx-auto"
              >
                <FaPlus className="h-5 w-5" />
                Create Your First Course
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses &&
              courses.map((course) => (
                <div
                  key={course._id}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => navigate(`/educator/courses/${course._id}`)}
                >
                  <div className="relative pb-[56.25%] overflow-hidden">
                    <img
                      src={course.courseThumbnail}
                      alt={course.courseTitle}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                      {course.enrolledStudents.length} Students
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {course.courseTitle}
                    </h3>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span className="bg-gray-100 rounded-full px-3 py-1">
                        Code: {course.courseCode}
                      </span>
                      <span>
                        {new Date(course.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <button
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
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
